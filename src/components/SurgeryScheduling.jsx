import React, { useState, useEffect } from 'react';
import { 
  Scissors, 
  Calendar,
  Clock,
  Users,
  Activity,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Search,
  Filter,
  User,
  Stethoscope,
  Bed,
  ClipboardCheck,
  FileText,
  Heart,
  Droplet,
  Thermometer
} from 'lucide-react';

const SurgeryScheduling = ({ currentUser }) => {
  const [surgeries, setSurgeries] = useState([]);
  const [filteredSurgeries, setFilteredSurgeries] = useState([]);
  const [operatingRooms, setOperatingRooms] = useState([]);
  const [showSurgeryForm, setShowSurgeryForm] = useState(false);
  const [editingSurgery, setEditingSurgery] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRoom, setFilterRoom] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock data - En producción vendría de la base de datos
  useEffect(() => {
    const mockSurgeries = [
      {
        id: 1,
        patientName: 'María González',
        patientAge: 45,
        surgeon: 'Dr. Carlos Méndez',
        anesthesiologist: 'Dra. Ana Torres',
        assistants: ['Dr. Luis Ramírez', 'Enf. Carmen López'],
        surgeryType: 'Apendicectomía',
        category: 'General',
        room: 'Sala 1',
        date: '2025-11-20',
        startTime: '08:00',
        estimatedDuration: 90,
        status: 'Programada',
        priority: 'Urgente',
        preOpCompleted: true,
        preOpNotes: 'Ayuno 12h. NPO desde medianoche.',
        preOpVitals: {
          bp: '120/80',
          hr: 75,
          temp: 36.8,
          spo2: 98
        },
        allergies: 'Penicilina',
        bloodType: 'O+',
        consent: true,
        equipment: ['Laparoscopio', 'Bisturí eléctrico', 'Monitor'],
        notes: 'Paciente estable. Riesgo quirúrgico ASA II.'
      },
      {
        id: 2,
        patientName: 'Roberto Sánchez',
        patientAge: 62,
        surgeon: 'Dra. Patricia Ruiz',
        anesthesiologist: 'Dr. Manuel Ortiz',
        assistants: ['Dra. Sofia Vega', 'Enf. Juan Pérez'],
        surgeryType: 'Reemplazo de cadera',
        category: 'Ortopedia',
        room: 'Sala 2',
        date: '2025-11-20',
        startTime: '10:30',
        estimatedDuration: 180,
        status: 'En Proceso',
        priority: 'Electiva',
        preOpCompleted: true,
        preOpNotes: 'Radiografías revisadas. Stock de prótesis confirmado.',
        preOpVitals: {
          bp: '135/85',
          hr: 68,
          temp: 36.5,
          spo2: 97
        },
        allergies: 'Ninguna',
        bloodType: 'A+',
        consent: true,
        equipment: ['Prótesis de cadera', 'Taladro ortopédico', 'Fluoroscopio'],
        notes: 'Paciente con diabetes controlada.'
      },
      {
        id: 3,
        patientName: 'Laura Martínez',
        patientAge: 38,
        surgeon: 'Dr. Eduardo Vargas',
        anesthesiologist: 'Dra. Ana Torres',
        assistants: ['Dr. Miguel Castro'],
        surgeryType: 'Cesárea',
        category: 'Ginecología',
        room: 'Sala 3',
        date: '2025-11-20',
        startTime: '14:00',
        estimatedDuration: 60,
        status: 'Completada',
        priority: 'Urgente',
        preOpCompleted: true,
        preOpNotes: 'Embarazo 38 semanas. Cesárea por circular de cordón.',
        preOpVitals: {
          bp: '118/75',
          hr: 82,
          temp: 36.9,
          spo2: 99
        },
        allergies: 'Látex',
        bloodType: 'B+',
        consent: true,
        equipment: ['Set obstétrico', 'Incubadora neonatal', 'Monitor fetal'],
        notes: 'Bebé saludable. Peso 3.2kg. APGAR 9/10.',
        postOpNotes: 'Evolución favorable. Alta en 48h.'
      },
      {
        id: 4,
        patientName: 'Jorge Fernández',
        patientAge: 55,
        surgeon: 'Dr. Alberto Soto',
        anesthesiologist: 'Dr. Manuel Ortiz',
        assistants: ['Dra. Isabel Moreno', 'Enf. Rosa García'],
        surgeryType: 'Bypass coronario',
        category: 'Cardiovascular',
        room: 'Sala 1',
        date: '2025-11-21',
        startTime: '07:00',
        estimatedDuration: 300,
        status: 'Programada',
        priority: 'Urgente',
        preOpCompleted: false,
        preOpNotes: 'Pendiente preparación. Exámenes pre-op programados.',
        preOpVitals: null,
        allergies: 'Yodo',
        bloodType: 'AB+',
        consent: false,
        equipment: ['Circulación extracorpórea', 'Injertos vasculares', 'Monitor cardíaco'],
        notes: 'Reservar UCI post-operatorio. Solicitar 4 unidades sangre tipo AB+.'
      },
      {
        id: 5,
        patientName: 'Carmen Díaz',
        patientAge: 29,
        surgeon: 'Dra. Patricia Ruiz',
        anesthesiologist: 'Dra. Ana Torres',
        assistants: ['Dr. Luis Ramírez'],
        surgeryType: 'Artroscopia de rodilla',
        category: 'Ortopedia',
        room: 'Sala 2',
        date: '2025-11-21',
        startTime: '09:00',
        estimatedDuration: 120,
        status: 'Programada',
        priority: 'Electiva',
        preOpCompleted: true,
        preOpNotes: 'Resonancia magnética revisada. Lesión de menisco confirmada.',
        preOpVitals: {
          bp: '115/70',
          hr: 70,
          temp: 36.7,
          spo2: 99
        },
        allergies: 'Ninguna',
        bloodType: 'O-',
        consent: true,
        equipment: ['Artroscopio', 'Instrumental de meniscectomía', 'Monitor HD'],
        notes: 'Atleta profesional. Rehabilitación programada.'
      }
    ];

    const mockRooms = [
      { id: 1, name: 'Sala 1', status: 'Ocupada', currentSurgery: 'Bypass coronario', nextAvailable: '15:00' },
      { id: 2, name: 'Sala 2', status: 'En Proceso', currentSurgery: 'Reemplazo de cadera', nextAvailable: '13:30' },
      { id: 3, name: 'Sala 3', status: 'Disponible', currentSurgery: null, nextAvailable: 'Ahora' },
      { id: 4, name: 'Sala 4', status: 'Mantenimiento', currentSurgery: null, nextAvailable: 'Mañana' }
    ];

    setSurgeries(mockSurgeries);
    setFilteredSurgeries(mockSurgeries);
    setOperatingRooms(mockRooms);
  }, []);

  // Filtrado
  useEffect(() => {
    let filtered = surgeries;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(surgery =>
        surgery.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surgery.surgeon.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surgery.surgeryType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (filterStatus !== 'all') {
      filtered = filtered.filter(surgery => surgery.status === filterStatus);
    }

    // Filtro por sala
    if (filterRoom !== 'all') {
      filtered = filtered.filter(surgery => surgery.room === filterRoom);
    }

    // Filtro por fecha
    if (selectedDate) {
      filtered = filtered.filter(surgery => surgery.date === selectedDate);
    }

    setFilteredSurgeries(filtered);
  }, [searchTerm, filterStatus, filterRoom, selectedDate, surgeries]);

  const surgeryCategories = [
    'General',
    'Cardiovascular',
    'Ortopedia',
    'Neurocirugía',
    'Ginecología',
    'Urología',
    'Oftalmología',
    'ORL',
    'Plástica',
    'Pediátrica'
  ];

  const priorities = ['Emergencia', 'Urgente', 'Electiva'];
  const statuses = ['Programada', 'En Proceso', 'Completada', 'Cancelada', 'Pospuesta'];

  const getStatusColor = (status) => {
    const colors = {
      'Programada': 'bg-blue-100 text-blue-700 border-blue-300',
      'En Proceso': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'Completada': 'bg-green-100 text-green-700 border-green-300',
      'Cancelada': 'bg-red-100 text-red-700 border-red-300',
      'Pospuesta': 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Emergencia': 'bg-red-500 text-white',
      'Urgente': 'bg-orange-500 text-white',
      'Electiva': 'bg-blue-500 text-white'
    };
    return colors[priority] || 'bg-gray-500 text-white';
  };

  const getRoomStatusColor = (status) => {
    const colors = {
      'Disponible': 'bg-green-100 text-green-700 border-green-300',
      'Ocupada': 'bg-red-100 text-red-700 border-red-300',
      'En Proceso': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'Mantenimiento': 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const handleSaveSurgery = (surgeryData) => {
    if (editingSurgery) {
      setSurgeries(surgeries.map(s => s.id === editingSurgery.id ? { ...surgeryData, id: s.id } : s));
    } else {
      setSurgeries([...surgeries, { ...surgeryData, id: Date.now() }]);
    }
    setShowSurgeryForm(false);
    setEditingSurgery(null);
  };

  const handleEditSurgery = (surgery) => {
    setEditingSurgery(surgery);
    setShowSurgeryForm(true);
  };

  const handleDeleteSurgery = (id) => {
    if (window.confirm('¿Está seguro de eliminar esta cirugía?')) {
      setSurgeries(surgeries.filter(s => s.id !== id));
    }
  };

  // Estadísticas
  const todaySurgeries = surgeries.filter(s => s.date === new Date().toISOString().split('T')[0]);
  const inProgress = surgeries.filter(s => s.status === 'En Proceso').length;
  const scheduled = surgeries.filter(s => s.status === 'Programada').length;
  const completed = surgeries.filter(s => s.status === 'Completada').length;

  return (
    <div className="p-8 space-y-8 animate-fadeIn min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-4 border-purple-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white flex items-center gap-4">
              <div className="bg-white/20 p-5 rounded-2xl backdrop-blur-xl">
                <Scissors className="text-white" size={64} />
              </div>
              Programación de Cirugías
            </h1>
            <p className="text-purple-100 mt-4 text-2xl font-medium">
              🏥 Gestión de quirófanos y procedimientos quirúrgicos
            </p>
          </div>
          <button
            onClick={() => {
              setEditingSurgery(null);
              setShowSurgeryForm(true);
            }}
            className="bg-white text-purple-600 px-8 py-5 rounded-2xl hover:shadow-2xl transition-all flex items-center gap-3 text-xl font-bold hover:scale-105"
          >
            <Plus size={28} />
            Nueva Cirugía
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl p-8 text-white shadow-[0_20px_60px_-15px_rgba(59,130,246,0.5)] hover:shadow-[0_25px_70px_-15px_rgba(59,130,246,0.6)] transition-all hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-lg font-medium">Cirugías Hoy</p>
              <p className="text-5xl font-bold mt-3">{todaySurgeries.length}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl">
              <Calendar className="text-white" size={48} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 rounded-3xl p-8 text-white shadow-[0_20px_60px_-15px_rgba(234,179,8,0.5)] hover:shadow-[0_25px_70px_-15px_rgba(234,179,8,0.6)] transition-all hover:scale-105 animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-lg font-medium">En Proceso</p>
              <p className="text-5xl font-bold mt-3">{inProgress}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl">
              <Activity className="text-white" size={48} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-3xl p-8 text-white shadow-[0_20px_60px_-15px_rgba(168,85,247,0.5)] hover:shadow-[0_25px_70px_-15px_rgba(168,85,247,0.6)] transition-all hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-lg font-medium">Programadas</p>
              <p className="text-5xl font-bold mt-3">{scheduled}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl">
              <Clock className="text-white" size={48} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-3xl p-8 text-white shadow-[0_20px_60px_-15px_rgba(34,197,94,0.5)] hover:shadow-[0_25px_70px_-15px_rgba(34,197,94,0.6)] transition-all hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-lg font-medium">Completadas</p>
              <p className="text-5xl font-bold mt-3">{completed}</p>
            </div>
            <Check className="text-green-200" size={40} />
          </div>
        </div>
      </div>

      {/* Operating Rooms Status */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Bed className="text-purple-600" />
          Estado de Quirófanos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {operatingRooms.map(room => (
            <div 
              key={room.id}
              className={`${getRoomStatusColor(room.status)} border-2 rounded-xl p-4`}
            >
              <p className="font-bold text-lg">{room.name}</p>
              <p className="text-sm mt-1">{room.status}</p>
              {room.currentSurgery && (
                <p className="text-xs mt-2 opacity-80">{room.currentSurgery}</p>
              )}
              <p className="text-xs mt-2 font-semibold">
                Disponible: {room.nextAvailable}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar paciente, cirujano..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
            />
          </div>

          {/* Date Filter */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
          />

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
          >
            <option value="all">Todos los estados</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          {/* Room Filter */}
          <select
            value={filterRoom}
            onChange={(e) => setFilterRoom(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
          >
            <option value="all">Todas las salas</option>
            {operatingRooms.map(room => (
              <option key={room.id} value={room.name}>{room.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Surgeries List */}
      <div className="space-y-4">
        {filteredSurgeries.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <Scissors className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 dark:text-gray-400">No se encontraron cirugías</p>
          </div>
        ) : (
          filteredSurgeries.map(surgery => (
            <div 
              key={surgery.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{surgery.patientName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(surgery.priority)}`}>
                      {surgery.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(surgery.status)}`}>
                      {surgery.status}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg font-semibold">{surgery.surgeryType}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {surgery.category} • {surgery.patientAge} años • {surgery.bloodType}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditSurgery(surgery)}
                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={18} className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteSurgery(surgery.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="text-purple-600" size={16} />
                  <span>{new Date(surgery.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="text-blue-600" size={16} />
                  <span>{surgery.startTime} ({surgery.estimatedDuration} min)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Bed className="text-green-600" size={16} />
                  <span>{surgery.room}</span>
                </div>
              </div>

              {/* Surgical Team */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="text-purple-600" size={16} />
                  Equipo Quirúrgico
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="text-blue-600" size={14} />
                    <span><strong>Cirujano:</strong> {surgery.surgeon}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="text-red-600" size={14} />
                    <span><strong>Anestesiólogo:</strong> {surgery.anesthesiologist}</span>
                  </div>
                  <div className="col-span-2">
                    <strong>Asistentes:</strong> {surgery.assistants.join(', ')}
                  </div>
                </div>
              </div>

              {/* Pre-Op Status */}
              {surgery.preOpCompleted && surgery.preOpVitals && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <ClipboardCheck className="text-blue-600" size={16} />
                    Pre-Operatorio
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-2">
                    <div className="flex items-center gap-1">
                      <Droplet className="text-red-500" size={14} />
                      <span>{surgery.preOpVitals.bp}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="text-pink-500" size={14} />
                      <span>{surgery.preOpVitals.hr} bpm</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Thermometer className="text-orange-500" size={14} />
                      <span>{surgery.preOpVitals.temp}°C</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="text-blue-500" size={14} />
                      <span>{surgery.preOpVitals.spo2}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{surgery.preOpNotes}</p>
                </div>
              )}

              {/* Additional Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                {surgery.allergies !== 'Ninguna' && (
                  <div className="flex items-center gap-1">
                    <AlertCircle className="text-red-500" size={14} />
                    <span><strong>Alergias:</strong> {surgery.allergies}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Check className={surgery.consent ? 'text-green-500' : 'text-red-500'} size={14} />
                  <span>Consentimiento: {surgery.consent ? 'Firmado' : 'Pendiente'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClipboardCheck className={surgery.preOpCompleted ? 'text-green-500' : 'text-yellow-500'} size={14} />
                  <span>Pre-Op: {surgery.preOpCompleted ? 'Completo' : 'Pendiente'}</span>
                </div>
              </div>

              {/* Equipment */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  <strong>Equipo:</strong> {surgery.equipment.join(', ')}
                </p>
              </div>

              {/* Notes */}
              {surgery.notes && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <FileText className="inline mr-1" size={14} />
                    {surgery.notes}
                  </p>
                </div>
              )}

              {/* Post-Op Notes */}
              {surgery.postOpNotes && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 bg-green-50 dark:bg-green-900/20 -m-6 mt-3 p-4 rounded-b-2xl">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    <strong>Post-Operatorio:</strong> {surgery.postOpNotes}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Surgery Form Modal */}
      {showSurgeryForm && (
        <SurgeryForm
          surgery={editingSurgery}
          onSave={handleSaveSurgery}
          onCancel={() => {
            setShowSurgeryForm(false);
            setEditingSurgery(null);
          }}
          categories={surgeryCategories}
          priorities={priorities}
          statuses={statuses}
          rooms={operatingRooms}
        />
      )}
    </div>
  );
};

// Surgery Form Component
const SurgeryForm = ({ surgery, onSave, onCancel, categories, priorities, statuses, rooms }) => {
  const [formData, setFormData] = useState(surgery || {
    patientName: '',
    patientAge: '',
    surgeon: '',
    anesthesiologist: '',
    assistants: [],
    surgeryType: '',
    category: 'General',
    room: 'Sala 1',
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    estimatedDuration: 60,
    status: 'Programada',
    priority: 'Electiva',
    preOpCompleted: false,
    preOpNotes: '',
    preOpVitals: { bp: '', hr: '', temp: '', spo2: '' },
    allergies: 'Ninguna',
    bloodType: 'O+',
    consent: false,
    equipment: [],
    notes: '',
    postOpNotes: ''
  });

  const [assistantInput, setAssistantInput] = useState('');
  const [equipmentInput, setEquipmentInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const addAssistant = () => {
    if (assistantInput.trim()) {
      setFormData({
        ...formData,
        assistants: [...formData.assistants, assistantInput.trim()]
      });
      setAssistantInput('');
    }
  };

  const removeAssistant = (index) => {
    setFormData({
      ...formData,
      assistants: formData.assistants.filter((_, i) => i !== index)
    });
  };

  const addEquipment = () => {
    if (equipmentInput.trim()) {
      setFormData({
        ...formData,
        equipment: [...formData.equipment, equipmentInput.trim()]
      });
      setEquipmentInput('');
    }
  };

  const removeEquipment = (index) => {
    setFormData({
      ...formData,
      equipment: formData.equipment.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Scissors size={24} />
            {surgery ? 'Editar Cirugía' : 'Nueva Cirugía'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Patient Information */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User size={18} />
              Información del Paciente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre del Paciente *</label>
                <input
                  type="text"
                  required
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Edad *</label>
                <input
                  type="number"
                  required
                  value={formData.patientAge}
                  onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Sangre *</label>
                <select
                  value={formData.bloodType}
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
                >
                  <option>O+</option>
                  <option>O-</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">Alergias</label>
              <input
                type="text"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="Ninguna, Penicilina, Látex..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
              />
            </div>
          </div>

          {/* Surgery Details */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Scissors size={18} />
              Detalles de la Cirugía
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Cirugía *</label>
                <input
                  type="text"
                  required
                  value={formData.surgeryType}
                  onChange={(e) => setFormData({ ...formData, surgeryType: e.target.value })}
                  placeholder="Ej: Apendicectomía"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Categoría *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prioridad *</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
                >
                  {priorities.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estado *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
                >
                  {statuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fecha *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hora de Inicio *</label>
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duración Estimada (min) *</label>
                <input
                  type="number"
                  required
                  value={formData.estimatedDuration}
                  onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quirófano *</label>
                <select
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
                >
                  {rooms.map(room => (
                    <option key={room.id} value={room.name}>{room.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Surgical Team */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users size={18} />
              Equipo Quirúrgico
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium mb-1">Cirujano *</label>
                <input
                  type="text"
                  required
                  value={formData.surgeon}
                  onChange={(e) => setFormData({ ...formData, surgeon: e.target.value })}
                  placeholder="Dr. Juan Pérez"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Anestesiólogo *</label>
                <input
                  type="text"
                  required
                  value={formData.anesthesiologist}
                  onChange={(e) => setFormData({ ...formData, anesthesiologist: e.target.value })}
                  placeholder="Dra. María López"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Asistentes</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAssistant())}
                  placeholder="Nombre del asistente"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
                />
                <button
                  type="button"
                  onClick={addAssistant}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.assistants.map((assistant, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {assistant}
                    <button
                      type="button"
                      onClick={() => removeAssistant(index)}
                      className="hover:text-purple-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Equipment */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h3 className="font-semibold mb-3">Equipo y Material</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={equipmentInput}
                onChange={(e) => setEquipmentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipment())}
                placeholder="Ej: Laparoscopio, Bisturí eléctrico..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
              />
              <button
                type="button"
                onClick={addEquipment}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.equipment.map((item, index) => (
                <span
                  key={index}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeEquipment(index)}
                    className="hover:text-blue-900"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Pre-Op and Consent */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <ClipboardCheck size={18} />
              Pre-Operatorio
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="preOpCompleted"
                  checked={formData.preOpCompleted}
                  onChange={(e) => setFormData({ ...formData, preOpCompleted: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                />
                <label htmlFor="preOpCompleted" className="font-medium">Pre-operatorio completado</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="consent"
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                />
                <label htmlFor="consent" className="font-medium">Consentimiento informado firmado</label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notas Pre-Operatorias</label>
                <textarea
                  value={formData.preOpNotes}
                  onChange={(e) => setFormData({ ...formData, preOpNotes: e.target.value })}
                  placeholder="Ayuno, preparación, exámenes previos..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1">Notas Adicionales</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Observaciones, riesgos, consideraciones especiales..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
            />
          </div>

          {/* Post-Op Notes (if completed) */}
          {formData.status === 'Completada' && (
            <div>
              <label className="block text-sm font-medium mb-1">Notas Post-Operatorias</label>
              <textarea
                value={formData.postOpNotes}
                onChange={(e) => setFormData({ ...formData, postOpNotes: e.target.value })}
                placeholder="Evolución, complicaciones, indicaciones..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <X size={20} />
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Guardar Cirugía
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurgeryScheduling;
