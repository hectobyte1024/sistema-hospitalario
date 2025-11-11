import { useState, useEffect } from 'react';
import * as db from '../services/database';
import { createDefaultUsers } from '../services/auth';

// Hook to manage patients from database
export function usePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await db.getAllPatients();
      setPatients(data);
      setError(null);
    } catch (err) {
      console.error('Error loading patients:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const addPatient = async (patient) => {
    try {
      await db.createPatient(patient);
      await loadPatients();
    } catch (err) {
      console.error('Error adding patient:', err);
      throw err;
    }
  };

  const updatePatient = async (id, patient) => {
    try {
      await db.updatePatient(id, patient);
      await loadPatients();
    } catch (err) {
      console.error('Error updating patient:', err);
      throw err;
    }
  };

  const removePatient = async (id) => {
    try {
      await db.deletePatient(id);
      await loadPatients();
    } catch (err) {
      console.error('Error removing patient:', err);
      throw err;
    }
  };

  return {
    patients,
    loading,
    error,
    refresh: loadPatients,
    addPatient,
    updatePatient,
    removePatient
  };
}

// Hook to manage appointments from database
export function useAppointments(patientId = null) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = patientId 
        ? await db.getAppointmentsByPatientId(patientId)
        : await db.getAllAppointments();
      setAppointments(data);
      setError(null);
    } catch (err) {
      console.error('Error loading appointments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [patientId]);

  const addAppointment = async (appointment) => {
    try {
      await db.createAppointment(appointment);
      await loadAppointments();
    } catch (err) {
      console.error('Error adding appointment:', err);
      throw err;
    }
  };

  return {
    appointments,
    loading,
    error,
    refresh: loadAppointments,
    addAppointment
  };
}

// Hook to manage treatments
export function useTreatments(patientId = null) {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTreatments = async () => {
    try {
      setLoading(true);
      const data = patientId
        ? await db.getTreatmentsByPatientId(patientId)
        : await db.getAllTreatments();
      setTreatments(data);
    } catch (err) {
      console.error('Error loading treatments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTreatments();
  }, [patientId]);

  const addTreatment = async (treatment) => {
    await db.createTreatment(treatment);
    await loadTreatments();
  };

  return { treatments, loading, refresh: loadTreatments, addTreatment };
}

// Hook to manage vital signs
export function useVitalSigns(patientId = null) {
  const [vitalSigns, setVitalSigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadVitalSigns = async () => {
    try {
      setLoading(true);
      const data = patientId
        ? await db.getVitalSignsByPatientId(patientId)
        : await db.getAllVitalSigns();
      setVitalSigns(data);
    } catch (err) {
      console.error('Error loading vital signs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVitalSigns();
  }, [patientId]);

  const addVitalSigns = async (vitalSigns) => {
    await db.createVitalSigns(vitalSigns);
    await loadVitalSigns();
  };

  return { vitalSigns, loading, refresh: loadVitalSigns, addVitalSigns };
}

// Hook to manage nurse notes
export function useNurseNotes(patientId = null) {
  const [nurseNotes, setNurseNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNurseNotes = async () => {
    try {
      setLoading(true);
      const data = patientId
        ? await db.getNurseNotesByPatientId(patientId)
        : await db.getAllNurseNotes();
      setNurseNotes(data);
    } catch (err) {
      console.error('Error loading nurse notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNurseNotes();
  }, [patientId]);

  const addNurseNote = async (note) => {
    await db.createNurseNote(note);
    await loadNurseNotes();
  };

  return { nurseNotes, loading, refresh: loadNurseNotes, addNurseNote };
}

// Initialize database on app load
export async function initializeApp() {
  try {
    console.log('Initializing application...');
    await db.initDatabase();
    await createDefaultUsers();
    console.log('✓ Application initialized successfully');
  } catch (err) {
    console.error('Failed to initialize app:', err);
    throw err;
  }
}
