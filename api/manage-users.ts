import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Robust environment variable loading for both local dev and server environments
const possibleEnvPaths = [
  path.resolve(process.cwd(), '.env.local'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../.env.local'),
  path.resolve(process.cwd(), '../.env')
];

for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

// Support Vite's VITE_ prefix as a fallback for local dev
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Server misconfiguration: Missing Supabase credentials' });
  }

  // 1. Strict Authorization Gate: Extract and verify JWT
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or malformed Authorization header' });
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Empty bearer token' });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Verify caller's identity via Supabase Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !authData?.user) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired session token' });
  }

  const callerUser = authData.user;

  // Verify caller possesses administrative role
  const { data: callerProfile, error: profileError } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', callerUser.id)
    .single();

  const callerRole = callerProfile?.role || callerUser.user_metadata?.role;
  if (callerRole !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Administrative privileges required' });
  }

  if (req.method === 'POST') {
    const { password, name, role, student_id, section, email } = req.body || {};

    // Input boundary validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Field "name" is required and must be non-empty.' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Field "password" is required and must be at least 6 characters.' });
    }

    const assignedRole = role === 'admin' ? 'admin' : 'student';

    try {
      const authEmail = assignedRole === 'student' 
        ? `${String(student_id || '').trim()}@gradeflow.local` 
        : String(email || '').trim().toLowerCase();
      
      if (!authEmail || !authEmail.includes('@')) {
        return res.status(400).json({ error: assignedRole === 'admin' ? 'Valid email is required for admin accounts.' : 'Valid student ID is required.' });
      }
      
      // 1. Create auth user securely
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: authEmail,
        password: password.trim(),
        email_confirm: true,
        user_metadata: { full_name: name.trim(), role: assignedRole }
      });
      
      if (error) {
        console.error("Auth Admin createUser error:", error);
        return res.status(400).json({ error: error.message });
      }

      const newUser = data.user;
      
      // 2. Insert into users table (NEVER store plaintext raw_password)
      const { error: dbError } = await supabaseAdmin.from('users').upsert({
        id: newUser.id,
        full_name: name.trim(),
        role: assignedRole,
        student_id: assignedRole === 'student' ? String(student_id || '').trim() : null,
        section: section ? String(section).trim() : null
      });
      
      if (dbError) {
        // Rollback auth user creation if db insert fails to maintain atomicity
        await supabaseAdmin.auth.admin.deleteUser(newUser.id);
        console.error("Database user profile insert error:", dbError);
        return res.status(500).json({ error: 'Failed to create user profile in database.' });
      }
      
      return res.status(200).json({ 
        user: { id: newUser.id, email: authEmail, full_name: name.trim(), role: assignedRole }, 
        message: 'User created successfully' 
      });
    } catch (error: any) {
      return res.status(500).json({ error: error?.message || 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    const { userId } = req.body || {};
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Field "userId" is required and must be a valid ID string.' });
    }

    if (userId === callerUser.id) {
      return res.status(400).json({ error: 'Cannot delete your own active administrative account.' });
    }

    try {
      // Delete from public.users first
      const { error: dbError } = await supabaseAdmin.from('users').delete().eq('id', userId);
      if (dbError) {
        console.error("Database delete error:", dbError);
      }
      
      // Delete from auth.users
      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (authDeleteError) {
        console.error("Auth deleteUser error:", authDeleteError);
        return res.status(400).json({ error: authDeleteError.message });
      }
      
      return res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ error: error?.message || 'Internal server error' });
    }
  } else if (req.method === 'PATCH') {
    const { userId, newPassword } = req.body || {};

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Field "userId" is required and must be a valid ID string.' });
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 6) {
      return res.status(400).json({ error: 'Field "newPassword" is required and must be at least 6 characters.' });
    }

    try {
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword.trim()
      });

      if (updateError) {
        console.error("Auth updateUserById error:", updateError);
        return res.status(400).json({ error: updateError.message });
      }

      // Explicitly ensure zero plaintext passwords are saved in public.users
      await supabaseAdmin.from('users').update({ raw_password: null }).eq('id', userId);

      return res.status(200).json({ 
        success: true, 
        message: 'Password updated successfully' 
      });
    } catch (error: any) {
      return res.status(500).json({ error: error?.message || 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'DELETE', 'PATCH']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
