import { generateSalt, hashPassword, verifyPassword } from './crypto';

describe('crypto utils', () => {
  it('generates a salt of correct length', async () => {
    const salt = await generateSalt();
    expect(typeof salt).toBe('string');
    expect(salt.length).toBe(32); // 16 bytes = 32 hex chars
  });

  it('hashes and verifies a password successfully', async () => {
    const password = 'mySecretPassword123!';
    const salt = await generateSalt();
    const hash = await hashPassword(password, salt);
    
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(0);
    
    const isValid = await verifyPassword(password, salt, hash);
    expect(isValid).toBe(true);
  });

  it('fails verification with wrong password', async () => {
    const password = 'mySecretPassword123!';
    const salt = await generateSalt();
    const hash = await hashPassword(password, salt);
    
    const isValid = await verifyPassword('wrongpassword', salt, hash);
    expect(isValid).toBe(false);
  });
});
