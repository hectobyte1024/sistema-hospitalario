import { getUserByUsername, createUser } from './database';

// Simple hash function using Web Crypto API
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Verify password
async function verifyPassword(password, hash) {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// Login function
export async function login(username, password) {
  try {
    // Get user from database
    const user = await getUserByUsername(username);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    
    if (!isValid) {
      throw new Error('Contraseña incorrecta');
    }

    // Return user data (without password hash)
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
      email: user.email
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Register new user
export async function register(userData) {
  try {
    // Check if user already exists
    const existingUser = await getUserByUsername(userData.username);
    
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password);

    // Create user
    await createUser({
      username: userData.username,
      password_hash: passwordHash,
      role: userData.role,
      name: userData.name,
      email: userData.email
    });

    console.log('User registered successfully');
    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Create default users if they don't exist
export async function createDefaultUsers() {
  try {
    // Check if admin user exists
    const adminExists = await getUserByUsername('admin');
    if (!adminExists) {
      await register({
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'Administrador',
        email: 'admin@hospital.com'
      });
      console.log('✓ Default admin user created (username: admin, password: admin123)');
    }

    // Create default nurse user
    const nurseExists = await getUserByUsername('enfermero');
    if (!nurseExists) {
      await register({
        username: 'enfermero',
        password: 'enfermero123',
        role: 'nurse',
        name: 'Enfermero Juan López',
        email: 'enfermero@hospital.com'
      });
      console.log('✓ Default nurse user created (username: enfermero, password: enfermero123)');
    }

    // Create default patient user
    const patientExists = await getUserByUsername('paciente');
    if (!patientExists) {
      await register({
        username: 'paciente',
        password: 'paciente123',
        role: 'patient',
        name: 'Juan Pérez',
        email: 'paciente@hospital.com'
      });
      console.log('✓ Default patient user created (username: paciente, password: paciente123)');
    }
  } catch (error) {
    console.error('Error creating default users:', error);
  }
}

// Logout function (clears session)
export function logout() {
  // In a real app, this would clear tokens/sessions
  console.log('User logged out');
  return { success: true };
}
