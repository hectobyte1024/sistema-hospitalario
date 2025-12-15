import React, { useState, useEffect, useCallback, lazy, Suspense, useMemo } from 'react';
import { Calendar, Clock, User, FileText, Activity, Users, Pill, TestTube, LogOut, Heart, Stethoscope, Brain, Eye, Bone, AlertCircle, CheckCircle, Menu, X, Phone, Moon, Sun, Settings, Package, Hospital, Scissors, MessageSquare, BarChart3, Scan, Keyboard as KeyboardIcon, UserCheck } from 'lucide-react';
import { usePatients, useAppointments, useTreatments, useVitalSigns, useNurseNotes, usePatientTransfers, useNonPharmaTreatments } from './hooks/useDatabase';
import { logout as authLogout } from './services/auth';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import NotificationCenter from './components/NotificationCenter';
import SearchBar from './components/SearchBar';
import ErrorBoundary from './components/ErrorBoundary';
import GuidedTour from './components/GuidedTour';
import KeyboardShortcuts, { useKeyboardShortcuts } from './components/KeyboardShortcuts';
import Tooltip, { HelpTooltip } from './components/Tooltip';
import Breadcrumbs from './components/Breadcrumbs';
import { useDebounce, useCachedData, usePagination, dataCache } from './utils/performanceOptimizations';

// Lazy loading de componentes pesados para mejorar rendimiento inicial
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const DoctorDashboard = lazy(() => import('./components/DoctorDashboard'));
const UserProfile = lazy(() => import('./components/UserProfile'));
const AppointmentCalendar = lazy(() => import('./components/AppointmentCalendar'));
const PharmacyManagement = lazy(() => import('./components/PharmacyManagement'));
const EmergencyRoom = lazy(() => import('./components/EmergencyRoom'));
const SettingsPage = lazy(() => import('./components/SettingsPage'));
const SurgeryScheduling = lazy(() => import('./components/SurgeryScheduling'));
const MessagingSystem = lazy(() => import('./components/MessagingSystem'));
const ReportsAnalytics = lazy(() => import('./components/ReportsAnalytics'));
const LabManagement = lazy(() => import('./components/LabManagement'));
const RadiologyManagement = lazy(() => import('./components/RadiologyManagement'));
const AdvancedDashboard = lazy(() => import('./components/AdvancedDashboard'));

// Componente de loading para Suspense
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4 animate-pulse">
        <Activity className="text-white" size={32} />
      </div>
      <p className="text-gray-600 font-semibold text-lg">Cargando módulo...</p>
      <p className="text-gray-500 text-sm mt-2">Optimizando rendimiento</p>
    </div>
  </div>
);

// Triage helper function - Escala institucional de triaje
const getTriageInfo = (level) => {
  const triageScales = {
    1: { 
      name: 'Rojo - Resucitación',
      color: 'bg-red-600',
      borderColor: 'border-red-600',
      textColor: 'text-red-600',
      bgLight: 'bg-red-50',
      description: 'Emergencia vital inmediata',
      icon: '🔴',
      priority: 'Inmediata'
    },
    2: { 
      name: 'Naranja - Emergencia',
      color: 'bg-orange-500',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-600',
      bgLight: 'bg-orange-50',
      description: 'Emergencia, atención en 10 min',
      icon: '🟠',
      priority: '10 minutos'
    },
    3: { 
      name: 'Amarillo - Urgente',
      color: 'bg-yellow-500',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-700',
      bgLight: 'bg-yellow-50',
      description: 'Urgente, atención en 30 min',
      icon: '🟡',
      priority: '30 minutos'
    },
    4: { 
      name: 'Verde - Menos Urgente',
      color: 'bg-green-500',
      borderColor: 'border-green-500',
      textColor: 'text-green-700',
      bgLight: 'bg-green-50',
      description: 'Menos urgente, atención en 60 min',
      icon: '🟢',
      priority: '60 minutos'
    },
    5: { 
      name: 'Azul - No Urgente',
      color: 'bg-blue-500',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-700',
      bgLight: 'bg-blue-50',
      description: 'No urgente, atención en 120 min',
      icon: '🔵',
      priority: '120 minutos'
    }
  };
  
  return triageScales[level] || triageScales[3]; // Default to yellow if not specified
};

const HospitalManagementSystem = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+f': (e) => {
      e.preventDefault();
      document.getElementById('search-input')?.focus();
    },
    'f1': (e) => {
      e.preventDefault();
      setShowKeyboardShortcuts(true);
    },
    'escape': () => {
      setShowKeyboardShortcuts(false);
    },
    'alt+1': () => setCurrentView('dashboard'),
    'alt+h': () => setCurrentView('home'),
  });

  // Handle search results
  const handleSearchResult = (result) => {
    console.log('Search result clicked:', result);
    // Navigate to appropriate view based on result type
    if (result.type === 'patient') {
      setSelectedPatient(result.data);
      if (currentUser?.role === 'nurse') {
        setCurrentView('patients');
      }
    }
  };
  
  // Use database hook for patients instead of mock data
  const { patients, loading: patientsLoading, addPatient, updatePatient, removePatient } = usePatients();
  
  // Use database hook for appointments
  const { appointments, loading: appointmentsLoading, addAppointment: addAppointmentDB } = useAppointments();
  
  // Use database hook for treatments
  const { treatments, loading: treatmentsLoading, addTreatment: addTreatmentDB } = useTreatments();
  
  // Use database hook for vital signs
  const { vitalSigns, loading: vitalSignsLoading, addVitalSigns: addVitalSignsDB } = useVitalSigns();
  
  // Use database hook for nurse notes
  const { nurseNotes, loading: nurseNotesLoading, addNurseNote: addNurseNoteDB } = useNurseNotes();

  // Use database hook for non-pharmaceutical treatments
  const { nonPharmaTreatments, loading: nonPharmaTreatmentsLoading, addNonPharmaTreatment: addNonPharmaTreatmentDB } = useNonPharmaTreatments();

  // Keep lab tests and medical history as local state for now (can be migrated later)
  const [labTests, setLabTests] = useState([
    { id: 1, patientId: 1, test: 'Hemograma completo', date: '2025-10-28', status: 'Completado', results: 'Normal', orderedBy: 'Dr. Ramírez' },
    { id: 2, patientId: 2, test: 'Resonancia Magnética', date: '2025-10-29', status: 'Pendiente', results: '-', orderedBy: 'Dra. Torres' }
  ]);

  const [medicalHistory, setMedicalHistory] = useState([
    { id: 1, patientId: 1, date: '2025-10-25', diagnosis: 'Hipertensión arterial', treatment: 'Losartán 50mg', notes: 'Paciente con control regular de presión arterial', doctor: 'Dr. Ramírez' },
    { id: 2, patientId: 2, date: '2025-10-27', diagnosis: 'Accidente cerebrovascular', treatment: 'Tratamiento de emergencia', notes: 'Ingreso por urgencias, requiere monitoreo constante', doctor: 'Dra. Torres' }
  ]);

  const [patientTransfers, setPatientTransfers] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const specialties = [
    { name: 'Cardiología', icon: Heart, description: 'Cuidado del corazón y sistema cardiovascular' },
    { name: 'Neurología', icon: Brain, description: 'Tratamiento del sistema nervioso' },
    { name: 'Oftalmología', icon: Eye, description: 'Especialistas en salud visual' },
    { name: 'Traumatología', icon: Bone, description: 'Tratamiento de huesos y articulaciones' },
    { name: 'Medicina General', icon: Stethoscope, description: 'Atención médica integral' }
  ];

  const handleLoginSuccess = async (user) => {
    // Map role to type for backwards compatibility
    setCurrentUser({
      ...user,
      type: user.role === 'nurse' ? 'nurse' : user.role === 'patient' ? 'patient' : 'admin'
    });
    setCurrentView('dashboard');
    
    // Initialize sample nurse data if user is a nurse
    if (user.role === 'nurse') {
      try {
        const { initializeSampleNurseData } = await import('./services/database');
        await initializeSampleNurseData();
      } catch (error) {
        console.error('Error initializing nurse data:', error);
      }
    }
  };

  const handleLogout = () => {
    authLogout();
    setCurrentUser(null);
    setCurrentView('home');
    setSelectedPatient(null);
  };

  const scheduleAppointment = async () => {
    if (newAppointment.patientName && newAppointment.date && newAppointment.time && newAppointment.type) {
      const conflictingAppointment = appointments.find(
        apt => apt.date === newAppointment.date && apt.time === newAppointment.time
      );
      
      if (conflictingAppointment) {
        alert('Ya existe una cita programada para esta fecha y hora. Por favor seleccione otro horario.');
        return;
      }

      try {
        const newApt = {
          patient_id: currentUser.type === 'patient' ? currentUser.id : null,
          patient_name: newAppointment.patientName,
          date: newAppointment.date,
          time: newAppointment.time,
          type: newAppointment.type,
          status: 'Pendiente',
          doctor: 'Por asignar'
        };
        await addAppointmentDB(newApt);
        setNewAppointment({ patientName: '', date: '', time: '', type: '' });
        alert('Cita agendada exitosamente');
      } catch (error) {
        console.error('Error scheduling appointment:', error);
        alert('Error al agendar la cita. Por favor intente nuevamente.');
      }
    } else {
      alert('Por favor complete todos los campos');
    }
  };

  const applyTreatment = async () => {
    if (newTreatment.patientId && newTreatment.medication && newTreatment.dose && newTreatment.frequency) {
      // Usar la hora ingresada o la actual
      const now = new Date();
      const dateStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
      
      let applicationTimeStr;
      if (newTreatment.applicationTime) {
        applicationTimeStr = newTreatment.applicationTime;
      } else {
        applicationTimeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
      }
      
      const timestamp = dateStr + ' ' + applicationTimeStr;
      
      try {
        const newTrt = {
          patient_id: parseInt(newTreatment.patientId),
          medication: newTreatment.medication,
          dose: newTreatment.dose,
          frequency: newTreatment.frequency,
          start_date: dateStr,
          applied_by: currentUser.name,
          last_application: timestamp,
          notes: newTreatment.notes
        };
        await addTreatmentDB(newTrt);
        setNewTreatment({ patientId: '', medication: '', dose: '', frequency: '', notes: '', applicationTime: '' });
        alert('💊 Medicamento administrado y registrado exitosamente');
      } catch (error) {
        console.error('Error applying treatment:', error);
        alert('Error al registrar la administración. Por favor intente nuevamente.');
      }
    } else {
      alert('Por favor complete todos los campos obligatorios');
    }
  };

  const applyNonPharmaTreatment = async () => {
    if (newNonPharmaTreatment.patientId && newNonPharmaTreatment.treatmentType && newNonPharmaTreatment.description) {
      try {
        const now = new Date();
        const applicationDate = now.toISOString().split('T')[0];
        
        let applicationTimeStr = now.toTimeString().split(' ')[0].substring(0, 5);
        if (newNonPharmaTreatment.applicationTime) {
          applicationTimeStr = newNonPharmaTreatment.applicationTime;
        }
        
        await addNonPharmaTreatment({
          patient_id: parseInt(newNonPharmaTreatment.patientId),
          treatment_type: newNonPharmaTreatment.treatmentType,
          description: newNonPharmaTreatment.description,
          application_date: applicationDate,
          application_time: applicationTimeStr,
          duration: newNonPharmaTreatment.duration,
          performed_by: currentUser.name,
          materials_used: newNonPharmaTreatment.materialsUsed,
          observations: newNonPharmaTreatment.observations,
          outcome: newNonPharmaTreatment.outcome,
          next_application: newNonPharmaTreatment.nextApplication,
          status: 'Completado'
        });
        
        setNewNonPharmaTreatment({ 
          patientId: '', 
          treatmentType: '', 
          description: '', 
          applicationTime: '', 
          duration: '', 
          materialsUsed: '', 
          observations: '',
          outcome: '',
          nextApplication: ''
        });
        
        alert('✅ Tratamiento no farmacológico registrado exitosamente');
      } catch (error) {
        console.error('Error applying non-pharmacological treatment:', error);
        alert('❌ Error al registrar el tratamiento no farmacológico');
      }
    } else {
      alert('⚠️ Por favor complete los campos requeridos: paciente, tipo de tratamiento y descripción');
    }
  };

  const registerVitalSigns = async () => {
    if (newVitalSigns.patientId && newVitalSigns.temperature && newVitalSigns.bloodPressure && newVitalSigns.heartRate && newVitalSigns.respiratoryRate) {
      // Usar la fecha/hora ingresada o la actual
      let timestamp;
      if (newVitalSigns.dateTime) {
        timestamp = newVitalSigns.dateTime.replace('T', ' ');
      } else {
        const now = new Date();
        timestamp = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
      }
      
      try {
        const newVS = {
          patient_id: parseInt(newVitalSigns.patientId),
          date: timestamp,
          temperature: newVitalSigns.temperature,
          blood_pressure: newVitalSigns.bloodPressure,
          heart_rate: newVitalSigns.heartRate,
          respiratory_rate: newVitalSigns.respiratoryRate,
          registered_by: currentUser.name
        };
        await addVitalSignsDB(newVS);
        setNewVitalSigns({ patientId: '', temperature: '', bloodPressure: '', heartRate: '', respiratoryRate: '', dateTime: '' });
        alert('✅ Signos vitales registrados exitosamente');
      } catch (error) {
        console.error('Error registering vital signs:', error);
        alert('Error al registrar signos vitales. Por favor intente nuevamente.');
      }
    } else {
      alert('Por favor complete todos los campos obligatorios');
    }
  };

  const addNurseNote = async () => {
    if (newNurseNote.patientId && newNurseNote.note) {
      const now = new Date();
      const timestamp = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
      
      try {
        const newNote = {
          patient_id: parseInt(newNurseNote.patientId),
          date: timestamp,
          note: newNurseNote.note,
          note_type: newNurseNote.noteType || 'evolutiva',
          nurse_name: currentUser.name
        };
        await addNurseNoteDB(newNote);
        setNewNurseNote({ patientId: '', note: '', noteType: 'evolutiva' });
        
        // Success message based on note type
        const noteTypeNames = {
          'evolutiva': 'Nota Evolutiva',
          'observacion': 'Observación',
          'incidente': 'Reporte de Incidente',
          'mejora': 'Nota de Mejoría',
          'deterioro': 'Alerta de Deterioro'
        };
        alert(`${noteTypeNames[newNurseNote.noteType] || 'Nota'} registrada exitosamente`);
      } catch (error) {
        console.error('Error adding nurse note:', error);
        alert('Error al registrar nota. Por favor intente nuevamente.');
      }
    } else {
      alert('Por favor seleccione un paciente y escriba la nota');
    }
  };

  const viewPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setCurrentView('patientDetails');
  };

  const PatientDetailsView = () => {
    if (!selectedPatient) return null;
    
    const triageInfo = getTriageInfo(selectedPatient.triage_level || 3);
    const patientTreatments = treatments.filter(t => t.patientId === selectedPatient.id);
    const patientHistory = medicalHistory.filter(h => h.patientId === selectedPatient.id);
    const patientLabs = labTests.filter(l => l.patientId === selectedPatient.id);
    const patientAppointments = appointments.filter(a => a.patientId === selectedPatient.id);
    const patientVitals = vitalSigns.filter(v => v.patientId === selectedPatient.id);
    const patientNotes = nurseNotes.filter(n => n.patientId === selectedPatient.id);
    
    // Load patient transfers
    const { transfers: patientTransfersList } = usePatientTransfers(selectedPatient.id);
    
    // Estados para filtros de signos vitales
    const [vitalFilters, setVitalFilters] = React.useState({
      dateFrom: '',
      dateTo: '',
      shift: 'all' // all, morning, afternoon, night
    });
    
    // Función para determinar el turno según la hora
    const getShiftFromTime = (dateString) => {
      const date = new Date(dateString);
      const hour = date.getHours();
      if (hour >= 7 && hour < 15) return 'morning';
      if (hour >= 15 && hour < 23) return 'afternoon';
      return 'night';
    };
    
    // Filtrar signos vitales
    const filteredVitals = patientVitals.filter(vital => {
      const vitalDate = new Date(vital.date);
      
      // Filtro por fecha desde
      if (vitalFilters.dateFrom) {
        const dateFrom = new Date(vitalFilters.dateFrom);
        dateFrom.setHours(0, 0, 0, 0);
        if (vitalDate < dateFrom) return false;
      }
      
      // Filtro por fecha hasta
      if (vitalFilters.dateTo) {
        const dateTo = new Date(vitalFilters.dateTo);
        dateTo.setHours(23, 59, 59, 999);
        if (vitalDate > dateTo) return false;
      }
      
      // Filtro por turno
      if (vitalFilters.shift !== 'all') {
        const vitalShift = getShiftFromTime(vital.date);
        if (vitalShift !== vitalFilters.shift) return false;
      }
      
      return true;
    });
    
    // Limpiar filtros
    const clearVitalFilters = () => {
      setVitalFilters({
        dateFrom: '',
        dateTo: '',
        shift: 'all'
      });
    };

    return (
      <div className="space-y-4 md:space-y-6">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-3 md:px-4 py-2 text-sm md:text-base bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          ← Volver al Dashboard
        </button>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border-l-4 ${triageInfo.borderColor}">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
              <User className="mr-2 text-blue-600" size={24} />
              Información del Paciente
            </h2>
            {/* Triage Badge */}
            <div className={`${triageInfo.bgLight} border-2 ${triageInfo.borderColor} rounded-xl px-4 py-2 text-center`}>
              <div className="text-3xl mb-1">{triageInfo.icon}</div>
              <div className={`text-xs font-bold ${triageInfo.textColor} uppercase`}>
                Triaje: Nivel {selectedPatient.triage_level || 3}
              </div>
              <div className={`text-xs ${triageInfo.textColor} font-semibold mt-1`}>
                ⏱️ {triageInfo.priority}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Nombre</p>
              <p className="font-semibold text-base md:text-lg">{selectedPatient.name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Edad</p>
              <p className="font-semibold text-base md:text-lg">{selectedPatient.age} años</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Tipo de Sangre</p>
              <p className="font-semibold text-base md:text-lg">{selectedPatient.bloodType}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Alergias</p>
              <p className="font-semibold text-base md:text-lg">{selectedPatient.allergies}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Condición</p>
              <span className={'px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold ' + (selectedPatient.condition === 'Crítico' ? 'bg-red-100 text-red-800' : selectedPatient.condition === 'Estable' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800')}>
                {selectedPatient.condition}
              </span>
            </div>
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Fecha de Ingreso</p>
              <p className="font-semibold text-base md:text-lg">{selectedPatient.admissionDate}</p>
            </div>
          </div>
        </div>

        {/* Ubicación Actual del Paciente */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6 rounded-lg shadow-md border-2 border-blue-200">
          <div className="flex items-center mb-4">
            <div className="bg-blue-500 p-3 rounded-full mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-blue-900">Ubicación Actual</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
              <p className="text-xs text-blue-600 font-semibold mb-1 flex items-center">
                <span className="text-lg mr-1">🏢</span> PISO
              </p>
              <p className="text-2xl font-bold text-blue-900">{selectedPatient.floor || '1'}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
              <p className="text-xs text-blue-600 font-semibold mb-1 flex items-center">
                <span className="text-lg mr-1">🏥</span> ÁREA
              </p>
              <p className="text-lg font-bold text-blue-900">{selectedPatient.area || 'General'}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
              <p className="text-xs text-blue-600 font-semibold mb-1 flex items-center">
                <span className="text-lg mr-1">🚪</span> HABITACIÓN
              </p>
              <p className="text-2xl font-bold text-blue-900">{selectedPatient.room}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
              <p className="text-xs text-blue-600 font-semibold mb-1 flex items-center">
                <span className="text-lg mr-1">🛏️</span> CAMA
              </p>
              <p className="text-2xl font-bold text-blue-900">{selectedPatient.bed || 'A'}</p>
            </div>
          </div>
          
          <div className="mt-4 bg-blue-100 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-semibold text-blue-900">
              📍 Ubicación Completa: Piso {selectedPatient.floor || '1'} • {selectedPatient.area || 'General'} • Hab. {selectedPatient.room} • Cama {selectedPatient.bed || 'A'}
            </p>
          </div>
        </div>

        {/* Historial de Traslados */}
        {patientTransfersList && patientTransfersList.length > 0 && (
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg md:text-xl font-bold flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Historial de Traslados
              </h3>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                {patientTransfersList.length} {patientTransfersList.length === 1 ? 'traslado' : 'traslados'}
              </span>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {patientTransfersList.map((transfer, index) => {
                const transferDate = new Date(transfer.transferDate + ' ' + transfer.transferTime);
                const isRecent = (Date.now() - transferDate.getTime()) < 86400000; // Últimas 24 horas
                
                return (
                  <div key={transfer.id || index} className="border-l-4 border-orange-300 bg-orange-50 rounded-xl p-4 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <span className="font-bold text-gray-800 text-sm">
                          📅 {transferDate.toLocaleDateString('es-ES', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </span>
                        {isRecent && (
                          <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-semibold">
                            RECIENTE
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-bold text-orange-700">
                        🕐 {transfer.transferTime}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      {/* Ubicación Anterior */}
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-red-700 mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Ubicación Anterior
                        </p>
                        <div className="space-y-1 text-sm">
                          <p>🏢 Piso: <span className="font-semibold">{transfer.fromFloor || '-'}</span></p>
                          <p>🏥 Área: <span className="font-semibold">{transfer.fromArea || '-'}</span></p>
                          <p>🚪 Hab: <span className="font-semibold">{transfer.fromRoom || '-'}</span></p>
                          <p>🛏️ Cama: <span className="font-semibold">{transfer.fromBed || '-'}</span></p>
                        </div>
                      </div>
                      
                      {/* Ubicación Nueva */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-green-700 mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Nueva Ubicación
                        </p>
                        <div className="space-y-1 text-sm">
                          <p>🏢 Piso: <span className="font-semibold">{transfer.toFloor}</span></p>
                          <p>🏥 Área: <span className="font-semibold">{transfer.toArea}</span></p>
                          <p>🚪 Hab: <span className="font-semibold">{transfer.toRoom}</span></p>
                          <p>🛏️ Cama: <span className="font-semibold">{transfer.toBed}</span></p>
                        </div>
                      </div>
                    </div>
                    
                    {transfer.reason && (
                      <div className="bg-white border border-orange-200 rounded-lg p-3 mb-3">
                        <p className="text-xs font-semibold text-orange-700 mb-1">📋 Motivo del traslado:</p>
                        <p className="text-sm text-gray-700">{transfer.reason}</p>
                      </div>
                    )}
                    
                    {transfer.notes && (
                      <div className="bg-white border border-orange-200 rounded-lg p-3 mb-3">
                        <p className="text-xs font-semibold text-orange-700 mb-1">📝 Notas adicionales:</p>
                        <p className="text-sm text-gray-700 italic">{transfer.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2 border-t border-orange-200">
                      <p className="text-xs text-gray-600">
                        👤 Trasladado por: <span className="font-semibold">{transfer.transferredBy}</span>
                      </p>
                      <p className="text-xs text-gray-400">#{transfer.id}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl border-2 border-red-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-3 rounded-xl">
                <Activity className="text-red-600" size={32} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">Historial de Signos Vitales</h3>
            </div>
            <span className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-2xl text-lg font-semibold w-fit shadow-lg">
              {filteredVitals.length} de {patientVitals.length} {patientVitals.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>
          
          {/* Filtros */}
          <div className="bg-gradient-to-br from-red-50 via-pink-50 to-red-50 border-4 border-red-300 rounded-2xl p-6 mb-6 shadow-xl hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-xl font-bold text-red-800 flex items-center gap-2">
                <span className="text-2xl">🔍</span> Filtros de Búsqueda
              </h4>
              {(vitalFilters.dateFrom || vitalFilters.dateTo || vitalFilters.shift !== 'all') && (
                <button
                  onClick={clearVitalFilters}
                  className="text-base px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-2xl hover:shadow-lg transition-all font-semibold"
                >
                  ✕ Limpiar
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Filtro de fecha desde */}
              <div>
                <label className="block text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                  <span className="text-xl">📅</span> Fecha Desde
                </label>
                <input
                  type="date"
                  className="w-full px-5 py-4 bg-white border-4 border-red-200 rounded-2xl focus:ring-4 focus:ring-red-500 focus:border-transparent text-lg shadow-lg hover:shadow-xl transition-all font-semibold"
                  value={vitalFilters.dateFrom}
                  onChange={(e) => setVitalFilters(prev => ({...prev, dateFrom: e.target.value}))}
                />
              </div>
              
              {/* Filtro de fecha hasta */}
              <div>
                <label className="block text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                  <span className="text-xl">📅</span> Fecha Hasta
                </label>
                <input
                  type="date"
                  className="w-full px-5 py-4 bg-white border-4 border-red-200 rounded-2xl focus:ring-4 focus:ring-red-500 focus:border-transparent text-lg shadow-lg hover:shadow-xl transition-all font-semibold"
                  value={vitalFilters.dateTo}
                  onChange={(e) => setVitalFilters(prev => ({...prev, dateTo: e.target.value}))}
                />
              </div>
              
              {/* Filtro de turno */}
              <div>
                <label className="block text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                  <span className="text-xl">🕐</span> Turno
                </label>
                <select
                  className="w-full px-5 py-4 bg-white border-4 border-red-200 rounded-2xl focus:ring-4 focus:ring-red-500 focus:border-transparent text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  value={vitalFilters.shift}
                  onChange={(e) => setVitalFilters(prev => ({...prev, shift: e.target.value}))}
                >
                  <option value="all">🌍 Todos los turnos</option>
                  <option value="morning">🌅 Mañana (07:00 - 15:00)</option>
                  <option value="afternoon">🌆 Tarde (15:00 - 23:00)</option>
                  <option value="night">🌙 Noche (23:00 - 07:00)</option>
                </select>
              </div>
            </div>
            
            {/* Resumen de filtros activos */}
            {(vitalFilters.dateFrom || vitalFilters.dateTo || vitalFilters.shift !== 'all') && (
              <div className="mt-6 pt-6 border-t-2 border-red-300">
                <p className="text-lg text-red-800 font-medium">
                  <span className="font-bold">Filtros activos:</span>
                  {vitalFilters.dateFrom && <span className="ml-3">📅 Desde {new Date(vitalFilters.dateFrom).toLocaleDateString('es-ES')}</span>}
                  {vitalFilters.dateTo && <span className="ml-3">📅 Hasta {new Date(vitalFilters.dateTo).toLocaleDateString('es-ES')}</span>}
                  {vitalFilters.shift !== 'all' && (
                    <span className="ml-3">
                      🕐 {vitalFilters.shift === 'morning' ? 'Turno Mañana' : vitalFilters.shift === 'afternoon' ? 'Turno Tarde' : 'Turno Noche'}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
          
          {/* Lista de signos vitales filtrados */}
          {filteredVitals.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {filteredVitals.slice().reverse().map((vital, index) => {
                const vitalDate = new Date(vital.date);
                const isToday = vitalDate.toDateString() === new Date().toDateString();
                const isRecent = (Date.now() - vitalDate.getTime()) < 3600000; // Última hora
                const shift = getShiftFromTime(vital.date);
                const shiftNames = {
                  morning: '🌅 Mañana',
                  afternoon: '🌆 Tarde',
                  night: '🌙 Noche'
                };
                
                return (
                  <div key={vital.id || index} className="border-l-[8px] border-red-400 bg-gradient-to-br from-red-50 via-pink-50 to-red-50 rounded-2xl p-8 shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="bg-red-100 p-3 rounded-xl">
                          <Clock className="text-red-600" size={28} />
                        </div>
                        <div>
                          <span className="font-bold text-gray-800 text-xl block">
                            📅 {vitalDate.toLocaleDateString('es-ES', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </span>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-base bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-1.5 rounded-full font-semibold shadow-lg">
                              {shiftNames[shift]}
                            </span>
                            {isToday && (
                              <span className="text-base bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-1.5 rounded-full font-semibold shadow-lg">
                                HOY
                              </span>
                            )}
                            {isRecent && (
                              <span className="text-base bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-1.5 rounded-full font-semibold shadow-lg animate-pulse">
                                RECIENTE
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-red-700 bg-red-100 px-5 py-3 rounded-2xl">
                        🕐 {vitalDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-5 mb-5">
                      <div className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-red-100">
                        <p className="text-lg text-gray-600 flex items-center gap-2 mb-2">
                          <span className="text-2xl">🌡️</span> Temperatura
                        </p>
                        <p className="font-bold text-2xl text-gray-800">{vital.temperature}°C</p>
                      </div>
                      <div className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-red-100">
                        <p className="text-lg text-gray-600 flex items-center gap-2 mb-2">
                          <span className="text-2xl">💓</span> Presión Arterial
                        </p>
                        <p className="font-bold text-2xl text-gray-800">{vital.bloodPressure} mmHg</p>
                      </div>
                      <div className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-red-100">
                        <p className="text-lg text-gray-600 flex items-center gap-2 mb-2">
                          <span className="text-2xl">❤️</span> Frec. Cardíaca
                        </p>
                        <p className="font-bold text-2xl text-gray-800">{vital.heartRate} lpm</p>
                      </div>
                      <div className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-red-100">
                        <p className="text-lg text-gray-600 flex items-center gap-2 mb-2">
                          <span className="text-2xl">🫁</span> Frec. Respiratoria
                        </p>
                        <p className="font-bold text-2xl text-gray-800">{vital.respiratoryRate} rpm</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t-2 border-red-200">
                      <p className="text-lg text-gray-600">
                        👨‍⚕️ <span className="font-semibold text-gray-800">{vital.registeredBy}</span>
                      </p>
                      <p className="text-base text-gray-400 font-mono">#{vital.id}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Activity className="mx-auto mb-4 text-gray-400" size={64} />
              {patientVitals.length === 0 ? (
                <>
                  <p className="text-xl font-medium">No hay signos vitales registrados</p>
                  <p className="text-base mt-3">Los registros de signos vitales aparecerán aquí</p>
                </>
              ) : (
                <>
                  <p className="text-xl font-medium">No hay registros que coincidan con los filtros</p>
                  <p className="text-base mt-3">Intenta ajustar los criterios de búsqueda</p>
                  <button
                    onClick={clearVitalFilters}
                    className="mt-5 px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-2xl hover:shadow-xl transition-all text-lg font-semibold"
                  >
                    🔄 Restablecer filtros
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl border-2 border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <FileText className="text-blue-600" size={32} />
              </div>
              Historial de Notas Evolutivas
            </h3>
            <div className="flex items-center gap-2">
              <span className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-2xl text-lg font-semibold shadow-lg">
                {patientNotes.length} {patientNotes.length === 1 ? 'nota' : 'notas'}
              </span>
            </div>
          </div>
          
          {patientNotes.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {patientNotes.slice().reverse().map((note, index) => {
                const noteTypeIcons = {
                  'evolutiva': '📋',
                  'observacion': '👁️',
                  'incidente': '⚠️',
                  'mejora': '✅',
                  'deterioro': '🔴'
                };
                const noteTypeColors = {
                  'evolutiva': 'border-blue-200 bg-blue-50',
                  'observacion': 'border-purple-200 bg-purple-50',
                  'incidente': 'border-orange-200 bg-orange-50',
                  'mejora': 'border-green-200 bg-green-50',
                  'deterioro': 'border-red-200 bg-red-50'
                };
                const noteTypeNames = {
                  'evolutiva': 'Nota Evolutiva',
                  'observacion': 'Observación',
                  'incidente': 'Incidente',
                  'mejora': 'Mejoría',
                  'deterioro': 'Deterioro'
                };
                
                const noteDate = new Date(note.date);
                const isRecent = (Date.now() - noteDate.getTime()) < 86400000; // Últimas 24 horas
                
                return (
                  <div 
                    key={note.id || index} 
                    className={`border-l-[8px] ${noteTypeColors[note.noteType || 'evolutiva'] || 'border-blue-200 bg-blue-50'} p-8 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-300`}
                    style={{
                      background: note.noteType === 'evolutiva' ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' :
                                note.noteType === 'observacion' ? 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)' :
                                note.noteType === 'incidente' ? 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)' :
                                note.noteType === 'mejora' ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' :
                                note.noteType === 'deterioro' ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/80 p-4 rounded-2xl shadow-lg">
                          <span className="text-4xl">{noteTypeIcons[note.noteType || 'evolutiva'] || '📋'}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-gray-800 text-2xl">
                              {noteTypeNames[note.noteType || 'evolutiva'] || 'Nota Evolutiva'}
                            </span>
                            {isRecent && (
                              <span className="text-base bg-gradient-to-r from-green-500 to-green-700 text-white px-5 py-2 rounded-full font-semibold shadow-lg animate-pulse">
                                RECIENTE
                              </span>
                            )}
                          </div>
                          <p className="text-base text-gray-600 font-medium">
                            📅 {noteDate.toLocaleDateString('es-ES', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric',
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xl text-gray-700 leading-relaxed mb-4 pl-4 whitespace-pre-wrap font-medium">
                      {note.note}
                    </p>
                    
                    <div className="flex items-center justify-between pl-4 pt-4 border-t-2 border-gray-200">
                      <p className="text-lg text-gray-600">
                        👨‍⚕️ <span className="font-semibold text-gray-800">{note.nurseName}</span>
                      </p>
                      <p className="text-base text-gray-400 font-mono">
                        #{note.id}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="mx-auto mb-4 text-gray-400" size={64} />
              <p className="text-xl font-medium">No hay notas evolutivas registradas para este paciente</p>
              <p className="text-base mt-3">Las notas de enfermería aparecerán aquí cuando se registren</p>
            </div>
          )}
          
          {/* Resumen por tipo de nota */}
          {patientNotes.length > 0 && (
            <div className="mt-6 pt-6 border-t-2 border-gray-200">
              <p className="text-lg font-semibold text-gray-700 mb-4">Resumen por tipo:</p>
              <div className="flex flex-wrap gap-3">
                {['evolutiva', 'observacion', 'incidente', 'mejora', 'deterioro'].map(type => {
                  const count = patientNotes.filter(n => (n.noteType || 'evolutiva') === type).length;
                  if (count === 0) return null;
                  
                  const typeInfo = {
                    'evolutiva': { icon: '📋', color: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white', name: 'Evolutivas' },
                    'observacion': { icon: '👁️', color: 'bg-gradient-to-r from-purple-500 to-purple-700 text-white', name: 'Observaciones' },
                    'incidente': { icon: '⚠️', color: 'bg-gradient-to-r from-orange-500 to-orange-700 text-white', name: 'Incidentes' },
                    'mejora': { icon: '✅', color: 'bg-gradient-to-r from-green-500 to-green-700 text-white', name: 'Mejorías' },
                    'deterioro': { icon: '🔴', color: 'bg-gradient-to-r from-red-500 to-red-700 text-white', name: 'Deterioros' }
                  };
                  
                  return (
                    <span 
                      key={type}
                      className={`px-5 py-2.5 rounded-2xl text-base font-semibold shadow-lg ${typeInfo[type].color}`}
                    >
                      {typeInfo[type].icon} {count} {typeInfo[type].name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl border-2 border-green-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-xl">
                <Pill className="text-green-600" size={32} />
              </div>
              Tratamientos Asignados
            </h3>
            <span className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-2xl text-lg font-semibold shadow-lg">
              {patientTreatments.length} {patientTreatments.length === 1 ? 'tratamiento' : 'tratamientos'}
            </span>
          </div>
          {patientTreatments.length > 0 ? (
            <div className="space-y-4">
              {patientTreatments.map(trt => {
                const startDate = new Date(trt.startDate);
                const isActive = trt.status === 'Activo' || !trt.status;
                const administrationTimes = trt.administrationTimes ? trt.administrationTimes.split(',') : [];
                
                return (
                  <div key={trt.id} className="border-l-[8px] border-green-500 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 rounded-2xl p-8 shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-300">
                    {/* Encabezado del tratamiento */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-green-500 to-green-700 p-4 rounded-2xl shadow-lg">
                          <Pill className="text-white" size={32} />
                        </div>
                        <div>
                          <h4 className="font-bold text-2xl text-gray-800 mb-1">{trt.medication}</h4>
                          <p className="text-lg text-gray-600">Dosis: <span className="font-semibold text-green-700 text-xl">{trt.dose}</span></p>
                        </div>
                      </div>
                      <span className={`px-6 py-3 rounded-2xl text-base font-bold shadow-lg ${
                        isActive ? 'bg-gradient-to-r from-green-500 to-green-700 text-white' : 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
                      }`}>
                        {trt.status || 'Activo'}
                      </span>
                    </div>
                    
                    {/* Información del tratamiento */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div className="bg-white p-5 rounded-2xl border-2 border-green-200 shadow-lg hover:shadow-xl transition-all">
                        <p className="text-lg text-gray-600 mb-2 flex items-center gap-2">
                          <Clock size={24} className="text-green-600" />
                          Frecuencia
                        </p>
                        <p className="font-semibold text-xl text-gray-800">{trt.frequency}</p>
                      </div>
                      
                      {trt.responsibleDoctor && (
                        <div className="bg-white p-5 rounded-2xl border-2 border-green-200 shadow-lg hover:shadow-xl transition-all">
                          <p className="text-lg text-gray-600 mb-2 flex items-center gap-2">
                            <User size={24} className="text-green-600" />
                            Médico Responsable
                          </p>
                          <p className="font-semibold text-xl text-gray-800">{trt.responsibleDoctor}</p>
                        </div>
                      )}
                      
                      <div className="bg-white p-5 rounded-2xl border-2 border-green-200 shadow-lg hover:shadow-xl transition-all">
                        <p className="text-lg text-gray-600 mb-2 flex items-center gap-2">
                          <span className="text-2xl">📅</span> Fecha de Inicio
                        </p>
                        <p className="font-semibold text-xl text-gray-800">
                          {startDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      
                      <div className="bg-white p-5 rounded-2xl border-2 border-green-200 shadow-lg hover:shadow-xl transition-all">
                        <p className="text-lg text-gray-600 mb-2 flex items-center gap-2">
                          <span className="text-2xl">⏰</span> Última Aplicación
                        </p>
                        <p className="font-semibold text-xl text-gray-800">
                          {new Date(trt.lastApplication).toLocaleString('es-ES', { 
                            day: 'numeric', 
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {/* Horarios de administración */}
                    {administrationTimes.length > 0 && (
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-2xl p-5 mb-5 shadow-lg">
                        <p className="text-lg font-semibold text-blue-700 mb-3 flex items-center gap-2">
                          <Clock size={24} />
                          Horarios de Administración
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {administrationTimes.map((time, idx) => (
                            <span key={idx} className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-2xl text-lg font-semibold shadow-lg">
                              🕐 {time.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Notas */}
                    {trt.notes && (
                      <div className="bg-white border-2 border-green-300 rounded-2xl p-5 mb-5 shadow-lg">
                        <p className="text-lg font-semibold text-green-700 mb-2 flex items-center gap-2"><span className="text-2xl">📝</span> Notas:</p>
                        <p className="text-xl text-gray-700 italic font-medium">{trt.notes}</p>
                      </div>
                    )}
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t-2 border-green-300">
                      <p className="text-lg text-gray-600">
                        👨‍⚕️ Aplicado por: <span className="font-semibold text-gray-800">{trt.appliedBy}</span>
                      </p>
                      <p className="text-base text-gray-400 font-mono">#{trt.id}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Pill className="mx-auto mb-4 text-gray-400" size={64} />
              <p className="text-xl font-medium">No hay tratamientos asignados</p>
              <p className="text-base mt-3">Los tratamientos aparecerán aquí cuando sean prescritos</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl border-2 border-purple-100">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-xl">
              <FileText className="text-purple-600" size={32} />
            </div>
            Historial Médico
          </h3>
          {patientHistory.length > 0 ? (
            <div className="space-y-5">
              {patientHistory.map(record => (
                <div key={record.id} className="border-l-[8px] border-purple-400 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                  <p className="font-bold text-xl md:text-2xl text-gray-800 mb-3">{record.diagnosis}</p>
                  <div className="space-y-2">
                    <p className="text-base md:text-lg text-gray-700"><span className="font-semibold">📅 Fecha:</span> {record.date}</p>
                    <p className="text-base md:text-lg text-gray-700"><span className="font-semibold">👨‍⚕️ Médico:</span> {record.doctor}</p>
                    <p className="text-base md:text-lg text-gray-700"><span className="font-semibold">💊 Tratamiento:</span> {record.treatment}</p>
                  </div>
                  <p className="text-lg md:text-xl text-gray-600 mt-4 pt-4 border-t-2 border-purple-200 font-medium italic">{record.notes}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="mx-auto mb-4 text-gray-400" size={64} />
              <p className="text-xl font-medium">No hay historial médico registrado</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl border-2 border-cyan-100">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <div className="bg-cyan-100 p-3 rounded-xl">
              <TestTube className="text-cyan-600" size={32} />
            </div>
            Resultados de Laboratorio
          </h3>
          {patientLabs.length > 0 ? (
            <div className="space-y-5">
              {patientLabs.map(test => (
                <div key={test.id} className="border-l-[8px] border-cyan-400 bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-50 p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <p className="font-bold text-xl md:text-2xl text-gray-800 mb-3">🔬 {test.test}</p>
                      <div className="space-y-2">
                        <p className="text-base md:text-lg text-gray-700"><span className="font-semibold">📅 Fecha:</span> {test.date}</p>
                        <p className="text-base md:text-lg text-gray-700"><span className="font-semibold">👨‍⚕️ Ordenado por:</span> {test.orderedBy}</p>
                        <p className="text-base md:text-lg text-gray-700 font-medium"><span className="font-semibold">📊 Resultados:</span> {test.results}</p>
                      </div>
                    </div>
                    <span className={'px-6 py-3 rounded-2xl text-base font-bold shadow-lg ' + (test.status === 'Completado' ? 'bg-gradient-to-r from-green-500 to-green-700 text-white' : 'bg-gradient-to-r from-yellow-500 to-yellow-700 text-white')}>
                      {test.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <TestTube className="mx-auto mb-4 text-gray-400" size={64} />
              <p className="text-xl font-medium">No hay resultados de laboratorio</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl border-2 border-emerald-100">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <Calendar className="text-emerald-600" size={32} />
            </div>
            Citas Programadas
          </h3>
          {patientAppointments.length > 0 ? (
            <div className="space-y-5">
              {patientAppointments.map(apt => (
                <div key={apt.id} className="border-l-[8px] border-emerald-400 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50 p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <p className="font-bold text-xl md:text-2xl text-gray-800 mb-3">📅 {apt.type}</p>
                      <div className="space-y-2">
                        <p className="text-base md:text-lg text-gray-700"><span className="font-semibold">🕐 Fecha:</span> {apt.date} a las {apt.time}</p>
                        <p className="text-base md:text-lg text-gray-700"><span className="font-semibold">👨‍⚕️ Médico:</span> {apt.doctor}</p>
                      </div>
                    </div>
                    <span className={'px-6 py-3 rounded-2xl text-base font-bold shadow-lg ' + (apt.status === 'Confirmada' ? 'bg-gradient-to-r from-green-500 to-green-700 text-white' : 'bg-gradient-to-r from-yellow-500 to-yellow-700 text-white')}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="mx-auto mb-4 text-gray-400" size={64} />
              <p className="text-xl font-medium">No hay citas programadas</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 animate-fadeIn">
      <nav className="glass-effect border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-full blur-md opacity-50"></div>
              <Activity className="text-purple-600 relative" size={32} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
              Hospital San Rafael
            </h1>
          </div>
          <Tooltip text="Atajos de teclado (F1)" position="left">
            <button
              onClick={() => setShowKeyboardShortcuts(true)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              aria-label="Ver atajos de teclado"
            >
              <KeyboardIcon size={24} />
            </button>
          </Tooltip>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Hero Section with Large Login/Register Buttons */}
        <div className="text-center mb-12 md:mb-16 animate-scaleIn">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            Bienvenido a Hospital San Rafael
          </h2>
          <p className="text-2xl md:text-3xl text-white/90 drop-shadow-lg font-medium mb-12">
            Cuidado médico de excelencia con tecnología de vanguardia
          </p>
          
          {/* HUGE Login/Register Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-3xl mx-auto mb-8">
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentView('login');
              }} 
              className="group relative w-full sm:w-80 px-12 py-8 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white rounded-3xl hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 transition-all duration-300 font-bold text-3xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center justify-center gap-4">
                <User size={40} className="animate-pulse" />
                <span>Iniciar Sesión</span>
              </div>
            </button>
            
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentView('register');
              }} 
              className="group relative w-full sm:w-80 px-12 py-8 bg-white text-purple-700 rounded-3xl hover:bg-gray-50 transition-all duration-300 font-bold text-3xl shadow-2xl border-4 border-white/50 transform hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center justify-center gap-4">
                <Users size={40} />
                <span>Registrarse</span>
              </div>
            </button>
          </div>
          
          <p className="text-lg text-white/80 font-medium">
            ¿Nuevo usuario? Regístrese para acceder a todos nuestros servicios
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          <div className="glass-effect p-8 rounded-2xl card-hover border border-white/30 animate-fadeIn" style={{animationDelay: '0.1s'}}>
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full blur-lg opacity-50"></div>
              <Calendar className="text-blue-600 relative" size={48} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-800">Agendar Cita</h3>
            <p className="text-gray-600 leading-relaxed">Reserve su consulta médica de forma rápida y sencilla</p>
          </div>
          <div className="glass-effect p-8 rounded-2xl card-hover border border-white/30 animate-fadeIn" style={{animationDelay: '0.2s'}}>
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full blur-lg opacity-50"></div>
              <FileText className="text-emerald-600 relative" size={48} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-800">Historial Médico</h3>
            <p className="text-gray-600 leading-relaxed">Acceda a su historial clínico completo en línea</p>
          </div>
          <div className="glass-effect p-8 rounded-2xl card-hover border border-white/30 animate-fadeIn" style={{animationDelay: '0.3s'}}>
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full blur-lg opacity-50"></div>
              <TestTube className="text-purple-600 relative" size={48} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-800">Laboratorio</h3>
            <p className="text-gray-600 leading-relaxed">Consulte resultados de estudios y análisis</p>
          </div>
        </div>

        {/* Specialties Section */}
        <div className="glass-effect p-8 md:p-10 rounded-2xl border border-white/30 mb-12 md:mb-16 animate-fadeIn" style={{animationDelay: '0.4s'}}>
          <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
            Nuestras Especialidades
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialties.map((specialty, idx) => {
              const Icon = specialty.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-xl border-2 border-gray-100 hover:border-purple-300 transition-all cursor-pointer card-hover group">
                  <Icon className="text-purple-600 mb-3 group-hover:scale-110 transition-transform" size={36} />
                  <h4 className="text-lg font-bold mb-2 text-gray-800">{specialty.name}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{specialty.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="relative glass-effect p-10 md:p-12 rounded-2xl border border-white/30 text-center overflow-hidden animate-fadeIn" style={{animationDelay: '0.5s'}}>
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-4 animate-pulse">
              <AlertCircle className="text-white" size={32} />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">Atención de Urgencias 24/7</h3>
            <p className="text-lg md:text-xl text-gray-600 mb-4">Estamos aquí para atenderle en cualquier momento</p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-bold text-xl md:text-2xl shadow-lg">
              <Phone className="animate-pulse" size={24} />
              Tel: (55) 5555-1234
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const NurseDashboard = () => {
    // Move nurse-specific state here to prevent parent re-renders
    const [newTreatment, setNewTreatment] = useState({ patientId: '', medication: '', dose: '', frequency: '', notes: '', applicationTime: '' });
    const [newVitalSigns, setNewVitalSigns] = useState({ patientId: '', temperature: '', bloodPressure: '', heartRate: '', respiratoryRate: '', dateTime: '' });
    const [newNurseNote, setNewNurseNote] = useState({ patientId: '', note: '', noteType: 'evolutiva' });
    const [newNonPharmaTreatment, setNewNonPharmaTreatment] = useState({ 
      patientId: '', 
      treatmentType: '', 
      description: '', 
      applicationTime: '', 
      duration: '', 
      materialsUsed: '', 
      observations: '',
      outcome: '',
      nextApplication: ''
    });
    const [assignedPatients, setAssignedPatients] = useState([]);
    const [nurseShifts, setNurseShifts] = useState([]);
    const [currentShift, setCurrentShift] = useState(null);
    const [loadingAssignments, setLoadingAssignments] = useState(true);
    const [activeFormTab, setActiveFormTab] = useState('vitals'); // 'vitals', 'medication', 'notes'

    // Load assigned patients and shifts
    useEffect(() => {
      loadNurseData();
    }, [currentUser]);

    const loadNurseData = async () => {
      if (!currentUser || currentUser.type !== 'nurse') return;
      
      setLoadingAssignments(true);
      try {
        const { getAssignedPatients, getNurseShiftsWithDetails, getActiveNurseShift } = await import('./services/database');
        
        // Get assigned patients for today
        const assigned = await getAssignedPatients(currentUser.id);
        setAssignedPatients(assigned);
        
        // Get shifts for this week
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 3);
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 4);
        
        const shifts = await getNurseShiftsWithDetails(
          currentUser.id,
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        );
        setNurseShifts(shifts);
        
        // Get current active shift
        const activeShift = await getActiveNurseShift(currentUser.id);
        setCurrentShift(activeShift);
        
      } catch (error) {
        console.error('Error loading nurse data:', error);
      } finally {
        setLoadingAssignments(false);
      }
    };

    if (patientsLoading || loadingAssignments) {
      return (
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center animate-fadeIn">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="spinner mx-auto relative"></div>
            </div>
            <p className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Cargando datos de enfermería...
            </p>
            <p className="text-sm text-gray-500 mt-2">Por favor espere un momento</p>
          </div>
        </div>
      );
    }

    return (
    <div className="space-y-4 page-transition">
      {/* Welcome Banner with Shift Info */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEyYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMmMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 flex items-center gap-4">
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm text-3xl">
                  💉
                </div>
                ¡Bienvenida, {currentUser?.name}!
              </h2>
              <p className="text-white/90 text-xl mb-4">
                {currentShift ? (
                  <>Estás actualmente en turno de <span className="font-semibold">{currentShift.shift_type}</span> en {currentShift.department}</>
                ) : (
                  'Esperando asignación de turno'
                )}
              </p>
              <div className="flex flex-wrap gap-4">
                {currentShift && (
                  <>
                    <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl flex items-center gap-3">
                      <Clock className="text-white" size={24} />
                      <span className="text-white font-medium text-lg">{currentShift.start_time} - {currentShift.end_time}</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl flex items-center gap-3">
                      <Users className="text-white" size={24} />
                      <span className="text-white font-medium text-lg">{assignedPatients.length} pacientes asignados</span>
                    </div>
                  </>
                )}
                <div className="bg-gradient-to-r from-green-400 to-emerald-400 px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white font-bold text-lg">ACTIVA</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <div className="text-center">
                <p className="text-white/80 text-sm mb-2">Hora actual</p>
                <p className="text-white text-4xl font-bold">{new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-white/80 text-sm mt-2">{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards - Modern Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-7 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                <Users className="text-white" size={36} />
              </div>
              <div className="text-right">
                <p className="text-white/90 text-base font-medium">Mis Pacientes</p>
                <p className="text-white text-5xl font-bold">{assignedPatients.length}</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2.5">
              <p className="text-white/90 text-sm font-medium">Asignados hoy</p>
            </div>
          </div>
        </div>
        
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-7 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                <Pill className="text-white" size={36} />
              </div>
              <div className="text-right">
                <p className="text-white/90 text-base font-medium">Medicamentos Hoy</p>
                <p className="text-white text-5xl font-bold">
                  {treatments.filter(treatment => {
                    const treatmentDate = new Date(treatment.lastApplication);
                    const today = new Date();
                    return treatmentDate.toDateString() === today.toDateString();
                  }).length}
                </p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2.5">
              <p className="text-white/90 text-sm font-medium">Administrados en este turno</p>
            </div>
          </div>
        </div>
        
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-7 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                <Activity className="text-white" size={36} />
              </div>
              <div className="text-right">
                <p className="text-white/90 text-base font-medium">Signos Vitales</p>
                <p className="text-white text-5xl font-bold">
                  {vitalSigns.filter(vital => {
                    const vitalDate = new Date(vital.date);
                    const today = new Date();
                    return vitalDate.toDateString() === today.toDateString();
                  }).length}
                </p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2.5">
              <p className="text-white/90 text-sm font-medium">Registrados hoy</p>
            </div>
          </div>
        </div>
        
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 p-7 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                <FileText className="text-white" size={36} />
              </div>
              <div className="text-right">
                <p className="text-white/90 text-base font-medium">Notas de Enfermería</p>
                <p className="text-white text-5xl font-bold">{nurseNotes.length}</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2.5">
              <p className="text-white/90 text-sm font-medium">Total registradas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Patients Section - Enhanced Design */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-4 rounded-xl text-white shadow-lg">
              <UserCheck size={32} />
            </div>
            Pacientes Asignados a Mi Turno
          </h3>
          <span className="px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-base font-bold flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></div>
            {assignedPatients.length} activos
          </span>
        </div>
        
        {assignedPatients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {assignedPatients.map(patient => {
              const triageInfo = getTriageInfo(patient.triage_level || 3);
              const patientTreatments = treatments.filter(t => t.patientId === patient.id);
              const patientVitals = vitalSigns.filter(v => v.patientId === patient.id).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
              
              return (
                <div key={patient.id} className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-200 hover:border-indigo-300 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute top-5 right-5">
                    <div className={`${triageInfo.color} w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                      {triageInfo.icon}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-2xl font-bold text-gray-800 mb-2">{patient.name}</h4>
                    <p className="text-base text-gray-600 flex items-center gap-2">
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md font-medium text-sm">Hab. {patient.room}</span>
                      <span className="text-gray-400">•</span>
                      <span>{patient.age} años</span>
                    </p>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 text-base">
                      <div className="bg-blue-100 p-2.5 rounded-lg">
                        <Heart className="text-blue-600" size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-600 text-sm">Diagnóstico</p>
                        <p className="font-semibold text-gray-800 text-base">{patient.diagnosis}</p>
                      </div>
                    </div>
                    
                    {patientVitals && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-red-50 rounded-lg p-3">
                          <p className="text-sm text-red-600 mb-1">Temp</p>
                          <p className="font-bold text-red-700 text-lg">{patientVitals.temperature}°C</p>
                        </div>
                        <div className="bg-pink-50 rounded-lg p-3">
                          <p className="text-sm text-pink-600 mb-1">Presión</p>
                          <p className="font-bold text-pink-700 text-lg">{patientVitals.bloodPressure}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <div className="bg-green-50 px-4 py-2 rounded-full flex items-center gap-2">
                        <Pill className="text-green-600" size={18} />
                        <span className="text-sm font-semibold text-green-700">{patientTreatments.length}</span>
                      </div>
                      <div className={`${triageInfo.bgLight} px-4 py-2 rounded-full`}>
                        <span className={`text-sm font-bold ${triageInfo.textColor}`}>Nv. {patient.triage_level || 3}</span>
                      </div>
                    </div>
                    <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2.5 rounded-xl text-base font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="text-gray-400" size={48} />
            </div>
            <p className="text-gray-600 font-semibold text-lg">No tienes pacientes asignados en este turno</p>
            <p className="text-gray-500 text-sm mt-2">Los pacientes aparecerán aquí cuando sean asignados</p>
          </div>
        )}
      </div>

      {/* Triage Overview and Shift Schedule - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Triage Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 p-3 rounded-xl text-white shadow-lg">
              <AlertCircle size={28} />
            </div>
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Estado de Triaje
            </span>
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map(level => {
              const triageInfo = getTriageInfo(level);
              const count = assignedPatients.filter(p => (p.triage_level || 3) === level).length;
              return (
                <div 
                  key={level}
                  className={`${triageInfo.bgLight} border-2 ${triageInfo.borderColor} rounded-xl p-3 text-center transition-all hover:shadow-lg ${count > 0 ? 'cursor-pointer hover:scale-105' : 'opacity-60'}`}
                >
                  <div className="text-3xl mb-2 ${level === 1 || level === 2 ? 'animate-pulse' : ''}">{triageInfo.icon}</div>
                  <div className={`text-2xl font-bold ${triageInfo.textColor} mb-1`}>{count}</div>
                  <div className={`text-xs font-semibold ${triageInfo.textColor} uppercase mb-1`}>
                    Nv. {level}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-3">
            <p className="text-xs text-gray-700">
              <span className="font-bold text-blue-700 flex items-center gap-2 mb-1">
                <AlertCircle size={16} />
                Sistema de Triaje
              </span> 
              <span className="block text-gray-600 leading-relaxed">
                <span className="font-semibold">Nv.1:</span> Inmediato • 
                <span className="font-semibold">Nv.2:</span> 10min • 
                <span className="font-semibold">Nv.3:</span> 30min • 
                <span className="font-semibold">Nv.4:</span> 60min • 
                <span className="font-semibold">Nv.5:</span> 120min
              </span>
            </p>
          </div>
        </div>

        {/* My Shift Schedule */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-2xl font-bold mb-5 flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-blue-500 p-3 rounded-xl text-white shadow-lg">
              <Clock size={28} />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Mis Turnos
            </span>
          </h3>
          {nurseShifts.length > 0 ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {nurseShifts.map(shift => {
                const isToday = shift.date === new Date().toISOString().split('T')[0];
                return (
                  <div key={shift.id} className={`border-2 rounded-xl p-4 transition-all hover:shadow-lg ${isToday ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-800">
                          📅 {new Date(shift.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </span>
                        {isToday && <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-bold">HOY</span>}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        shift.shift_type === 'Mañana' ? 'bg-yellow-100 text-yellow-800' :
                        shift.shift_type === 'Tarde' ? 'bg-orange-100 text-orange-800' :
                        'bg-indigo-100 text-indigo-800'
                      }`}>
                        {shift.shift_type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">🕐 {shift.start_time} - {shift.end_time}</span>
                      <span className="font-bold text-blue-600">{shift.assigned_patients_count || 0} pac.</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{shift.department}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="mx-auto mb-3 text-gray-400" size={40} />
              <p className="text-sm">No hay turnos programados</p>
            </div>
          )}
        </div>
      </div>

      {/* Forms Section - Tabs */}
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-100">
        {/* Tabs Header */}
        <div className="flex border-b-2 border-gray-200">
          <button
            onClick={() => setActiveFormTab('vitals')}
            className={`flex-1 py-5 px-6 text-lg font-bold transition-all flex items-center justify-center gap-3 ${
              activeFormTab === 'vitals'
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-b-4 border-red-600 shadow-lg'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Activity size={24} />
            Signos Vitales
          </button>
          <button
            onClick={() => setActiveFormTab('medication')}
            className={`flex-1 py-5 px-6 text-lg font-bold transition-all flex items-center justify-center gap-3 ${
              activeFormTab === 'medication'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-b-4 border-green-600 shadow-lg'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Pill size={24} />
            Medicamentos
          </button>
          <button
            onClick={() => setActiveFormTab('notes')}
            className={`flex-1 py-5 px-6 text-lg font-bold transition-all flex items-center justify-center gap-3 ${
              activeFormTab === 'notes'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-b-4 border-blue-600 shadow-lg'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText size={24} />
            Notas de Enfermería
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Vital Signs Form */}
          {activeFormTab === 'vitals' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <div className="bg-gradient-to-br from-red-500 to-pink-500 p-3 rounded-xl text-white shadow-lg">
                  <Activity size={24} />
                </div>
                <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent text-lg">
                  Registrar Signos Vitales
                </span>
              </h3>
              <select
                key="vital-patient-select"
                className="w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-lg font-semibold"
                value={newVitalSigns.patientId}
                onChange={(e) => setNewVitalSigns(prev => ({...prev, patientId: e.target.value}))}
              >
                <option value="">🏥 Seleccionar paciente</option>
                {assignedPatients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - Hab. {p.room}</option>
                ))}
              </select>
              
              <input
                type="datetime-local"
                className="w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-lg font-semibold"
                value={newVitalSigns.dateTime}
                onChange={(e) => setNewVitalSigns(prev => ({...prev, dateTime: e.target.value}))}
                max={new Date().toISOString().slice(0, 16)}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  key="vital-temp"
                  type="text"
                  placeholder="🌡️ Temperatura (°C)"
                  className="w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-lg font-semibold"
                  value={newVitalSigns.temperature}
                  onChange={(e) => setNewVitalSigns(prev => ({...prev, temperature: e.target.value}))}
                />
                <input
                  key="vital-bp"
                  type="text"
                  placeholder="💓 Presión (120/80)"
                  className="w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-500 focus:border-red-500 transition-all shadow-lg font-semibold"
                  value={newVitalSigns.bloodPressure}
                  onChange={(e) => setNewVitalSigns(prev => ({...prev, bloodPressure: e.target.value}))}
                />
                <input
                  key="vital-hr"
                  type="text"
                  placeholder="❤️ Frec. Cardíaca"
                  className="w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-pink-500 focus:border-pink-500 transition-all shadow-lg font-semibold"
                  value={newVitalSigns.heartRate}
                  onChange={(e) => setNewVitalSigns(prev => ({...prev, heartRate: e.target.value}))}
                />
                <input
                  key="vital-rr"
                  type="text"
                  placeholder="🫁 Frec. Respiratoria"
                  className="w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-lg font-semibold"
                  value={newVitalSigns.respiratoryRate}
                  onChange={(e) => setNewVitalSigns(prev => ({...prev, respiratoryRate: e.target.value}))}
                />
              </div>
              <button
                onClick={registerVitalSigns}
                className="w-full py-4 text-lg bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:via-pink-600 hover:to-rose-600 transition-all font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <CheckCircle size={24} />
                Registrar Signos Vitales
              </button>
            </div>
          )}

          {/* Medication Form */}
          {activeFormTab === 'medication' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl text-white shadow-lg">
                  <Pill size={24} />
                </div>
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent text-lg">
                  Administrar Medicamento
                </span>
              </h3>
              <select
                className="w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-lg font-semibold"
                value={newTreatment.patientId}
                onChange={(e) => setNewTreatment(prev => ({...prev, patientId: e.target.value}))}
              >
                <option value="">🏥 Seleccionar paciente</option>
                {assignedPatients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - Hab. {p.room}</option>
                ))}
              </select>
              
              <input
                type="time"
                className="w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500 focus:border-green-500 transition-all shadow-lg font-semibold"
                value={newTreatment.applicationTime}
                onChange={(e) => setNewTreatment(prev => ({...prev, applicationTime: e.target.value}))}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="💊 Medicamento"
                  className="w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-lg font-semibold"
                  value={newTreatment.medication}
                  onChange={(e) => setNewTreatment(prev => ({...prev, medication: e.target.value}))}
                />
                <input
                  type="text"
                  placeholder="📊 Dosis"
                  className="w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-lg font-semibold"
                  value={newTreatment.dose}
                  onChange={(e) => setNewTreatment(prev => ({...prev, dose: e.target.value}))}
                />
              </div>
              <input
                type="text"
                placeholder="⏰ Frecuencia"
                className="w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-lg font-semibold"
                value={newTreatment.frequency}
                onChange={(e) => setNewTreatment(prev => ({...prev, frequency: e.target.value}))}
              />
              <textarea
                placeholder="📝 Notas"
                className="w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-lg resize-none font-medium"
                rows="3"
                value={newTreatment.notes}
                onChange={(e) => setNewTreatment(prev => ({...prev, notes: e.target.value}))}
              />
              <button
                onClick={applyTreatment}
                className="w-full py-4 text-lg bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transition-all font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Pill size={24} />
                Administrar Medicamento
              </button>
            </div>
          )}

          {/* Nursing Notes Form */}
          {activeFormTab === 'notes' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl text-white shadow-lg">
                  <FileText size={24} />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-lg">
                  Registrar Nota Evolutiva
                </span>
              </h3>
              <select
                className="w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-lg font-semibold"
                value={newNurseNote.patientId}
                onChange={(e) => setNewNurseNote(prev => ({...prev, patientId: e.target.value}))}
              >
                <option value="">🏥 Seleccionar paciente</option>
                {assignedPatients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - Hab. {p.room}</option>
                ))}
              </select>
              
              <select
                className="w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-lg font-semibold"
                value={newNurseNote.noteType}
                onChange={(e) => setNewNurseNote(prev => ({...prev, noteType: e.target.value}))}
              >
                <option value="evolutiva">📋 Evolutiva</option>
                <option value="ingreso">🏥 Ingreso</option>
                <option value="procedimiento">💉 Procedimiento</option>
                <option value="incidencia">⚠️ Incidencia</option>
                <option value="seguimiento">👁️ Seguimiento</option>
              </select>
              
              <textarea
                placeholder="✍️ Escriba la nota evolutiva aquí..."
                className="w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-lg resize-none font-medium"
                rows="8"
                value={newNurseNote.note}
                onChange={(e) => setNewNurseNote(prev => ({...prev, note: e.target.value}))}
              />
              <button
                onClick={addNurseNote}
                className="w-full py-4 text-lg bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:via-cyan-600 hover:to-indigo-600 transition-all font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <FileText size={24} />
                Registrar Nota
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Patient List - Vista Detallada de Pacientes */}
      <div className="glass-effect p-6 rounded-2xl shadow-lg border border-gray-200/50">
        <h3 className="text-xl font-bold mb-4 flex items-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          <Users className="mr-2 text-purple-600" size={24} />
          Vista Detallada de Pacientes
        </h3>
        {assignedPatients.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {assignedPatients.map(patient => {
                const triageInfo = getTriageInfo(patient.triage_level || 3);
                const patientNotesCount = nurseNotes.filter(n => n.patientId === patient.id).length;
                const recentNotesCount = nurseNotes.filter(n => {
                  if (n.patientId !== patient.id) return false;
                  const noteDate = new Date(n.date);
                  return (Date.now() - noteDate.getTime()) < 86400000; // Últimas 24 horas
                }).length;
                
                return (
                  <div 
                    key={patient.id} 
                    className={`bg-gradient-to-br from-white to-gray-50 border-l-[6px] ${triageInfo.borderColor} p-6 rounded-2xl hover:shadow-2xl transition-all group relative overflow-hidden hover:scale-[1.02]`}
                  >
                    {/* Triage indicator background */}
                    <div className={`absolute top-0 right-0 w-32 h-32 ${triageInfo.bgLight} opacity-40 rounded-bl-full`}></div>
                    
                    <div className="relative">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-bold text-gray-800 text-2xl">{patient.name}</p>
                            <span className={`text-3xl ${triageInfo.icon === '🔴' ? 'animate-pulse' : ''}`}>
                              {triageInfo.icon}
                            </span>
                          </div>
                          <p className="text-base text-gray-600 font-medium">🏥 Habitación {patient.room} • {patient.age} años</p>
                          <p className="text-sm text-gray-500">🩸 Tipo de sangre: {patient.blood_type}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={'px-5 py-2.5 rounded-xl font-bold text-base shadow-lg ' + (patient.condition === 'Crítico' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse' : patient.condition === 'Estable' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white')}>
                            {patient.condition}
                          </span>
                        </div>
                      </div>
                      
                      {/* Triage level indicator */}
                      <div className={`mt-3 px-5 py-3 ${triageInfo.bgLight} border-2 ${triageInfo.borderColor} rounded-xl shadow-md`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-bold ${triageInfo.textColor} uppercase`}>
                            Triaje: Nivel {patient.triage_level || 3}
                          </span>
                          <span className={`text-sm ${triageInfo.textColor} font-semibold`}>
                            ⏱️ {triageInfo.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{triageInfo.description}</p>
                      </div>
                      
                      {/* Notas evolutivas counter */}
                      {patientNotesCount > 0 && (
                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl text-sm shadow-md">
                            <FileText size={18} className="text-blue-600" />
                            <span className="font-bold text-blue-700">
                              {patientNotesCount} {patientNotesCount === 1 ? 'nota' : 'notas'}
                            </span>
                            {recentNotesCount > 0 && (
                              <span className="ml-2 px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-bold shadow-md">
                                {recentNotesCount} HOY
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              viewPatientDetails(patient);
                            }}
                            className="flex-1 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                          >
                            <FileText size={18} />
                            Ver Historial
                          </button>
                        </div>
                      )}
                      
                      {patient.assignment_notes && (
                        <p className="text-xs text-gray-500 mt-2 italic bg-gray-50 p-2 rounded">📋 {patient.assignment_notes}</p>
                      )}
                    </div>
                  </div>
                );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="mx-auto mb-3 text-gray-400" size={48} />
            <p>No hay pacientes asignados en este turno</p>
            <p className="text-sm mt-2">Contacte al supervisor de turno para obtener asignaciones</p>
          </div>
        )}
      </div>

      {/* Notas Evolutivas del Turno */}
      <div className="glass-effect p-6 rounded-2xl shadow-lg border border-gray-200/50">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold flex items-center bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            <FileText className="mr-2 text-indigo-600" size={24} />
            Notas Evolutivas del Turno
          </h3>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
            {nurseNotes.filter(note => {
              const noteDate = new Date(note.date);
              const today = new Date();
              return noteDate.toDateString() === today.toDateString();
            }).length} notas hoy
          </span>
        </div>
        
        {nurseNotes.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {nurseNotes.slice().reverse().map((note, index) => {
              const patient = assignedPatients.find(p => p.id === note.patientId) || patients.find(p => p.id === note.patientId);
              const noteDate = new Date(note.date);
              const isToday = noteDate.toDateString() === new Date().toDateString();
              const noteTypeIcons = {
                'evolutiva': '📋',
                'observacion': '👁️',
                'incidente': '⚠️',
                'mejora': '✅',
                'deterioro': '🔴'
              };
              const noteTypeColors = {
                'evolutiva': 'border-blue-200 bg-blue-50',
                'observacion': 'border-purple-200 bg-purple-50',
                'incidente': 'border-orange-200 bg-orange-50',
                'mejora': 'border-green-200 bg-green-50',
                'deterioro': 'border-red-200 bg-red-50'
              };
              
              return (
                <div 
                  key={note.id || index} 
                  className={`border-l-4 ${noteTypeColors[note.noteType || 'evolutiva'] || 'border-blue-200 bg-blue-50'} p-4 rounded-xl hover:shadow-md transition-all`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{noteTypeIcons[note.noteType || 'evolutiva'] || '📋'}</span>
                      <div>
                        <p className="font-bold text-gray-800">
                          {patient ? patient.name : 'Paciente desconocido'}
                          {isToday && <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">HOY</span>}
                        </p>
                        <p className="text-xs text-gray-500">
                          🏥 Habitación {patient?.room} • 
                          <span className="ml-1">📅 {noteDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 uppercase">
                      {note.noteType || 'Evolutiva'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 leading-relaxed mb-2 pl-8 whitespace-pre-wrap">
                    {note.note}
                  </p>
                  
                  <div className="flex items-center justify-between pl-8 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      👨‍⚕️ Registrado por: <span className="font-semibold">{note.nurseName}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      #{note.id}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileText className="mx-auto mb-3 text-gray-400" size={48} />
            <p>No hay notas evolutivas registradas</p>
            <p className="text-sm mt-2">Registre la primera nota del turno arriba</p>
          </div>
        )}
      </div>

      {/* Historial de Tratamientos No Farmacológicos */}
      <div className="glass-effect p-6 rounded-2xl shadow-lg border border-gray-200/50">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold flex items-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            <Scissors className="mr-2 text-purple-600" size={24} />
            Tratamientos No Farmacológicos del Turno
          </h3>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
            {nonPharmaTreatments.filter(treatment => {
              const treatmentDate = new Date(treatment.applicationDate);
              const today = new Date();
              return treatmentDate.toDateString() === today.toDateString();
            }).length} tratamientos hoy
          </span>
        </div>
        
        {nonPharmaTreatments.length > 0 ? (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {nonPharmaTreatments.slice().reverse().map((treatment, index) => {
              const patient = assignedPatients.find(p => p.id === treatment.patientId) || patients.find(p => p.id === treatment.patientId);
              const treatmentDate = new Date(treatment.applicationDate);
              const isToday = treatmentDate.toDateString() === new Date().toDateString();
              const isRecent = (Date.now() - treatmentDate.getTime()) < 3600000; // Última hora
              
              const treatmentTypeIcons = {
                'Curación': '🩹',
                'Nebulización': '💨',
                'Fluidoterapia': '💧',
                'Oxigenoterapia': '🫁',
                'Fisioterapia Respiratoria': '🌬️',
                'Aspiración de Secreciones': '🔬',
                'Cambio de Sonda': '🔌',
                'Cambio de Catéter': '💉',
                'Enema': '💊',
                'Baño de Esponja': '🧽',
                'Movilización': '🤸',
                'Prevención de Úlceras': '🛡️',
                'Otro': '📝'
              };
              
              return (
                <div 
                  key={treatment.id || index} 
                  className="border-l-6 border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 hover:shadow-2xl transition-all hover:scale-[1.02] shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-3 rounded-xl shadow-lg">
                        <Scissors size={28} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="font-bold text-gray-900 text-xl">
                            {patient ? patient.name : 'Paciente desconocido'}
                          </p>
                          {isToday && <span className="text-sm bg-blue-500 text-white px-3 py-1 rounded-full font-bold">HOY</span>}
                          {isRecent && <span className="text-sm bg-green-500 text-white px-3 py-1 rounded-full font-bold">RECIENTE</span>}
                        </div>
                        <p className="text-sm text-gray-600 font-medium mt-1">
                          🏥 Habitación {patient?.room} • 
                          <Clock className="inline ml-2 mr-1" size={14} />
                          {treatment.applicationTime || 'Hora no especificada'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-5 mb-4 shadow-md border-2 border-purple-200">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{treatmentTypeIcons[treatment.treatmentType] || '📝'}</span>
                      <span className="font-bold text-purple-800 text-2xl">{treatment.treatmentType}</span>
                      {treatment.duration && (
                        <span className="ml-auto text-base bg-purple-200 text-purple-900 px-4 py-2 rounded-full font-bold">
                          ⏱️ {treatment.duration}
                        </span>
                      )}
                    </div>
                    <p className="text-lg text-gray-800 leading-relaxed font-medium">
                      {treatment.description}
                    </p>
                  </div>
                  
                  {treatment.materialsUsed && (
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-4 mb-3 shadow-md">
                      <p className="text-sm text-blue-800 font-bold mb-2 flex items-center gap-2">
                        <span className="text-2xl">📦</span> Materiales utilizados:
                      </p>
                      <p className="text-lg text-blue-900 font-medium">{treatment.materialsUsed}</p>
                    </div>
                  )}
                  
                  {treatment.observations && (
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-xl p-4 mb-3 shadow-md">
                      <p className="text-sm text-amber-800 font-bold mb-2 flex items-center gap-2">
                        <span className="text-2xl">👁️</span> Observaciones:
                      </p>
                      <p className="text-lg text-amber-900 italic font-medium">{treatment.observations}</p>
                    </div>
                  )}
                  
                  {treatment.outcome && (
                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 border-4 border-green-400 rounded-xl p-4 mb-3 shadow-lg">
                      <p className="text-sm text-green-800 font-bold mb-2 flex items-center gap-2">
                        <span className="text-2xl">✅</span> Resultado:
                      </p>
                      <p className="text-lg text-green-900 font-bold">{treatment.outcome}</p>
                    </div>
                  )}
                  
                  {treatment.nextApplication && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 mb-2">
                      <p className="text-xs text-blue-700 font-semibold mb-1">📅 Próxima aplicación:</p>
                      <p className="text-sm text-blue-800">
                        {new Date(treatment.nextApplication).toLocaleString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2 border-t border-purple-200">
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-gray-500">
                        👨‍⚕️ Realizado por: <span className="font-semibold">{treatment.performedBy}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        📅 {treatmentDate.toLocaleDateString('es-ES', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {treatment.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Scissors className="mx-auto mb-3 text-gray-400" size={48} />
            <p>No hay tratamientos no farmacológicos registrados</p>
            <p className="text-sm mt-2">Registre el primer tratamiento del turno arriba</p>
          </div>
        )}
      </div>

      {/* Signos Vitales del Turno */}
      <div className="glass-effect p-6 rounded-2xl shadow-lg border border-gray-200/50">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold flex items-center bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            <Activity className="mr-2 text-red-600" size={24} />
            Signos Vitales del Turno
          </h3>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
            {vitalSigns.filter(vital => {
              const vitalDate = new Date(vital.date);
              const today = new Date();
              return vitalDate.toDateString() === today.toDateString();
            }).length} registros hoy
          </span>
        </div>
        
        {vitalSigns.length > 0 ? (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {vitalSigns.slice().reverse().map((vital, index) => {
              const patient = patients.find(p => p.id === vital.patientId);
              const vitalDate = new Date(vital.date);
              const today = new Date();
              const isToday = vitalDate.toDateString() === today.toDateString();
              const isRecent = (Date.now() - vitalDate.getTime()) < 3600000; // Última hora
              
              return (
                <div 
                  key={vital.id || index} 
                  className="border-l-4 border-red-300 bg-red-50 rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Activity className="text-red-600" size={20} />
                      <div>
                        <p className="font-bold text-gray-800">
                          {patient ? patient.name : 'Paciente desconocido'}
                          {isToday && <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">HOY</span>}
                          {isRecent && <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">RECIENTE</span>}
                        </p>
                        <p className="text-xs text-gray-500">
                          🏥 Habitación {patient?.room} • 
                          <Clock className="inline ml-1 mr-1" size={12} />
                          {vitalDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - {vitalDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3 pl-7">
                    <div className="bg-white p-2.5 rounded-lg">
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        🌡️ Temperatura
                      </p>
                      <p className="font-bold text-base text-gray-800">{vital.temperature}°C</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg">
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        💓 Presión Arterial
                      </p>
                      <p className="font-bold text-base text-gray-800">{vital.bloodPressure} mmHg</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg">
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        ❤️ Frec. Cardíaca
                      </p>
                      <p className="font-bold text-base text-gray-800">{vital.heartRate} lpm</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg">
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        🫁 Frec. Respiratoria
                      </p>
                      <p className="font-bold text-base text-gray-800">{vital.respiratoryRate} rpm</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pl-7 pt-2 border-t border-red-200">
                    <p className="text-xs text-gray-500">
                      👨‍⚕️ Registrado por: <span className="font-semibold">{vital.registeredBy}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      #{vital.id}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Activity className="mx-auto mb-3 text-gray-400" size={48} />
            <p>No hay signos vitales registrados</p>
            <p className="text-sm mt-2">Registre los primeros signos vitales del turno arriba</p>
          </div>
        )}
      </div>

      {/* Administración de Medicamentos del Turno */}
      <div className="glass-effect p-6 rounded-2xl shadow-lg border border-gray-200/50">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold flex items-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            <Pill className="mr-2 text-green-600" size={24} />
            Administración de Medicamentos del Turno
          </h3>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
            {treatments.filter(treatment => {
              const treatmentDate = new Date(treatment.lastApplication);
              const today = new Date();
              return treatmentDate.toDateString() === today.toDateString();
            }).length} administraciones hoy
          </span>
        </div>
        
        {treatments.length > 0 ? (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {treatments.slice().reverse().map((treatment, index) => {
              const patient = patients.find(p => p.id === treatment.patientId);
              const treatmentDate = new Date(treatment.lastApplication);
              const today = new Date();
              const isToday = treatmentDate.toDateString() === today.toDateString();
              const isRecent = (Date.now() - treatmentDate.getTime()) < 3600000; // Última hora
              
              // Extraer solo la hora de la última aplicación
              const applicationTime = treatmentDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
              
              return (
                <div 
                  key={treatment.id || index} 
                  className="border-l-4 border-green-300 bg-green-50 rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Pill className="text-green-600" size={20} />
                      <div>
                        <p className="font-bold text-gray-800">
                          {patient ? patient.name : 'Paciente desconocido'}
                          {isToday && <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">HOY</span>}
                          {isRecent && <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">RECIENTE</span>}
                        </p>
                        <p className="text-xs text-gray-500">
                          🏥 Habitación {patient?.room} • 
                          <Clock className="inline ml-1 mr-1" size={12} />
                          Hora de aplicación: <span className="font-bold text-green-700">{applicationTime}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 pl-7">
                    <div className="bg-white p-2.5 rounded-lg">
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        💊 Medicamento
                      </p>
                      <p className="font-bold text-sm text-gray-800">{treatment.medication}</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg">
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        📊 Dosis
                      </p>
                      <p className="font-bold text-sm text-gray-800">{treatment.dose}</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg">
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        ⏰ Frecuencia
                      </p>
                      <p className="font-bold text-sm text-gray-800">{treatment.frequency}</p>
                    </div>
                  </div>
                  
                  {treatment.notes && (
                    <div className="bg-white p-2.5 rounded-lg mb-3 pl-7">
                      <p className="text-xs text-gray-600 mb-1">📝 Notas:</p>
                      <p className="text-sm text-gray-700 italic">{treatment.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pl-7 pt-2 border-t border-green-200">
                    <p className="text-xs text-gray-500">
                      👨‍⚕️ Administrado por: <span className="font-semibold">{treatment.appliedBy}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      #{treatment.id}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Pill className="mx-auto mb-3 text-gray-400" size={48} />
            <p>No hay medicamentos administrados</p>
            <p className="text-sm mt-2">Registre la primera administración del turno arriba</p>
          </div>
        )}
      </div>

      <div className="glass-effect p-6 rounded-2xl shadow-lg border border-gray-200/50">
        <h3 className="text-xl font-bold mb-5 flex items-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          <Clock className="mr-2 text-blue-600" size={24} />
          Citas Programadas del Día
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-gradient-to-r from-purple-50 to-blue-50 border-b-2 border-purple-200">
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Paciente</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Hora</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Especialidad</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Médico</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Estado</th>
              </tr>
            </thead>
            <tbody>
              {appointments.filter(a => a.date === '2025-10-30').map(apt => (
                <tr key={apt.id} className="border-b border-gray-100 hover:bg-purple-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{apt.patientName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">⏰ {apt.time}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{apt.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">👨‍⚕️ {apt.doctor}</td>
                  <td className="px-4 py-3">
                    <span className={'status-badge ' + (apt.status === 'Confirmada' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white')}>
                      {apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-effect p-6 rounded-2xl shadow-lg border border-gray-200/50">
        <h3 className="text-xl font-bold mb-5 flex items-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          <Activity className="mr-2 text-green-600" size={24} />
          Tratamientos Registrados Recientes
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {treatments.slice(-10).reverse().map(trt => {
            const patient = patients.find(p => p.id === trt.patientId);
            return (
              <div key={trt.id} className="bg-white border-2 border-gray-100 p-4 rounded-xl hover:border-green-300 hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{patient ? patient.name : 'Paciente desconocido'} • Hab. {patient?.room}</p>
                    <p className="text-sm text-gray-600 mt-1">💊 {trt.medication} - {trt.dose}</p>
                    <p className="text-sm text-gray-600">⏰ Frecuencia: {trt.frequency}</p>
                    {trt.notes && <p className="text-sm text-gray-500 mt-2 italic bg-gray-50 p-2 rounded">📝 {trt.notes}</p>}
                    <p className="text-xs text-gray-500 mt-2">👨‍⚕️ Aplicado por: {trt.appliedBy}</p>
                    <p className="text-xs text-gray-500">Última aplicación: {trt.lastApplication}</p>
                  </div>
                  <span className="px-2 md:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold self-start">
                    Activo
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hoja de Enfermería Digital - Resumen del Turno */}
      <div className="glass-effect p-6 rounded-2xl shadow-lg border-2 border-indigo-200 bg-gradient-to-br from-white to-indigo-50 print:shadow-none">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            <FileText className="mr-3 text-indigo-600" size={28} />
            📋 Hoja de Enfermería Digital
          </h3>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all font-semibold shadow-md flex items-center gap-2 print:hidden"
          >
            <FileText size={18} />
            Imprimir
          </button>
        </div>

        {/* Información del Turno */}
        <div className="bg-white rounded-xl p-5 mb-5 border-2 border-indigo-100">
          <h4 className="font-bold text-lg text-indigo-700 mb-4 flex items-center">
            <Clock className="mr-2" size={20} />
            Información del Turno
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50 p-3 rounded-lg">
              <p className="text-xs text-indigo-600 font-semibold mb-1">👨‍⚕️ Enfermero(a)</p>
              <p className="font-bold text-gray-800">{currentUser.name}</p>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg">
              <p className="text-xs text-indigo-600 font-semibold mb-1">📅 Fecha</p>
              <p className="font-bold text-gray-800">
                {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg">
              <p className="text-xs text-indigo-600 font-semibold mb-1">🕐 Turno</p>
              <p className="font-bold text-gray-800">
                {(() => {
                  const hour = new Date().getHours();
                  if (hour >= 7 && hour < 15) return '🌅 Mañana (07:00 - 15:00)';
                  if (hour >= 15 && hour < 23) return '🌆 Tarde (15:00 - 23:00)';
                  return '🌙 Noche (23:00 - 07:00)';
                })()}
              </p>
            </div>
          </div>
        </div>

        {/* Resumen de Pacientes Asignados */}
        <div className="bg-white rounded-xl p-5 mb-5 border-2 border-green-100">
          <h4 className="font-bold text-lg text-green-700 mb-4 flex items-center">
            <Users className="mr-2" size={20} />
            Pacientes Asignados ({assignedPatients.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {assignedPatients.map((patient) => {
              const triageInfo = getTriageInfo(patient.triageLevel || 3);
              return (
                <div key={patient.id} className={`bg-gray-50 p-3 rounded-lg border-l-4 ${triageInfo.borderColor}`}>
                  <p className="font-bold text-gray-800 text-sm">{patient.name}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    🏥 Hab. {patient.room} • Piso {patient.floor} • {patient.area}
                  </p>
                  <p className="text-xs text-gray-600">🛏️ Cama {patient.bed}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${triageInfo.bgColor} ${triageInfo.textColor}`}>
                      {triageInfo.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumen Estadístico del Turno */}
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-5 border-2 border-indigo-200">
          <h4 className="font-bold text-lg text-indigo-800 mb-4 flex items-center">
            <BarChart3 className="mr-2" size={20} />
            Resumen Estadístico del Turno
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-white p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">{assignedPatients.length}</p>
              <p className="text-xs text-gray-600 mt-1">Pacientes</p>
            </div>
            <div className="bg-white p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-red-600">
                {vitalSigns.filter(v => {
                  const d = new Date(v.date);
                  return d.toDateString() === new Date().toDateString();
                }).length}
              </p>
              <p className="text-xs text-gray-600 mt-1">Signos Vitales</p>
            </div>
            <div className="bg-white p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">
                {treatments.filter(t => {
                  const d = new Date(t.lastApplication);
                  return d.toDateString() === new Date().toDateString();
                }).length}
              </p>
              <p className="text-xs text-gray-600 mt-1">Medicamentos</p>
            </div>
            <div className="bg-white p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600">
                {nonPharmaTreatments.filter(t => {
                  const d = new Date(t.applicationDate);
                  return d.toDateString() === new Date().toDateString();
                }).length}
              </p>
              <p className="text-xs text-gray-600 mt-1">Procedimientos</p>
            </div>
            <div className="bg-white p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">
                {nurseNotes.filter(n => {
                  const d = new Date(n.date);
                  return d.toDateString() === new Date().toDateString();
                }).length}
              </p>
              <p className="text-xs text-gray-600 mt-1">Notas</p>
            </div>
          </div>
          
          <div className="mt-4 bg-white p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">
              <span className="font-semibold">Generado:</span> {new Date().toLocaleString('es-ES')}
            </p>
            <p className="text-xs text-gray-600">
              <span className="font-semibold">Responsable:</span> {currentUser.name}
            </p>
          </div>
        </div>
      </div>
    </div>
    );
  };

  const PatientDashboard = () => {
    // Move patient-specific state here
    const [newAppointment, setNewAppointment] = useState({ patientName: '', date: '', time: '', type: '' });
    
    return (
    <div className="space-y-6 page-transition">
      <div className="glass-effect p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200/50">
        <h3 className="text-2xl font-bold mb-6 flex items-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          <Calendar className="mr-3 text-blue-600" size={28} />
          Agendar Nueva Cita
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="👤 Nombre del paciente"
            className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
            value={newAppointment.patientName}
            onChange={(e) => setNewAppointment(prev => ({...prev, patientName: e.target.value}))}
          />
          <select
            className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
            value={newAppointment.type}
            onChange={(e) => setNewAppointment(prev => ({...prev, type: e.target.value}))}
          >
            <option value="">🏥 Seleccionar especialidad</option>
            {specialties.map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}
          </select>
          <input
            type="date"
            className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
            value={newAppointment.date}
            onChange={(e) => setNewAppointment(prev => ({...prev, date: e.target.value}))}
          />
          <input
            type="time"
            className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
            value={newAppointment.time}
            onChange={(e) => setNewAppointment(prev => ({...prev, time: e.target.value}))}
          />
        </div>
        <button
          onClick={scheduleAppointment}
          className="mt-6 w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl"
        >
          ✨ Agendar Cita
        </button>
      </div>

      <div className="glass-effect p-6 rounded-2xl shadow-lg border border-gray-200/50">
        <h3 className="text-xl font-bold mb-5 flex items-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          <Clock className="mr-2 text-green-600" size={24} />
          Mis Citas
        </h3>
        <div className="space-y-3">
          {appointments.filter(a => a.patientId === currentUser.id).map(apt => (
            <div key={apt.id} className="bg-white border-2 border-gray-100 p-4 rounded-xl hover:border-green-300 hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <p className="font-bold text-gray-800">{apt.type}</p>
                  <p className="text-sm text-gray-600">📅 {apt.date} a las ⏰ {apt.time}</p>
                  <p className="text-sm text-gray-600">👨‍⚕️ Médico: {apt.doctor}</p>
                </div>
                <span className={'status-badge ' + (apt.status === 'Confirmada' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white')}>
                  {apt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-effect p-6 rounded-2xl shadow-lg border border-gray-200/50">
        <h3 className="text-xl font-bold mb-5 flex items-center bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          <FileText className="mr-2 text-blue-600" size={24} />
          Mi Historial Médico
        </h3>
        <div className="space-y-3">
          {medicalHistory.filter(h => h.patientId === currentUser.id).map(record => (
            <div key={record.id} className="bg-white border-2 border-gray-100 p-4 rounded-xl hover:border-blue-300 hover:shadow-md transition-all">
              <p className="font-bold text-lg text-gray-800">{record.diagnosis}</p>
              <p className="text-sm text-gray-600 mt-1">📅 Fecha: {record.date}</p>
              <p className="text-sm text-gray-600">💊 Tratamiento: {record.treatment}</p>
              <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-3 rounded-lg italic">📝 {record.notes}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center">
          <TestTube className="mr-2 text-green-600" size={20} />
          Resultados de Laboratorio
        </h3>
        <div className="space-y-3">
          {labTests.filter(t => t.patientId === currentUser.id).map(test => (
            <div key={test.id} className="border border-gray-200 p-3 md:p-4 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <p className="font-semibold text-sm md:text-base text-gray-800">{test.test}</p>
                  <p className="text-xs md:text-sm text-gray-600">Fecha: {test.date}</p>
                  <p className="text-xs md:text-sm text-gray-600">Resultados: {test.results}</p>
                </div>
                <span className={'px-2 md:px-3 py-1 rounded-full text-xs font-semibold ' + (test.status === 'Completado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')}>
                  {test.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center">
          <Pill className="mr-2 text-blue-600" size={20} />
          Mis Tratamientos Activos
        </h3>
        <div className="space-y-3">
          {treatments.filter(t => t.patientId === currentUser.id).map(trt => (
            <div key={trt.id} className="border border-gray-200 p-3 md:p-4 rounded-lg">
              <p className="font-semibold text-sm md:text-base text-gray-800">{trt.medication} - {trt.dose}</p>
              <p className="text-xs md:text-sm text-gray-600">Frecuencia: {trt.frequency}</p>
              <p className="text-xs text-gray-500 mt-2">Última aplicación: {trt.lastApplication}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {currentUser && (
        <nav className="glass-effect border-b border-gray-200/50 sticky top-0 z-50 shadow-xl backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top Bar */}
            <div className="flex justify-between items-center py-4">
              {/* Logo and Brand */}
              <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setCurrentView('dashboard')}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-lg opacity-50 group-hover:opacity-70 transition"></div>
                  <Activity className="text-purple-600 relative" size={36} />
                </div>
                <div>
                  <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-blue-700 transition">
                    Hospital San Rafael
                  </h1>
                  <p className="text-xs text-gray-600 font-semibold">
                    {currentUser.type === 'nurse' ? '👨‍⚕️ Panel de Enfermería' : 
                     currentUser.type === 'admin' ? '⚡ Panel de Administración' :
                     currentUser.role === 'doctor' ? '🩺 Panel Médico' :
                     '👤 Portal del Paciente'}
                  </p>
                </div>
              </div>
              
              {/* Search Bar (Desktop) */}
              <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
                <SearchBar onSearch={handleSearchResult} />
              </div>
              
              {/* User Info & Actions */}
              <div className="flex items-center gap-4">
                <NotificationCenter />
                
                {/* User Menu */}
                <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-2.5 rounded-xl border border-purple-100">
                  <div className="text-right">
                    <p className="font-bold text-gray-800 text-sm">{currentUser.name}</p>
                    <p className="text-xs text-gray-600">
                      {currentUser.type === 'nurse' ? 'Enfermero' : 
                       currentUser.type === 'admin' ? 'Administrador' :
                       currentUser.role === 'doctor' ? 'Médico' :
                       'Paciente'}
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentView('profile')}
                    className="p-2 hover:bg-purple-100 rounded-lg transition"
                    title="Mi Perfil"
                  >
                    <User size={20} className="text-purple-600" />
                  </button>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <LogOut size={18} />
                  <span className="hidden md:inline">Salir</span>
                </button>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="border-t border-gray-200/50 py-3">
              <div className="flex items-center justify-center gap-1 overflow-x-auto">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    currentView === 'dashboard' 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Activity size={18} />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => setCurrentView('calendar')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    currentView === 'calendar' 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Calendar size={18} />
                  <span>Calendario</span>
                </button>

                <button
                  onClick={() => setCurrentView('pharmacy')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    currentView === 'pharmacy' 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Pill size={18} />
                  <span>Farmacia</span>
                </button>

                <button
                  onClick={() => setCurrentView('emergency')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    currentView === 'emergency' 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <AlertCircle size={18} />
                  <span>Emergencias</span>
                </button>

                <button
                  onClick={() => setCurrentView('lab')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    currentView === 'lab' 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <TestTube size={18} />
                  <span>Laboratorio</span>
                </button>

                <button
                  onClick={() => setCurrentView('radiology')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    currentView === 'radiology' 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Scan size={18} />
                  <span>Radiología</span>
                </button>

                <button
                  onClick={() => setCurrentView('surgery')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    currentView === 'surgery' 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Scissors size={18} />
                  <span>Cirugías</span>
                </button>

                <button
                  onClick={() => setCurrentView('messaging')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    currentView === 'messaging' 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <MessageSquare size={18} />
                  <span>Mensajería</span>
                </button>

                <button
                  onClick={() => setCurrentView('reports')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    currentView === 'reports' 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 size={18} />
                  <span>Reportes</span>
                </button>

                <button
                  onClick={() => setCurrentView('settings')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    currentView === 'settings' 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings size={18} />
                  <span>Configuración</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      <div className="max-w-[1920px] mx-auto px-6 sm:px-8 lg:px-12 py-4 md:py-6">
        <ErrorBoundary>
          {currentView === 'home' && <HomePage />}
          {currentView === 'login' && (
            <LoginForm 
              onLoginSuccess={(user) => {
                handleLoginSuccess(user);
              }}
              onBackToHome={() => {
                setCurrentView('home');
              }}
            />
          )}
          {currentView === 'register' && (
            <RegisterForm 
              onRegisterSuccess={() => {
                setCurrentView('login');
              }}
              onBackToHome={() => {
                setCurrentView('home');
              }}
            />
          )}
          {currentView === 'dashboard' && currentUser && (
            <Suspense fallback={<LoadingFallback />}>
              {/* Tour guiado para nuevos usuarios */}
              <GuidedTour 
                userRole={currentUser.role || currentUser.type} 
                onComplete={() => console.log('Tour completado')}
              />
              {currentUser.type === 'admin' || currentUser.role === 'admin' ? <AdvancedDashboard currentUser={currentUser} /> :
              currentUser.role === 'doctor' ? <DoctorDashboard currentUser={currentUser} /> :
              currentUser.type === 'nurse' ? <NurseDashboard /> : 
              <PatientDashboard />}
            </Suspense>
          )}
          {currentView === 'profile' && currentUser && (
            <Suspense fallback={<LoadingFallback />}>
              <UserProfile 
                currentUser={currentUser} 
                onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
              />
            </Suspense>
          )}
          {currentView === 'calendar' && currentUser && (
            <Suspense fallback={<LoadingFallback />}>
              <AppointmentCalendar currentUser={currentUser} />
            </Suspense>
          )}
          {currentView === 'pharmacy' && currentUser && (
            <Suspense fallback={<LoadingFallback />}>
              <PharmacyManagement currentUser={currentUser} />
            </Suspense>
          )}
          {currentView === 'emergency' && currentUser && (
            <Suspense fallback={<LoadingFallback />}>
              <EmergencyRoom currentUser={currentUser} />
            </Suspense>
          )}
          {currentView === 'surgery' && currentUser && (
            <Suspense fallback={<LoadingFallback />}>
              <SurgeryScheduling currentUser={currentUser} />
            </Suspense>
          )}
          {currentView === 'messaging' && currentUser && (
            <Suspense fallback={<LoadingFallback />}>
              <MessagingSystem currentUser={currentUser} />
            </Suspense>
          )}
          {currentView === 'reports' && currentUser && (
            <Suspense fallback={<LoadingFallback />}>
              <ReportsAnalytics currentUser={currentUser} />
            </Suspense>
          )}
          {currentView === 'lab' && currentUser && (
            <Suspense fallback={<LoadingFallback />}>
              <LabManagement currentUser={currentUser} />
            </Suspense>
          )}
          {currentView === 'radiology' && currentUser && (
            <Suspense fallback={<LoadingFallback />}>
              <RadiologyManagement currentUser={currentUser} />
            </Suspense>
          )}
          {currentView === 'settings' && currentUser && (
            <Suspense fallback={<LoadingFallback />}>
              <SettingsPage currentUser={currentUser} />
            </Suspense>
          )}
          {currentView === 'patientDetails' && currentUser && currentUser.type === 'nurse' && <PatientDetailsView />}
        </ErrorBoundary>
      </div>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcuts 
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />
    </div>
  );
};

export default HospitalManagementSystem;