import { useState, useEffect } from 'react';
import { AlertCircle, Clock, User, Activity, TrendingUp, Heart, Thermometer, Droplet, Plus, Edit2, X, Check, Search } from 'lucide-react';
import { useEmergency } from '../hooks/useAdvancedDatabase';

export default function EmergencyRoom({ currentUser }) {
  const [showModal, setShowModal] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { emergencyCases, activeCases, loading, createCase, updateCase, deleteCase } = useEmergency();

  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: 'Masculino',
    chiefComplaint: '',
    priority: 'Amarillo',
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      oxygenSaturation: '',
      respiratoryRate: ''
    },
    allergies: '',
    currentMedications: '',
    triageNotes: '',
    assignedDoctor: '',
    assignedNurse: '',
    bedNumber: '',
    status: 'Esperando'
  });

  const priorities = {
    'Rojo': { label: 'Crítico', color: 'bg-red-500', textColor: 'text-red-700', bgLight: 'bg-red-50', level: 1 },
    'Naranja': { label: 'Urgente', color: 'bg-orange-500', textColor: 'text-orange-700', bgLight: 'bg-orange-50', level: 2 },
    'Amarillo': { label: 'Semi-urgente', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgLight: 'bg-yellow-50', level: 3 },
    'Verde': { label: 'Menor', color: 'bg-green-500', textColor: 'text-green-700', bgLight: 'bg-green-50', level: 4 },
    'Azul': { label: 'No urgente', color: 'bg-blue-500', textColor: 'text-blue-700', bgLight: 'bg-blue-50', level: 5 }
  };

  const statuses = ['Esperando', 'En Evaluación', 'En Tratamiento', 'Observación', 'Alta', 'Transferido', 'Fallecido'];

  const getWaitTime = (timestamp) => {
    const now = new Date();
    const arrival = new Date(timestamp);
    const diffMinutes = Math.floor((now - arrival) / 60000);
    
    if (diffMinutes < 60) return `${diffMinutes} min`;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const sortedCases = [...(filterPriority === 'all' ? activeCases : activeCases.filter(c => c.priority === filterPriority))]
    .filter(c => !searchQuery || c.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) || c.chiefComplaint?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const priorityDiff = priorities[a.priority].level - priorities[b.priority].level;
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.arrivalTime) - new Date(b.arrivalTime);
    });

  const stats = {
    total: activeCases.length,
    critical: activeCases.filter(c => c.priority === 'Rojo').length,
    urgent: activeCases.filter(c => c.priority === 'Naranja').length,
    waiting: activeCases.filter(c => c.status === 'Esperando').length
  };

  const handleSaveCase = async () => {
    try {
      const caseData = {
        ...formData,
        arrivalTime: editingCase ? editingCase.arrivalTime : new Date().toISOString(),
        triageBy: currentUser?.id,
        vitalSigns: JSON.stringify(formData.vitalSigns)
      };

      if (editingCase) {
        await updateCase(editingCase.id, caseData);
      } else {
        await createCase(caseData);
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving case:', error);
    }
  };

  const handleEditCase = (caseItem) => {
    setEditingCase(caseItem);
    setFormData({
      patientName: caseItem.patientName || '',
      age: caseItem.age || '',
      gender: caseItem.gender || 'Masculino',
      chiefComplaint: caseItem.chiefComplaint || '',
      priority: caseItem.priority || 'Amarillo',
      vitalSigns: typeof caseItem.vitalSigns === 'string' ? JSON.parse(caseItem.vitalSigns) : caseItem.vitalSigns || {},
      allergies: caseItem.allergies || '',
      currentMedications: caseItem.currentMedications || '',
      triageNotes: caseItem.triageNotes || '',
      assignedDoctor: caseItem.assignedDoctor || '',
      assignedNurse: caseItem.assignedNurse || '',
      bedNumber: caseItem.bedNumber || '',
      status: caseItem.status || 'Esperando'
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingCase(null);
    setFormData({
      patientName: '',
      age: '',
      gender: 'Masculino',
      chiefComplaint: '',
      priority: 'Amarillo',
      vitalSigns: {
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        oxygenSaturation: '',
        respiratoryRate: ''
      },
      allergies: '',
      currentMedications: '',
      triageNotes: '',
      assignedDoctor: '',
      assignedNurse: '',
      bedNumber: '',
      status: 'Esperando'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-100 dark:from-gray-900 dark:via-red-900/20 dark:to-orange-900/20 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-red-600 via-orange-600 to-red-700 rounded-3xl p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-4 border-red-200">
          <h1 className="text-5xl md:text-6xl font-bold text-white flex items-center gap-4">
            <div className="bg-white/20 p-5 rounded-2xl backdrop-blur-xl animate-pulse">
              <AlertCircle className="w-16 h-16 text-white" />
            </div>
            Sala de Emergencias
          </h1>
          <p className="text-red-100 mt-4 text-2xl font-medium">
            🚨 Sistema de Triage y Gestión de Emergencias
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Activos</p>
                <p className="text-4xl font-bold mt-2">{stats.total}</p>
              </div>
              <Activity className="w-12 h-12 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-6 shadow-xl animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Críticos</p>
                <p className="text-4xl font-bold mt-2">{stats.critical}</p>
              </div>
              <Heart className="w-12 h-12 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Urgentes</p>
                <p className="text-4xl font-bold mt-2">{stats.urgent}</p>
              </div>
              <TrendingUp className="w-12 h-12 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">En Espera</p>
                <p className="text-4xl font-bold mt-2">{stats.waiting}</p>
              </div>
              <Clock className="w-12 h-12 opacity-50" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
          {/* Controls */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar paciente o síntoma..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                />
              </div>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Todas las prioridades</option>
                {Object.entries(priorities).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Nuevo Caso
              </button>
            </div>
          </div>

          {/* Cases List */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            ) : sortedCases.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No hay casos activos</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {sortedCases.map(caseItem => {
                  const priority = priorities[caseItem.priority];
                  return (
                    <div
                      key={caseItem.id}
                      className={`${priority.bgLight} dark:bg-gray-900/50 border-2 border-${caseItem.priority.toLowerCase()}-200 dark:border-${caseItem.priority.toLowerCase()}-800 rounded-xl p-5 hover:shadow-xl transition-all cursor-pointer`}
                      onClick={() => handleEditCase(caseItem)}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 ${priority.color} text-white rounded-full text-xs font-bold uppercase`}>
                              {priority.label}
                            </span>
                            <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                              {caseItem.status}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {caseItem.patientName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {caseItem.age} años • {caseItem.gender}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="font-semibold">{getWaitTime(caseItem.arrivalTime)}</span>
                          </div>
                          {caseItem.bedNumber && (
                            <p className="text-xs text-gray-500 dark:text-gray-500">Cama {caseItem.bedNumber}</p>
                          )}
                        </div>
                      </div>

                      {/* Chief Complaint */}
                      <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Motivo de Consulta:</p>
                        <p className="text-gray-900 dark:text-white">{caseItem.chiefComplaint}</p>
                      </div>

                      {/* Vital Signs */}
                      {caseItem.vitalSigns && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                          {(() => {
                            const vitals = typeof caseItem.vitalSigns === 'string' 
                              ? JSON.parse(caseItem.vitalSigns) 
                              : caseItem.vitalSigns;
                            
                            return (
                              <>
                                {vitals.bloodPressure && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Droplet className="w-4 h-4 text-red-500" />
                                    <span className="text-gray-700 dark:text-gray-300">{vitals.bloodPressure}</span>
                                  </div>
                                )}
                                {vitals.heartRate && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Heart className="w-4 h-4 text-pink-500" />
                                    <span className="text-gray-700 dark:text-gray-300">{vitals.heartRate} bpm</span>
                                  </div>
                                )}
                                {vitals.temperature && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Thermometer className="w-4 h-4 text-orange-500" />
                                    <span className="text-gray-700 dark:text-gray-300">{vitals.temperature}°C</span>
                                  </div>
                                )}
                                {vitals.oxygenSaturation && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Activity className="w-4 h-4 text-blue-500" />
                                    <span className="text-gray-700 dark:text-gray-300">{vitals.oxygenSaturation}%</span>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      )}

                      {/* Assignment */}
                      <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                        {caseItem.assignedDoctor && (
                          <p>👨‍⚕️ Dr. {caseItem.assignedDoctor}</p>
                        )}
                        {caseItem.assignedNurse && (
                          <p>👨‍⚕️ Enf. {caseItem.assignedNurse}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingCase ? 'Actualizar Caso' : 'Nuevo Caso de Emergencia'}
                </h3>
                <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Patient Info */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Información del Paciente</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={formData.patientName}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Edad *
                      </label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Género *
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                      >
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Triage */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Triage</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Prioridad *
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                      >
                        {Object.entries(priorities).map(([key, val]) => (
                          <option key={key} value={key}>{val.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Estado *
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Motivo de Consulta *
                      </label>
                      <textarea
                        value={formData.chiefComplaint}
                        onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Vital Signs */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Signos Vitales</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Presión Arterial
                      </label>
                      <input
                        type="text"
                        placeholder="120/80"
                        value={formData.vitalSigns.bloodPressure}
                        onChange={(e) => setFormData({ ...formData, vitalSigns: { ...formData.vitalSigns, bloodPressure: e.target.value } })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Frecuencia Cardíaca
                      </label>
                      <input
                        type="text"
                        placeholder="80"
                        value={formData.vitalSigns.heartRate}
                        onChange={(e) => setFormData({ ...formData, vitalSigns: { ...formData.vitalSigns, heartRate: e.target.value } })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Temperatura (°C)
                      </label>
                      <input
                        type="text"
                        placeholder="36.5"
                        value={formData.vitalSigns.temperature}
                        onChange={(e) => setFormData({ ...formData, vitalSigns: { ...formData.vitalSigns, temperature: e.target.value } })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Saturación O₂ (%)
                      </label>
                      <input
                        type="text"
                        placeholder="98"
                        value={formData.vitalSigns.oxygenSaturation}
                        onChange={(e) => setFormData({ ...formData, vitalSigns: { ...formData.vitalSigns, oxygenSaturation: e.target.value } })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Frecuencia Respiratoria
                      </label>
                      <input
                        type="text"
                        placeholder="16"
                        value={formData.vitalSigns.respiratoryRate}
                        onChange={(e) => setFormData({ ...formData, vitalSigns: { ...formData.vitalSigns, respiratoryRate: e.target.value } })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Información Adicional</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Alergias
                      </label>
                      <input
                        type="text"
                        placeholder="Penicilina, polen, etc."
                        value={formData.allergies}
                        onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Medicamentos Actuales
                      </label>
                      <input
                        type="text"
                        placeholder="Aspirina, insulina, etc."
                        value={formData.currentMedications}
                        onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Notas de Triage
                      </label>
                      <textarea
                        value={formData.triageNotes}
                        onChange={(e) => setFormData({ ...formData, triageNotes: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 resize-none"
                        placeholder="Observaciones adicionales..."
                      />
                    </div>
                  </div>
                </div>

                {/* Assignment */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Asignación</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Doctor Asignado
                      </label>
                      <input
                        type="text"
                        value={formData.assignedDoctor}
                        onChange={(e) => setFormData({ ...formData, assignedDoctor: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Enfermero Asignado
                      </label>
                      <input
                        type="text"
                        value={formData.assignedNurse}
                        onChange={(e) => setFormData({ ...formData, assignedNurse: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Número de Cama
                      </label>
                      <input
                        type="text"
                        value={formData.bedNumber}
                        onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveCase}
                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    {editingCase ? 'Actualizar' : 'Guardar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
