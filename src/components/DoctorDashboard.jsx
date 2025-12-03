import React, { useState, useEffect } from 'react';
import { Stethoscope, Users, FileText, Pill, TestTube, Calendar, Clock, TrendingUp, Activity, Heart, Brain, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { getAllPatients, getPrescriptionsByPatientId, getMedicalHistoryByPatientId, getLabTestsByPatientId, getVitalSignsByPatientId } from '../services/database';
import { usePrescriptions } from '../hooks/useAdvancedDatabase';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function DoctorDashboard({ currentUser }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPrescription, setNewPrescription] = useState({
    medicationName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });
  const [newDiagnosis, setNewDiagnosis] = useState({
    diagnosis: '',
    treatment: '',
    notes: ''
  });

  const { prescriptions, addPrescription, refresh: refreshPrescriptions } = usePrescriptions();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await getAllPatients();
      setPatients(data);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPatientDetails = async (patientId) => {
    try {
      const [prescriptionsData, historyData, labTestsData, vitalsData] = await Promise.all([
        getPrescriptionsByPatientId(patientId),
        getMedicalHistoryByPatientId(patientId),
        getLabTestsByPatientId(patientId),
        getVitalSignsByPatientId(patientId)
      ]);

      setPatientDetails({
        prescriptions: prescriptionsData,
        history: historyData,
        labTests: labTestsData,
        vitals: vitalsData
      });
    } catch (error) {
      console.error('Error loading patient details:', error);
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    loadPatientDetails(patient.id);
  };

  const handleAddPrescription = async (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      alert('Por favor seleccione un paciente');
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      await addPrescription({
        patientId: selectedPatient.id,
        doctorId: currentUser.id,
        medicationName: newPrescription.medicationName,
        dosage: newPrescription.dosage,
        frequency: newPrescription.frequency,
        duration: newPrescription.duration,
        instructions: newPrescription.instructions,
        prescribedDate: today,
        startDate: today,
        endDate: null,
        status: 'Active'
      });

      alert('Prescripción agregada exitosamente');
      setNewPrescription({ medicationName: '', dosage: '', frequency: '', duration: '', instructions: '' });
      await loadPatientDetails(selectedPatient.id);
    } catch (error) {
      console.error('Error adding prescription:', error);
      alert('Error al agregar prescripción');
    }
  };

  const handleAddDiagnosis = async (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      alert('Por favor seleccione un paciente');
      return;
    }

    try {
      const { createMedicalHistory } = await import('../services/database');
      const today = new Date().toISOString().split('T')[0];
      
      await createMedicalHistory({
        patientId: selectedPatient.id,
        date: today,
        diagnosis: newDiagnosis.diagnosis,
        treatment: newDiagnosis.treatment,
        notes: newDiagnosis.notes,
        doctor: currentUser.name
      });

      alert('Diagnóstico agregado exitosamente');
      setNewDiagnosis({ diagnosis: '', treatment: '', notes: '' });
      await loadPatientDetails(selectedPatient.id);
    } catch (error) {
      console.error('Error adding diagnosis:', error);
      alert('Error al agregar diagnóstico');
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="glass-effect p-6 rounded-2xl border-2 border-white/30 hover:shadow-xl transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-1">{label}</p>
          <p className={`text-3xl font-black bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-10`}>
          <Icon className="text-gray-700" size={24} />
        </div>
      </div>
    </div>
  );

  // Sample data for charts
  const vitalTrendsData = patientDetails?.vitals.slice(0, 7).reverse().map(v => ({
    date: new Date(v.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
    temperature: parseFloat(v.temperature) || 0,
    heartRate: parseInt(v.heart_rate) || 0,
    bloodPressure: parseInt(v.blood_pressure.split('/')[0]) || 0
  })) || [];

  const conditionDistribution = [
    { name: 'Estable', value: patients.filter(p => p.condition === 'Estable').length, color: '#10b981' },
    { name: 'Crítico', value: patients.filter(p => p.condition === 'Crítico').length, color: '#ef4444' },
    { name: 'Recuperación', value: patients.filter(p => p.condition === 'Recuperación').length, color: '#f59e0b' },
    { name: 'Observación', value: patients.filter(p => p.condition === 'Observación').length, color: '#3b82f6' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="spinner mb-4 w-12 h-12 border-4 mx-auto"></div>
          <p className="text-gray-600 font-semibold">Cargando panel médico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="glass-effect p-6 rounded-2xl border-2 border-white/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Panel Médico
            </h1>
            <p className="text-gray-600 font-semibold">Sistema de gestión de consultas y tratamientos</p>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl">
            <Stethoscope className="text-blue-600" size={20} />
            <span className="font-bold text-blue-900">Dr. {currentUser.name}</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Pacientes"
          value={patients.length}
          color="from-blue-600 to-cyan-600"
        />
        <StatCard
          icon={Pill}
          label="Prescripciones Activas"
          value={prescriptions.filter(p => p.status === 'Active').length}
          color="from-emerald-600 to-green-600"
        />
        <StatCard
          icon={FileText}
          label="Consultas Hoy"
          value="12"
          color="from-purple-600 to-pink-600"
        />
        <StatCard
          icon={AlertCircle}
          label="Casos Críticos"
          value={patients.filter(p => p.condition === 'Crítico').length}
          color="from-red-600 to-orange-600"
        />
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 glass-effect p-2 rounded-xl border-2 border-white/30">
        {[
          { id: 'overview', label: 'Vista General', icon: Activity },
          { id: 'patients', label: 'Pacientes', icon: Users },
          { id: 'prescriptions', label: 'Prescripciones', icon: Pill },
          { id: 'analytics', label: 'Análisis', icon: TrendingUp }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Condition Distribution */}
          <div className="glass-effect p-6 rounded-2xl border-2 border-white/30">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Heart className="mr-2 text-red-600" size={24} />
              Distribución de Pacientes
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={conditionDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {conditionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Patients */}
          <div className="glass-effect p-6 rounded-2xl border-2 border-white/30">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Users className="mr-2 text-blue-600" size={24} />
              Pacientes Recientes
            </h3>
            <div className="space-y-3">
              {patients.slice(0, 5).map(patient => (
                <div
                  key={patient.id}
                  onClick={() => {
                    handleSelectPatient(patient);
                    setActiveTab('patients');
                  }}
                  className="flex items-center justify-between p-3 bg-white/50 rounded-xl hover:bg-blue-50 cursor-pointer transition"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{patient.name}</p>
                      <p className="text-xs text-gray-500">Habitación {patient.room}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    patient.condition === 'Estable' ? 'bg-green-100 text-green-700' :
                    patient.condition === 'Crítico' ? 'bg-red-100 text-red-700' :
                    patient.condition === 'Recuperación' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {patient.condition}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'patients' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient List */}
          <div className="glass-effect p-6 rounded-2xl border-2 border-white/30">
            <h3 className="text-xl font-bold mb-4">Lista de Pacientes</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {patients.map(patient => (
                <div
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient)}
                  className={`p-3 rounded-xl cursor-pointer transition ${
                    selectedPatient?.id === patient.id
                      ? 'bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-300'
                      : 'bg-white/50 hover:bg-blue-50'
                  }`}
                >
                  <p className="font-semibold text-gray-800">{patient.name}</p>
                  <p className="text-xs text-gray-500">{patient.age} años • {patient.blood_type} • Hab. {patient.room}</p>
                  <p className="text-xs text-gray-600 mt-1">{patient.condition}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedPatient ? (
              <>
                {/* Patient Info */}
                <div className="glass-effect p-6 rounded-2xl border-2 border-white/30">
                  <h3 className="text-2xl font-bold mb-4">{selectedPatient.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Edad</p>
                      <p className="text-lg font-bold">{selectedPatient.age} años</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Tipo de Sangre</p>
                      <p className="text-lg font-bold">{selectedPatient.blood_type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Habitación</p>
                      <p className="text-lg font-bold">{selectedPatient.room}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Condición</p>
                      <p className="text-lg font-bold">{selectedPatient.condition}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Alergias</p>
                      <p className="text-lg font-bold">{selectedPatient.allergies || 'Ninguna'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Ingreso</p>
                      <p className="text-lg font-bold">{new Date(selectedPatient.admission_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Vital Signs Trend */}
                {patientDetails?.vitals.length > 0 && (
                  <div className="glass-effect p-6 rounded-2xl border-2 border-white/30">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Activity className="mr-2 text-purple-600" size={24} />
                      Tendencia de Signos Vitales
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={vitalTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} name="Temperatura (°C)" />
                        <Line type="monotone" dataKey="heartRate" stroke="#3b82f6" strokeWidth={2} name="Frecuencia Cardíaca" />
                        <Line type="monotone" dataKey="bloodPressure" stroke="#10b981" strokeWidth={2} name="Presión Arterial" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Add Prescription */}
                <div className="glass-effect p-6 rounded-2xl border-2 border-white/30">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Pill className="mr-2 text-emerald-600" size={24} />
                    Nueva Prescripción
                  </h3>
                  <form onSubmit={handleAddPrescription} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Medicamento"
                        value={newPrescription.medicationName}
                        onChange={e => setNewPrescription({...newPrescription, medicationName: e.target.value})}
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Dosis (ej: 500mg)"
                        value={newPrescription.dosage}
                        onChange={e => setNewPrescription({...newPrescription, dosage: e.target.value})}
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Frecuencia (ej: cada 8 horas)"
                        value={newPrescription.frequency}
                        onChange={e => setNewPrescription({...newPrescription, frequency: e.target.value})}
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Duración (ej: 7 días)"
                        value={newPrescription.duration}
                        onChange={e => setNewPrescription({...newPrescription, duration: e.target.value})}
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <textarea
                      placeholder="Instrucciones especiales"
                      value={newPrescription.instructions}
                      onChange={e => setNewPrescription({...newPrescription, instructions: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition"
                    >
                      💊 Agregar Prescripción
                    </button>
                  </form>
                </div>

                {/* Add Diagnosis */}
                <div className="glass-effect p-6 rounded-2xl border-2 border-white/30">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <FileText className="mr-2 text-blue-600" size={24} />
                    Nuevo Diagnóstico
                  </h3>
                  <form onSubmit={handleAddDiagnosis} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Diagnóstico"
                      value={newDiagnosis.diagnosis}
                      onChange={e => setNewDiagnosis({...newDiagnosis, diagnosis: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Tratamiento"
                      value={newDiagnosis.treatment}
                      onChange={e => setNewDiagnosis({...newDiagnosis, treatment: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <textarea
                      placeholder="Notas adicionales"
                      value={newDiagnosis.notes}
                      onChange={e => setNewDiagnosis({...newDiagnosis, notes: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg transition"
                    >
                      📋 Agregar Diagnóstico
                    </button>
                  </form>
                </div>

                {/* Medical History */}
                {patientDetails?.history.length > 0 && (
                  <div className="glass-effect p-6 rounded-2xl border-2 border-white/30">
                    <h3 className="text-xl font-bold mb-4">Historial Médico</h3>
                    <div className="space-y-3">
                      {patientDetails.history.map(record => (
                        <div key={record.id} className="p-4 bg-white/50 rounded-xl">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-bold text-gray-800">{record.diagnosis}</p>
                            <span className="text-xs text-gray-500">{new Date(record.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-gray-700">Tratamiento: {record.treatment}</p>
                          {record.notes && <p className="text-xs text-gray-600 mt-1">{record.notes}</p>}
                          <p className="text-xs text-gray-500 mt-2">Dr. {record.doctor}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="glass-effect p-12 rounded-2xl border-2 border-white/30 text-center">
                <Users className="mx-auto mb-4 text-gray-400" size={64} />
                <p className="text-xl font-semibold text-gray-600">Seleccione un paciente para ver los detalles</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'prescriptions' && (
        <div className="glass-effect p-6 rounded-2xl border-2 border-white/30">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <Pill className="mr-2 text-emerald-600" size={28} />
            Prescripciones Activas
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-50 to-green-50">
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Paciente</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Medicamento</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Dosis</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Frecuencia</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Duración</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Fecha</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((prescription, index) => {
                  const patient = patients.find(p => p.id === prescription.patient_id);
                  return (
                    <tr key={prescription.id} className={`border-b border-gray-100 hover:bg-emerald-50/50 transition ${index % 2 === 0 ? 'bg-white/50' : ''}`}>
                      <td className="px-6 py-4 font-semibold text-gray-800">{patient?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-700">{prescription.medication_name}</td>
                      <td className="px-6 py-4 text-gray-600">{prescription.dosage}</td>
                      <td className="px-6 py-4 text-gray-600">{prescription.frequency}</td>
                      <td className="px-6 py-4 text-gray-600">{prescription.duration}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(prescription.prescribed_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          prescription.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {prescription.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Admissions Trend */}
            <div className="glass-effect p-6 rounded-2xl border-2 border-white/30">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <TrendingUp className="mr-2 text-purple-600" size={24} />
                Ingresos Mensuales
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { month: 'Ene', patients: 45 },
                  { month: 'Feb', patients: 52 },
                  { month: 'Mar', patients: 48 },
                  { month: 'Abr', patients: 61 },
                  { month: 'May', patients: 55 },
                  { month: 'Jun', patients: 67 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="patients" fill="#8b5cf6" name="Pacientes" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Blood Type Distribution */}
            <div className="glass-effect p-6 rounded-2xl border-2 border-white/30">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Activity className="mr-2 text-red-600" size={24} />
                Distribución de Tipos de Sangre
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { type: 'O+', count: patients.filter(p => p.blood_type === 'O+').length },
                  { type: 'A+', count: patients.filter(p => p.blood_type === 'A+').length },
                  { type: 'B+', count: patients.filter(p => p.blood_type === 'B+').length },
                  { type: 'AB+', count: patients.filter(p => p.blood_type === 'AB+').length },
                  { type: 'O-', count: patients.filter(p => p.blood_type === 'O-').length },
                  { type: 'A-', count: patients.filter(p => p.blood_type === 'A-').length }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#ef4444" name="Pacientes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
