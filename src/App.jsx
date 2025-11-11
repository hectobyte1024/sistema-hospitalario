import React, { useState } from 'react';
import { Calendar, Clock, User, FileText, Activity, Users, Pill, TestTube, LogOut, Heart, Stethoscope, Brain, Eye, Bone, AlertCircle, CheckCircle, Menu, X, Phone } from 'lucide-react';
import { usePatients, useAppointments, useTreatments, useVitalSigns, useNurseNotes } from './hooks/useDatabase';
import { logout as authLogout } from './services/auth';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

const HospitalManagementSystem = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
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

  // Keep lab tests and medical history as local state for now (can be migrated later)
  const [labTests, setLabTests] = useState([
    { id: 1, patientId: 1, test: 'Hemograma completo', date: '2025-10-28', status: 'Completado', results: 'Normal', orderedBy: 'Dr. Ramírez' },
    { id: 2, patientId: 2, test: 'Resonancia Magnética', date: '2025-10-29', status: 'Pendiente', results: '-', orderedBy: 'Dra. Torres' }
  ]);

  const [medicalHistory, setMedicalHistory] = useState([
    { id: 1, patientId: 1, date: '2025-10-25', diagnosis: 'Hipertensión arterial', treatment: 'Losartán 50mg', notes: 'Paciente con control regular de presión arterial', doctor: 'Dr. Ramírez' },
    { id: 2, patientId: 2, date: '2025-10-27', diagnosis: 'Accidente cerebrovascular', treatment: 'Tratamiento de emergencia', notes: 'Ingreso por urgencias, requiere monitoreo constante', doctor: 'Dra. Torres' }
  ]);

  const [newAppointment, setNewAppointment] = useState({ patientName: '', date: '', time: '', type: '' });
  const [newTreatment, setNewTreatment] = useState({ patientId: '', medication: '', dose: '', frequency: '', notes: '' });
  const [newVitalSigns, setNewVitalSigns] = useState({ patientId: '', temperature: '', bloodPressure: '', heartRate: '', respiratoryRate: '' });
  const [newNurseNote, setNewNurseNote] = useState({ patientId: '', note: '' });
  const [selectedPatient, setSelectedPatient] = useState(null);

  const specialties = [
    { name: 'Cardiología', icon: Heart, description: 'Cuidado del corazón y sistema cardiovascular' },
    { name: 'Neurología', icon: Brain, description: 'Tratamiento del sistema nervioso' },
    { name: 'Oftalmología', icon: Eye, description: 'Especialistas en salud visual' },
    { name: 'Traumatología', icon: Bone, description: 'Tratamiento de huesos y articulaciones' },
    { name: 'Medicina General', icon: Stethoscope, description: 'Atención médica integral' }
  ];

  const handleLoginSuccess = (user) => {
    // Map role to type for backwards compatibility
    setCurrentUser({
      ...user,
      type: user.role === 'nurse' ? 'nurse' : user.role === 'patient' ? 'patient' : 'admin'
    });
    setCurrentView('dashboard');
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
      const now = new Date();
      const timestamp = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
      
      try {
        const newTrt = {
          patient_id: parseInt(newTreatment.patientId),
          medication: newTreatment.medication,
          dose: newTreatment.dose,
          frequency: newTreatment.frequency,
          start_date: timestamp.split(' ')[0],
          applied_by: currentUser.name,
          last_application: timestamp,
          notes: newTreatment.notes
        };
        await addTreatmentDB(newTrt);
        setNewTreatment({ patientId: '', medication: '', dose: '', frequency: '', notes: '' });
        alert('Tratamiento aplicado y registrado exitosamente');
      } catch (error) {
        console.error('Error applying treatment:', error);
        alert('Error al aplicar tratamiento. Por favor intente nuevamente.');
      }
    } else {
      alert('Por favor complete todos los campos obligatorios');
    }
  };

  const registerVitalSigns = async () => {
    if (newVitalSigns.patientId && newVitalSigns.temperature && newVitalSigns.bloodPressure && newVitalSigns.heartRate && newVitalSigns.respiratoryRate) {
      const now = new Date();
      const timestamp = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
      
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
        setNewVitalSigns({ patientId: '', temperature: '', bloodPressure: '', heartRate: '', respiratoryRate: '' });
        alert('Signos vitales registrados exitosamente');
      } catch (error) {
        console.error('Error registering vital signs:', error);
        alert('Error al registrar signos vitales. Por favor intente nuevamente.');
      }
    } else {
      alert('Por favor complete todos los campos');
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
          nurse_name: currentUser.name
        };
        await addNurseNoteDB(newNote);
        setNewNurseNote({ patientId: '', note: '' });
        alert('Nota de enfermería agregada exitosamente');
      } catch (error) {
        console.error('Error adding nurse note:', error);
        alert('Error al agregar nota. Por favor intente nuevamente.');
      }
    } else {
      alert('Por favor complete todos los campos');
    }
  };

  const viewPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setCurrentView('patientDetails');
  };

  const PatientDetailsView = () => {
    if (!selectedPatient) return null;
    
    const patientTreatments = treatments.filter(t => t.patientId === selectedPatient.id);
    const patientHistory = medicalHistory.filter(h => h.patientId === selectedPatient.id);
    const patientLabs = labTests.filter(l => l.patientId === selectedPatient.id);
    const patientAppointments = appointments.filter(a => a.patientId === selectedPatient.id);
    const patientVitals = vitalSigns.filter(v => v.patientId === selectedPatient.id);
    const patientNotes = nurseNotes.filter(n => n.patientId === selectedPatient.id);

    return (
      <div className="space-y-4 md:space-y-6">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-3 md:px-4 py-2 text-sm md:text-base bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          ← Volver al Dashboard
        </button>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800 flex items-center">
            <User className="mr-2 text-blue-600" size={24} />
            Información del Paciente
          </h2>
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
              <p className="text-gray-600 text-xs md:text-sm">Habitación</p>
              <p className="font-semibold text-base md:text-lg">{selectedPatient.room}</p>
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

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center">
            <Activity className="mr-2 text-red-600" size={20} />
            Signos Vitales Recientes
          </h3>
          {patientVitals.length > 0 ? (
            <div className="space-y-3">
              {patientVitals.slice(-5).reverse().map(vital => (
                <div key={vital.id} className="border border-gray-200 p-3 md:p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500 mb-2">{vital.date} - {vital.registeredBy}</p>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Temperatura</p>
                      <p className="font-semibold text-sm md:text-base">{vital.temperature}°C</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Presión Arterial</p>
                      <p className="font-semibold text-sm md:text-base">{vital.bloodPressure} mmHg</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Frecuencia Cardíaca</p>
                      <p className="font-semibold text-sm md:text-base">{vital.heartRate} lpm</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Frecuencia Respiratoria</p>
                      <p className="font-semibold text-sm md:text-base">{vital.respiratoryRate} rpm</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hay signos vitales registrados</p>
          )}
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center">
            <FileText className="mr-2 text-blue-600" size={20} />
            Notas de Enfermería
          </h3>
          {patientNotes.length > 0 ? (
            <div className="space-y-3">
              {patientNotes.slice(-5).reverse().map(note => (
                <div key={note.id} className="border border-gray-200 p-3 md:p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500 mb-1">{note.date} - {note.nurseName}</p>
                  <p className="text-sm md:text-base text-gray-800">{note.note}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hay notas de enfermería</p>
          )}
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center">
            <Pill className="mr-2 text-green-600" size={20} />
            Tratamientos Activos
          </h3>
          {patientTreatments.length > 0 ? (
            <div className="space-y-3">
              {patientTreatments.map(trt => (
                <div key={trt.id} className="border border-gray-200 p-3 md:p-4 rounded-lg">
                  <p className="font-semibold text-sm md:text-base text-gray-800">{trt.medication} - {trt.dose}</p>
                  <p className="text-xs md:text-sm text-gray-600">Frecuencia: {trt.frequency}</p>
                  {trt.notes && <p className="text-xs md:text-sm text-gray-600">Notas: {trt.notes}</p>}
                  <p className="text-xs text-gray-500 mt-2">Aplicado por: {trt.appliedBy}</p>
                  <p className="text-xs text-gray-500">Última aplicación: {trt.lastApplication}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hay tratamientos activos</p>
          )}
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center">
            <FileText className="mr-2 text-blue-600" size={20} />
            Historial Médico
          </h3>
          {patientHistory.length > 0 ? (
            <div className="space-y-3">
              {patientHistory.map(record => (
                <div key={record.id} className="border border-gray-200 p-3 md:p-4 rounded-lg">
                  <p className="font-semibold text-sm md:text-base text-gray-800">{record.diagnosis}</p>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">Fecha: {record.date}</p>
                  <p className="text-xs md:text-sm text-gray-600">Médico: {record.doctor}</p>
                  <p className="text-xs md:text-sm text-gray-600">Tratamiento: {record.treatment}</p>
                  <p className="text-xs md:text-sm text-gray-500 mt-2">{record.notes}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hay historial médico registrado</p>
          )}
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center">
            <TestTube className="mr-2 text-blue-600" size={20} />
            Resultados de Laboratorio
          </h3>
          {patientLabs.length > 0 ? (
            <div className="space-y-3">
              {patientLabs.map(test => (
                <div key={test.id} className="border border-gray-200 p-3 md:p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <p className="font-semibold text-sm md:text-base text-gray-800">{test.test}</p>
                      <p className="text-xs md:text-sm text-gray-600">Fecha: {test.date}</p>
                      <p className="text-xs md:text-sm text-gray-600">Ordenado por: {test.orderedBy}</p>
                      <p className="text-xs md:text-sm text-gray-600">Resultados: {test.results}</p>
                    </div>
                    <span className={'px-2 md:px-3 py-1 rounded-full text-xs font-semibold ' + (test.status === 'Completado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')}>
                      {test.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hay resultados de laboratorio</p>
          )}
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center">
            <Calendar className="mr-2 text-green-600" size={20} />
            Citas Programadas
          </h3>
          {patientAppointments.length > 0 ? (
            <div className="space-y-3">
              {patientAppointments.map(apt => (
                <div key={apt.id} className="border border-gray-200 p-3 md:p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <p className="font-semibold text-sm md:text-base text-gray-800">{apt.type}</p>
                      <p className="text-xs md:text-sm text-gray-600">{apt.date} a las {apt.time}</p>
                      <p className="text-xs md:text-sm text-gray-600">Médico: {apt.doctor}</p>
                    </div>
                    <span className={'px-2 md:px-3 py-1 rounded-full text-xs font-semibold ' + (apt.status === 'Confirmada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay citas programadas</p>
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
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-row gap-3">
            <button 
              onClick={() => setShowLoginModal(true)} 
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition font-semibold shadow-lg hover:shadow-xl"
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => setShowRegisterModal(true)} 
              className="px-6 py-2.5 bg-white text-purple-600 rounded-xl hover:bg-gray-50 transition font-semibold shadow-lg border-2 border-purple-200"
            >
              Registrarse
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed top-0 right-0 h-full w-72 glass-effect shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out animate-slideInRight">
              <div className="p-5 border-b border-purple-200 flex justify-between items-center">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Menú</h2>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition">
                  <X size={24} />
                </button>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <button 
                  onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }} 
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition font-semibold shadow-lg"
                >
                  Iniciar Sesión
                </button>
                <button 
                  onClick={() => { setShowRegisterModal(true); setMobileMenuOpen(false); }} 
                  className="w-full px-4 py-3 bg-white text-purple-600 rounded-xl hover:bg-gray-50 transition font-semibold shadow-lg border-2 border-purple-200"
                >
                  Registrarse
                </button>
              </div>
            </div>
          </>
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16 animate-scaleIn">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Bienvenido a Hospital San Rafael
          </h2>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow-md font-medium">
            Cuidado médico de excelencia con tecnología de vanguardia
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
    if (patientsLoading) {
      return (
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center animate-fadeIn">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="spinner mx-auto relative"></div>
            </div>
            <p className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Cargando datos de pacientes...
            </p>
            <p className="text-sm text-gray-500 mt-2">Por favor espere un momento</p>
          </div>
        </div>
      );
    }

    return (
    <div className="space-y-6 page-transition">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="glass-effect p-6 rounded-2xl card-hover border-l-4 border-blue-500 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pacientes Activos</p>
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                {patients.length}
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-30"></div>
              <Users className="text-blue-600 relative" size={40} />
            </div>
          </div>
        </div>
        
        <div className="glass-effect p-6 rounded-2xl card-hover border-l-4 border-green-500 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Citas Hoy</p>
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent">
                {appointments.filter(a => a.date === '2025-10-30').length}
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-lg opacity-30"></div>
              <Calendar className="text-green-600 relative" size={40} />
            </div>
          </div>
        </div>
        
        <div className="glass-effect p-6 rounded-2xl card-hover border-l-4 border-yellow-500 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Tratamientos Activos</p>
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-400 bg-clip-text text-transparent">
                {treatments.length}
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500 rounded-full blur-lg opacity-30"></div>
              <Pill className="text-yellow-600 relative" size={40} />
            </div>
          </div>
        </div>
        
        <div className="glass-effect p-6 rounded-2xl card-hover border-l-4 border-red-500 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Estado Crítico</p>
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-400 bg-clip-text text-transparent">
                {patients.filter(p => p.condition === 'Crítico').length}
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <AlertCircle className="text-red-600 relative" size={40} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-effect p-6 rounded-2xl shadow-lg border border-gray-200/50">
          <h3 className="text-xl font-bold mb-4 flex items-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            <Users className="mr-2 text-purple-600" size={24} />
            Lista de Pacientes
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {patients.map(patient => (
              <div key={patient.id} className="bg-white border-2 border-gray-100 p-4 rounded-xl hover:border-purple-300 hover:shadow-md cursor-pointer transition-all group" onClick={() => viewPatientDetails(patient)}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-800 group-hover:text-purple-600 transition">{patient.name}</p>
                    <p className="text-sm text-gray-600">🏥 Habitación {patient.room} • {patient.age} años</p>
                    <p className="text-xs text-gray-500">🩸 Tipo de sangre: {patient.bloodType}</p>
                  </div>
                  <span className={'status-badge ' + (patient.condition === 'Crítico' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' : patient.condition === 'Estable' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white')}>
                    {patient.condition}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-effect p-6 rounded-2xl shadow-lg border border-gray-200/50">
          <h3 className="text-xl font-bold mb-5 flex items-center bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            <Activity className="mr-2 text-red-600" size={24} />
            Registrar Signos Vitales
          </h3>
          <div className="space-y-4">
            <select
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
              value={newVitalSigns.patientId}
              onChange={(e) => setNewVitalSigns({...newVitalSigns, patientId: e.target.value})}
            >
              <option value="">Seleccionar paciente</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} - Hab. {p.room}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="🌡️ Temperatura (°C)"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
              value={newVitalSigns.temperature}
              onChange={(e) => setNewVitalSigns({...newVitalSigns, temperature: e.target.value})}
            />
            <input
              type="text"
              placeholder="💓 Presión Arterial (120/80)"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
              value={newVitalSigns.bloodPressure}
              onChange={(e) => setNewVitalSigns({...newVitalSigns, bloodPressure: e.target.value})}
            />
            <input
              type="text"
              placeholder="❤️ Frecuencia Cardíaca (lpm)"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
              value={newVitalSigns.heartRate}
              onChange={(e) => setNewVitalSigns({...newVitalSigns, heartRate: e.target.value})}
            />
            <input
              type="text"
              placeholder="🫁 Frecuencia Respiratoria (rpm)"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
              value={newVitalSigns.respiratoryRate}
              onChange={(e) => setNewVitalSigns({...newVitalSigns, respiratoryRate: e.target.value})}
            />
            <button
              onClick={registerVitalSigns}
              className="w-full py-3.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all font-bold shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <CheckCircle className="mr-2" size={20} />
              Registrar Signos Vitales
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-effect p-6 rounded-2xl shadow-lg border border-gray-200/50">
          <h3 className="text-xl font-bold mb-5 flex items-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            <Pill className="mr-2 text-green-600" size={24} />
            Aplicar Tratamiento
          </h3>
          <div className="space-y-4">
            <select
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
              value={newTreatment.patientId}
              onChange={(e) => setNewTreatment({...newTreatment, patientId: e.target.value})}
            >
              <option value="">Seleccionar paciente</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} - Hab. {p.room}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="💊 Medicamento"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
              value={newTreatment.medication}
              onChange={(e) => setNewTreatment({...newTreatment, medication: e.target.value})}
            />
            <input
              type="text"
              placeholder="📊 Dosis (ej: 50mg)"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
              value={newTreatment.dose}
              onChange={(e) => setNewTreatment({...newTreatment, dose: e.target.value})}
            />
            <input
              type="text"
              placeholder="⏰ Frecuencia (ej: Cada 8 horas)"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
              value={newTreatment.frequency}
              onChange={(e) => setNewTreatment({...newTreatment, frequency: e.target.value})}
            />
            <textarea
              placeholder="📝 Notas adicionales (opcional)"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md resize-none"
              rows="3"
              value={newTreatment.notes}
              onChange={(e) => setNewTreatment({...newTreatment, notes: e.target.value})}
            />
            <button
              onClick={applyTreatment}
              className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-bold shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <Pill className="mr-2" size={20} />
              Aplicar y Registrar Tratamiento
            </button>
          </div>
        </div>

        <div className="glass-effect p-6 rounded-2xl shadow-lg border border-gray-200/50">
          <h3 className="text-xl font-bold mb-5 flex items-center bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            <FileText className="mr-2 text-blue-600" size={24} />
            Agregar Nota de Enfermería
          </h3>
          <div className="space-y-4">
            <select
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
              value={newNurseNote.patientId}
              onChange={(e) => setNewNurseNote({...newNurseNote, patientId: e.target.value})}
            >
              <option value="">Seleccionar paciente</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} - Hab. {p.room}</option>
              ))}
            </select>
            <textarea
              placeholder="📋 Escriba su nota de enfermería aquí..."
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md resize-none"
              rows="6"
              value={newNurseNote.note}
              onChange={(e) => setNewNurseNote({...newNurseNote, note: e.target.value})}
            />
            <button
              onClick={addNurseNote}
              className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all font-bold shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <FileText className="mr-2" size={20} />
              Agregar Nota
            </button>
          </div>
        </div>
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
    </div>
    );
  };

  const PatientDashboard = () => (
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
            onChange={(e) => setNewAppointment({...newAppointment, patientName: e.target.value})}
          />
          <select
            className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
            value={newAppointment.type}
            onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value})}
          >
            <option value="">🏥 Seleccionar especialidad</option>
            {specialties.map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}
          </select>
          <input
            type="date"
            className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
            value={newAppointment.date}
            onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
          />
          <input
            type="time"
            className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
            value={newAppointment.time}
            onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {currentUser && (
        <nav className="glass-effect border-b border-gray-200/50 sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-md opacity-50"></div>
                <Activity className="text-purple-600 relative" size={32} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Hospital San Rafael
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  {currentUser.type === 'nurse' ? '👨‍⚕️ Panel de Enfermería' : '👤 Portal del Paciente'}
                </p>
              </div>
            </div>
            
            {/* Desktop User Info & Logout */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-2 rounded-xl border border-purple-100">
                <p className="font-bold text-gray-800">{currentUser.name}</p>
                <p className="text-sm text-gray-600">{currentUser.type === 'nurse' ? 'Enfermero' : 'Paciente'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition flex items-center space-x-2 font-semibold shadow-lg hover:shadow-xl"
              >
                <LogOut size={18} />
                <span>Salir</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu Drawer */}
          {mobileMenuOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="fixed top-0 right-0 h-full w-72 glass-effect shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out animate-slideInRight">
                <div className="p-5 border-b border-purple-200 flex justify-between items-center">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Menú</h2>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition">
                    <X size={24} />
                  </button>
                </div>
                <div className="p-5">
                  <div className="mb-6 pb-5 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl">
                    <p className="font-bold text-gray-800">{currentUser.name}</p>
                    <p className="text-sm text-gray-600">{currentUser.type === 'nurse' ? '👨‍⚕️ Enfermero' : '👤 Paciente'}</p>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition flex items-center justify-center space-x-2 font-semibold shadow-lg"
                  >
                    <LogOut size={18} />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </nav>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {currentView === 'home' && <HomePage />}
        {currentView === 'dashboard' && currentUser && (
          currentUser.type === 'nurse' ? <NurseDashboard /> : <PatientDashboard />
        )}
        {currentView === 'patientDetails' && currentUser && currentUser.type === 'nurse' && <PatientDetailsView />}
      </div>

      {/* Modals that overlay on top */}
      {showLoginModal && (
        <LoginForm 
          onLoginSuccess={(user) => {
            handleLoginSuccess(user);
            setShowLoginModal(false);
          }}
          onBackToHome={() => setShowLoginModal(false)}
        />
      )}
      {showRegisterModal && (
        <RegisterForm 
          onRegisterSuccess={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
          onBackToHome={() => setShowRegisterModal(false)}
        />
      )}
    </div>
  );
};

export default HospitalManagementSystem;