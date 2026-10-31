import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Role, User } from '../types';
import { supabase } from '../services/supabaseDatabase';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (studentId: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAdmin: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('active_user_id', currentUser.id);
    } else if (!isInitializing) {
      localStorage.removeItem('active_user_id');
    }
  }, [currentUser, isInitializing]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase.from('users').select('*')
          .then(({ data: allUsers }) => {
            if (allUsers) {
              setUsers(allUsers.map(row => ({
                id: row.id,
                full_name: row.full_name || 'Unknown',
                role: row.role as Role,
                studentId: row.student_id,
                section: row.section
              })));
            }
          }).then(undefined, err => console.error('Error fetching all users:', err));

        // Fetch user details from public.users
        supabase.from('users').select('*').eq('id', session.user.id).single()
          .then(({ data, error }) => {
            if (data && !error) {
              setCurrentUser({
                id: data.id,
                full_name: data.full_name || 'Unknown',
                role: data.role as Role,
                studentId: data.student_id,
                section: data.section
              });
            } else {
              supabase.auth.signOut();
            }
            setIsInitializing(false);
          }).then(undefined, (err) => {
            console.error('Error fetching current user:', err);
            setIsInitializing(false);
          });
      } else {
        setIsInitializing(false);
      }
    }).catch(() => setIsInitializing(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase.from('users').select('*').eq('id', session.user.id).single()
          .then(({ data, error }) => {
            if (data && !error) {
              setCurrentUser({
                id: data.id,
                full_name: data.full_name || 'Unknown',
                role: data.role as Role,
                studentId: data.student_id,
                section: data.section
              });
            } else {
              supabase.auth.signOut();
              setCurrentUser(null);
            }
          }).then(undefined, err => console.error('Error fetching current user on auth state change:', err));
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (studentId: string, password = ''): Promise<{ success: boolean; message?: string }> => {
    const trimmedStudentId = studentId.trim();
    const trimmedPassword = password.trim();
    
    if (!trimmedStudentId || !trimmedPassword) {
      return { success: false, message: 'Please enter your Student ID and password.' };
    }

    try {
      // In this system, studentId is passed in.
      // Supabase natively requires an email address for password-based login. 
      // We intercept the input Student ID and append @gradeflow.local
      let emailToUse = '';
      const lowerId = trimmedStudentId.toLowerCase();
      
      if (lowerId.includes('@')) {
        emailToUse = lowerId;
      } else if (lowerId === 'admin' || lowerId === 'ali ricky') {
        emailToUse = 'admin@gradeflow.local';
      } else {
        const numericId = trimmedStudentId.replace(/\D/g, '');
        const baseId = numericId.length > 0 ? numericId : lowerId;
        emailToUse = `${baseId}@gradeflow.local`;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: trimmedPassword
      });

      if (error || !data.user) {
        return { success: false, message: 'Invalid Student ID or password.' };
      }

      // Fetch user details from public.users to ensure the profile exists
      const { data: profile, error: profileError } = await supabase.from('users').select('*').eq('id', data.user.id).single();

      if (!profile || profileError) {
        await supabase.auth.signOut();
        return { success: false, message: 'Profile synchronization error. Please contact the administrator.' };
      }

      return { success: true };
    } catch (err) {
      return { success: false, message: 'An error occurred during authentication.' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const isAdmin = currentUser?.role === 'admin';
  const isStudent = currentUser?.role === 'student';

  const contextValue = useMemo(() => ({
    currentUser,
    users,
    login,
    logout,
    isAdmin,
    isStudent,
  }), [currentUser, users, isAdmin, isStudent]);

  return (
    <AuthContext.Provider value={contextValue}>
      {!isInitializing ? children : (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#000000] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
