// Example: How to convert App.jsx to use SQLite database instead of in-memory state
//
// BEFORE (in-memory state):
// const [patients, setPatients] = useState([
//   { id: 1, name: 'Juan Pérez', age: 45, room: '201', ... },
//   ...
// ]);
//
// AFTER (using database hooks):

import { usePatients, useAppointments, useTreatments, useVitalSigns, useNurseNotes } from './hooks/useDatabase';

function HospitalManagementSystem() {
  // Database hooks replace useState
  const { patients, loading: loadingPatients, addPatient, updatePatient, removePatient } = usePatients();
  const { appointments, loading: loadingAppts, addAppointment } = useAppointments();
  const { treatments, addTreatment } = useTreatments();
  const { vitalSigns, addVitalSigns } = useVitalSigns();
  const { nurseNotes, addNurseNote } = useNurseNotes();

  // Other state remains the same
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // Form state
  const [newAppointment, setNewAppointment] = useState({ patientName: '', date: '', time: '', type: '' });
  const [newTreatment, setNewTreatment] = useState({ patientId: '', medication: '', dose: '', frequency: '', notes: '' });
  const [newVitalSigns, setNewVitalSigns] = useState({ patientId: '', temperature: '', bloodPressure: '', heartRate: '', respiratoryRate: '' });
  const [newNurseNote, setNewNurseNote] = useState({ patientId: '', note: '' });

  // CONVERTING FUNCTIONS:

  // OLD scheduleAppointment:
  // const scheduleAppointment = () => {
  //   const newApt = { id: appointments.length + 1, ... };
  //   setAppointments([...appointments, newApt]);
  // };

  // NEW scheduleAppointment (using database):
  const scheduleAppointment = async () => {
    if (newAppointment.patientName && newAppointment.date && newAppointment.time && newAppointment.type) {
      // Check for conflicts (still works, appointments is from database)
      const conflictingAppointment = appointments.find(
        apt => apt.date === newAppointment.date && apt.time === newAppointment.time
      );
      
      if (conflictingAppointment) {
        alert('Ya existe una cita programada para esta fecha y hora.');
        return;
      }

      try {
        // Instead of setAppointments, use addAppointment from hook
        await addAppointment({
          patientId: currentUser.type === 'patient' ? currentUser.id : null,
          patientName: newAppointment.patientName,
          date: newAppointment.date,
          time: newAppointment.time,
          type: newAppointment.type,
          status: 'Pendiente',
          doctor: 'Por asignar'
        });
        
        setNewAppointment({ patientName: '', date: '', time: '', type: '' });
        alert('Cita agendada exitosamente');
      } catch (error) {
        console.error('Error scheduling appointment:', error);
        alert('Error al agendar la cita');
      }
    } else {
      alert('Por favor complete todos los campos');
    }
  };

  // OLD registerVitalSigns:
  // const registerVitalSigns = () => {
  //   const newVS = { id: vitalSigns.length + 1, ... };
  //   setVitalSigns([...vitalSigns, newVS]);
  // };

  // NEW registerVitalSigns (using database):
  const registerVitalSigns = async () => {
    if (newVitalSigns.patientId && newVitalSigns.temperature && newVitalSigns.bloodPressure && 
        newVitalSigns.heartRate && newVitalSigns.respiratoryRate) {
      
      const now = new Date();
      const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      try {
        await addVitalSigns({
          patientId: parseInt(newVitalSigns.patientId),
          date: timestamp,
          temperature: newVitalSigns.temperature,
          bloodPressure: newVitalSigns.bloodPressure,
          heartRate: newVitalSigns.heartRate,
          respiratoryRate: newVitalSigns.respiratoryRate,
          registeredBy: currentUser.name
        });
        
        setNewVitalSigns({ patientId: '', temperature: '', bloodPressure: '', heartRate: '', respiratoryRate: '' });
        alert('Signos vitales registrados exitosamente');
      } catch (error) {
        console.error('Error registering vital signs:', error);
        alert('Error al registrar signos vitales');
      }
    } else {
      alert('Por favor complete todos los campos');
    }
  };

  // Similar pattern for all other functions:
  // applyTreatment -> use addTreatment
  // addNurseNote -> use addNurseNote

  // RENDERING WITH LOADING STATES:
  
  // Show loading indicator while fetching
  if (loadingPatients) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  // Rest of component remains mostly the same
  // Data filtering still works:
  const patientTreatments = treatments.filter(t => t.patientId === selectedPatient?.id);
  // Mapping works the same:
  {patients.map(patient => (
    <div key={patient.id}>...</div>
  ))}

  return (
    // Your existing JSX...
  );
}

// KEY CHANGES SUMMARY:
// 
// 1. Replace useState arrays with useDatabase hooks
// 2. Make all mutation functions async
// 3. Use add*/update*/remove* functions from hooks instead of setState
// 4. Add try/catch for error handling
// 5. Add loading states for better UX
// 6. Data filtering and mapping remain the same - hooks return plain arrays
//
// DATABASE FIELD NAME MAPPING:
// 
// JavaScript (camelCase) -> SQL (snake_case)
// - admissionDate -> admission_date
// - bloodType -> blood_type
// - patientId -> patient_id
// - patientName -> patient_name
// - startDate -> start_date
// - appliedBy -> applied_by
// - lastApplication -> last_application
// - bloodPressure -> blood_pressure
// - heartRate -> heart_rate
// - respiratoryRate -> respiratory_rate
// - registeredBy -> registered_by
// - orderedBy -> ordered_by
// - nurseName -> nurse_name
//
// The database service handles this conversion automatically!

export default HospitalManagementSystem;
