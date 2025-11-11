import Database from '@tauri-apps/plugin-sql';

let db = null;

// Initialize database connection
export async function initDatabase() {
  if (db) return db;
  
  try {
    // Create or connect to SQLite database
    console.log('Initializing SQLite database...');
    db = await Database.load('sqlite:hospital.db');
    console.log('Database loaded successfully');
    
    // Create tables if they don't exist
    await createTables();
    
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw new Error(`Database initialization failed: ${error.message || error}`);
  }
}

// Create all database tables
async function createTables() {
  try {
    console.log('Creating database tables...');
    
    // Patients table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        room TEXT NOT NULL,
        condition TEXT NOT NULL,
        admission_date TEXT NOT NULL,
        blood_type TEXT NOT NULL,
        allergies TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Patients table created');

    // Users table for authentication
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Users table created');

    // Appointments table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER,
        patient_name TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        doctor TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id)
      )
    `);
    console.log('✓ Appointments table created');

  // Treatments table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS treatments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      medication TEXT NOT NULL,
      dose TEXT NOT NULL,
      frequency TEXT NOT NULL,
      start_date TEXT NOT NULL,
      applied_by TEXT NOT NULL,
      last_application TEXT NOT NULL,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id)
    )
  `);

  // Vital signs table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS vital_signs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      temperature TEXT NOT NULL,
      blood_pressure TEXT NOT NULL,
      heart_rate TEXT NOT NULL,
      respiratory_rate TEXT NOT NULL,
      registered_by TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id)
    )
  `);

  // Lab tests table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS lab_tests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      test TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      results TEXT,
      ordered_by TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id)
    )
  `);

  // Medical history table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS medical_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      diagnosis TEXT NOT NULL,
      treatment TEXT NOT NULL,
      notes TEXT,
      doctor TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id)
    )
  `);

  // Nurse notes table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS nurse_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      note TEXT NOT NULL,
      nurse_name TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id)
    )
  `);

  console.log('✓ Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw new Error(`Failed to create tables: ${error.message || error}`);
  }
}

// ========== PATIENT OPERATIONS ==========

export async function getAllPatients() {
  const db = await initDatabase();
  return await db.select('SELECT * FROM patients ORDER BY id DESC');
}

export async function getPatientById(id) {
  const db = await initDatabase();
  const results = await db.select('SELECT * FROM patients WHERE id = ?', [id]);
  return results[0];
}

export async function createPatient(patient) {
  const db = await initDatabase();
  const result = await db.execute(
    `INSERT INTO patients (name, age, room, condition, admission_date, blood_type, allergies)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [patient.name, patient.age, patient.room, patient.condition, patient.admissionDate, patient.bloodType, patient.allergies]
  );
  return result.lastInsertId;
}

export async function updatePatient(id, patient) {
  const db = await initDatabase();
  await db.execute(
    `UPDATE patients 
     SET name = ?, age = ?, room = ?, condition = ?, blood_type = ?, allergies = ?
     WHERE id = ?`,
    [patient.name, patient.age, patient.room, patient.condition, patient.bloodType, patient.allergies, id]
  );
}

export async function deletePatient(id) {
  const db = await initDatabase();
  await db.execute('DELETE FROM patients WHERE id = ?', [id]);
}

// ========== APPOINTMENT OPERATIONS ==========

export async function getAllAppointments() {
  const db = await initDatabase();
  return await db.select('SELECT * FROM appointments ORDER BY date, time');
}

export async function getAppointmentsByPatientId(patientId) {
  const db = await initDatabase();
  return await db.select('SELECT * FROM appointments WHERE patient_id = ? ORDER BY date, time', [patientId]);
}

export async function createAppointment(appointment) {
  const db = await initDatabase();
  const result = await db.execute(
    `INSERT INTO appointments (patient_id, patient_name, date, time, type, status, doctor)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [appointment.patientId, appointment.patientName, appointment.date, appointment.time, appointment.type, appointment.status, appointment.doctor]
  );
  return result.lastInsertId;
}

export async function updateAppointment(id, appointment) {
  const db = await initDatabase();
  await db.execute(
    `UPDATE appointments 
     SET patient_name = ?, date = ?, time = ?, type = ?, status = ?, doctor = ?
     WHERE id = ?`,
    [appointment.patientName, appointment.date, appointment.time, appointment.type, appointment.status, appointment.doctor, id]
  );
}

export async function deleteAppointment(id) {
  const db = await initDatabase();
  await db.execute('DELETE FROM appointments WHERE id = ?', [id]);
}

// ========== TREATMENT OPERATIONS ==========

export async function getAllTreatments() {
  const db = await initDatabase();
  return await db.select('SELECT * FROM treatments ORDER BY id DESC');
}

export async function getTreatmentsByPatientId(patientId) {
  const db = await initDatabase();
  return await db.select('SELECT * FROM treatments WHERE patient_id = ? ORDER BY id DESC', [patientId]);
}

export async function createTreatment(treatment) {
  const db = await initDatabase();
  const result = await db.execute(
    `INSERT INTO treatments (patient_id, medication, dose, frequency, start_date, applied_by, last_application, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [treatment.patientId, treatment.medication, treatment.dose, treatment.frequency, treatment.startDate, treatment.appliedBy, treatment.lastApplication, treatment.notes]
  );
  return result.lastInsertId;
}

// ========== VITAL SIGNS OPERATIONS ==========

export async function getAllVitalSigns() {
  const db = await initDatabase();
  return await db.select('SELECT * FROM vital_signs ORDER BY date DESC');
}

export async function getVitalSignsByPatientId(patientId) {
  const db = await initDatabase();
  return await db.select('SELECT * FROM vital_signs WHERE patient_id = ? ORDER BY date DESC', [patientId]);
}

export async function createVitalSigns(vitalSigns) {
  const db = await initDatabase();
  const result = await db.execute(
    `INSERT INTO vital_signs (patient_id, date, temperature, blood_pressure, heart_rate, respiratory_rate, registered_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [vitalSigns.patientId, vitalSigns.date, vitalSigns.temperature, vitalSigns.bloodPressure, vitalSigns.heartRate, vitalSigns.respiratoryRate, vitalSigns.registeredBy]
  );
  return result.lastInsertId;
}

// ========== LAB TEST OPERATIONS ==========

export async function getAllLabTests() {
  const db = await initDatabase();
  return await db.select('SELECT * FROM lab_tests ORDER BY date DESC');
}

export async function getLabTestsByPatientId(patientId) {
  const db = await initDatabase();
  return await db.select('SELECT * FROM lab_tests WHERE patient_id = ? ORDER BY date DESC', [patientId]);
}

export async function createLabTest(labTest) {
  const db = await initDatabase();
  const result = await db.execute(
    `INSERT INTO lab_tests (patient_id, test, date, status, results, ordered_by)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [labTest.patientId, labTest.test, labTest.date, labTest.status, labTest.results, labTest.orderedBy]
  );
  return result.lastInsertId;
}

// ========== MEDICAL HISTORY OPERATIONS ==========

export async function getAllMedicalHistory() {
  const db = await initDatabase();
  return await db.select('SELECT * FROM medical_history ORDER BY date DESC');
}

export async function getMedicalHistoryByPatientId(patientId) {
  const db = await initDatabase();
  return await db.select('SELECT * FROM medical_history WHERE patient_id = ? ORDER BY date DESC', [patientId]);
}

export async function createMedicalHistory(record) {
  const db = await initDatabase();
  const result = await db.execute(
    `INSERT INTO medical_history (patient_id, date, diagnosis, treatment, notes, doctor)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [record.patientId, record.date, record.diagnosis, record.treatment, record.notes, record.doctor]
  );
  return result.lastInsertId;
}

// ========== NURSE NOTES OPERATIONS ==========

export async function getAllNurseNotes() {
  const db = await initDatabase();
  return await db.select('SELECT * FROM nurse_notes ORDER BY date DESC');
}

export async function getNurseNotesByPatientId(patientId) {
  const db = await initDatabase();
  return await db.select('SELECT * FROM nurse_notes WHERE patient_id = ? ORDER BY date DESC', [patientId]);
}

export async function createNurseNote(note) {
  const db = await initDatabase();
  const result = await db.execute(
    `INSERT INTO nurse_notes (patient_id, date, note, nurse_name)
     VALUES (?, ?, ?, ?)`,
    [note.patientId, note.date, note.note, note.nurseName]
  );
  return result.lastInsertId;
}

// ========== DATA SEEDING (for initial demo data) ==========

export async function seedInitialData() {
  const db = await initDatabase();
  
  // Check if data already exists
  const existingPatients = await db.select('SELECT COUNT(*) as count FROM patients');
  if (existingPatients[0].count > 0) {
    console.log('✓ Database already has data, skipping seed');
    return;
  }

  console.log('Seeding initial data...');

  // Seed patients
  await createPatient({
    name: 'Juan Pérez',
    age: 45,
    room: '201',
    condition: 'Estable',
    admissionDate: '2025-10-25',
    bloodType: 'O+',
    allergies: 'Penicilina'
  });

  await createPatient({
    name: 'María González',
    age: 62,
    room: '305',
    condition: 'Crítico',
    admissionDate: '2025-10-27',
    bloodType: 'A+',
    allergies: 'Ninguna'
  });

  await createPatient({
    name: 'Carlos Rodríguez',
    age: 38,
    room: '102',
    condition: 'Recuperación',
    admissionDate: '2025-10-23',
    bloodType: 'B+',
    allergies: 'Aspirina'
  });

  console.log('✓ Initial data seeded successfully');
}

// ==================== USER AUTHENTICATION ====================

// Get user by username
export async function getUserByUsername(username) {
  try {
    const result = await db.select(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

// Create new user
export async function createUser(userData) {
  try {
    await db.execute(
      'INSERT INTO users (username, password_hash, role, name, email) VALUES ($1, $2, $3, $4, $5)',
      [userData.username, userData.password_hash, userData.role, userData.name, userData.email || null]
    );
    console.log('User created successfully');
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Get all users (admin only)
export async function getAllUsers() {
  try {
    return await db.select('SELECT id, username, role, name, email, created_at FROM users');
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
}

// Update user
export async function updateUser(id, userData) {
  try {
    await db.execute(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3',
      [userData.name, userData.email || null, id]
    );
    console.log('User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// Delete user
export async function deleteUser(id) {
  try {
    await db.execute('DELETE FROM users WHERE id = $1', [id]);
    console.log('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}
