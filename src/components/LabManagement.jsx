import React, { useState, useEffect } from 'react';
import {
  TestTube,
  Microscope,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Search,
  Download,
  Printer,
  Filter,
  TrendingUp,
  TrendingDown,
  Activity,
  User,
  Calendar,
  AlertCircle,
  Beaker,
  Droplet,
  Heart,
  Cpu,
  Eye
} from 'lucide-react';

const LabManagement = ({ currentUser }) => {
  const [labTests, setLabTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [showTestForm, setShowTestForm] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTest, setSelectedTest] = useState(null);

  // Mock data - En producción vendría de la base de datos
  useEffect(() => {
    const mockLabTests = [
      {
        id: 1,
        orderId: 'LAB-2025-001',
        patientName: 'María González',
        patientId: 'P-12345',
        age: 45,
        gender: 'Femenino',
        testType: 'Biometría Hemática',
        category: 'Hematología',
        priority: 'Normal',
        status: 'Completado',
        orderedBy: 'Dr. Carlos Méndez',
        orderedDate: '2025-11-19T08:00:00',
        sampleCollected: '2025-11-19T08:30:00',
        resultsReady: '2025-11-19T14:00:00',
        reviewedBy: 'Lab. Ana Torres',
        results: {
          hemoglobina: { value: 13.5, unit: 'g/dL', range: '12-16', status: 'normal' },
          leucocitos: { value: 7.2, unit: 'x10³/μL', range: '4.5-11', status: 'normal' },
          plaquetas: { value: 250, unit: 'x10³/μL', range: '150-400', status: 'normal' },
          hematocrito: { value: 40, unit: '%', range: '36-46', status: 'normal' }
        },
        notes: 'Valores dentro de rangos normales. No se observan anomalías.',
        urgentAlert: false
      },
      {
        id: 2,
        orderId: 'LAB-2025-002',
        patientName: 'Roberto Sánchez',
        patientId: 'P-67890',
        age: 62,
        gender: 'Masculino',
        testType: 'Química Sanguínea',
        category: 'Química Clínica',
        priority: 'Urgente',
        status: 'En Proceso',
        orderedBy: 'Dra. Patricia Ruiz',
        orderedDate: '2025-11-20T09:00:00',
        sampleCollected: '2025-11-20T09:15:00',
        resultsReady: null,
        reviewedBy: null,
        results: null,
        notes: 'Paciente en pre-operatorio. Resultados requeridos antes de cirugía.',
        urgentAlert: true
      },
      {
        id: 3,
        orderId: 'LAB-2025-003',
        patientName: 'Laura Martínez',
        patientId: 'P-11223',
        age: 38,
        gender: 'Femenino',
        testType: 'Glucosa en Ayunas',
        category: 'Química Clínica',
        priority: 'Normal',
        status: 'Completado',
        orderedBy: 'Dr. Eduardo Vargas',
        orderedDate: '2025-11-19T07:00:00',
        sampleCollected: '2025-11-19T07:15:00',
        resultsReady: '2025-11-19T10:00:00',
        reviewedBy: 'Lab. Miguel Castro',
        results: {
          glucosa: { value: 105, unit: 'mg/dL', range: '70-100', status: 'high' }
        },
        notes: 'Glucosa ligeramente elevada. Se recomienda seguimiento.',
        urgentAlert: false
      },
      {
        id: 4,
        orderId: 'LAB-2025-004',
        patientName: 'Jorge Fernández',
        patientId: 'P-44556',
        age: 55,
        gender: 'Masculino',
        testType: 'Perfil Lipídico',
        category: 'Química Clínica',
        priority: 'Normal',
        status: 'Pendiente Muestra',
        orderedBy: 'Dr. Alberto Soto',
        orderedDate: '2025-11-20T10:00:00',
        sampleCollected: null,
        resultsReady: null,
        reviewedBy: null,
        results: null,
        notes: 'Paciente debe presentarse en ayunas.',
        urgentAlert: false
      },
      {
        id: 5,
        orderId: 'LAB-2025-005',
        patientName: 'Carmen Díaz',
        patientId: 'P-77889',
        age: 29,
        gender: 'Femenino',
        testType: 'Examen General de Orina',
        category: 'Urianálisis',
        priority: 'Normal',
        status: 'Completado',
        orderedBy: 'Dra. Isabel Moreno',
        orderedDate: '2025-11-19T11:00:00',
        sampleCollected: '2025-11-19T11:20:00',
        resultsReady: '2025-11-19T15:30:00',
        reviewedBy: 'Lab. Rosa García',
        results: {
          color: { value: 'Amarillo claro', status: 'normal' },
          aspecto: { value: 'Claro', status: 'normal' },
          pH: { value: 6.5, range: '5.0-8.0', status: 'normal' },
          densidad: { value: 1.020, range: '1.005-1.030', status: 'normal' }
        },
        notes: 'Examen de orina sin alteraciones.',
        urgentAlert: false
      },
      {
        id: 6,
        orderId: 'LAB-2025-006',
        patientName: 'Pedro Ramírez',
        patientId: 'P-99000',
        age: 70,
        gender: 'Masculino',
        testType: 'Troponinas Cardíacas',
        category: 'Marcadores Cardíacos',
        priority: 'STAT',
        status: 'Completado',
        orderedBy: 'Dr. Carlos Méndez',
        orderedDate: '2025-11-20T13:00:00',
        sampleCollected: '2025-11-20T13:05:00',
        resultsReady: '2025-11-20T13:45:00',
        reviewedBy: 'Lab. Ana Torres',
        results: {
          troponinaTnI: { value: 0.8, unit: 'ng/mL', range: '<0.04', status: 'critical' }
        },
        notes: 'ALERTA: Troponinas significativamente elevadas. Contactar cardiólogo urgente.',
        urgentAlert: true
      },
      {
        id: 7,
        orderId: 'LAB-2025-007',
        patientName: 'Sofía Vega',
        patientId: 'P-55667',
        age: 33,
        gender: 'Femenino',
        testType: 'Función Hepática',
        category: 'Química Clínica',
        priority: 'Normal',
        status: 'En Análisis',
        orderedBy: 'Dr. Luis Ramírez',
        orderedDate: '2025-11-20T08:30:00',
        sampleCollected: '2025-11-20T09:00:00',
        resultsReady: null,
        reviewedBy: null,
        results: null,
        notes: 'Estudio de rutina. Paciente con antecedentes de hepatitis.',
        urgentAlert: false
      },
      {
        id: 8,
        orderId: 'LAB-2025-008',
        patientName: 'Diego Morales',
        patientId: 'P-22334',
        age: 41,
        gender: 'Masculino',
        testType: 'Cultivo de Garganta',
        category: 'Microbiología',
        priority: 'Normal',
        status: 'En Cultivo',
        orderedBy: 'Dra. Carmen López',
        orderedDate: '2025-11-19T16:00:00',
        sampleCollected: '2025-11-19T16:30:00',
        resultsReady: null,
        reviewedBy: null,
        results: null,
        notes: 'Cultivo en proceso. Resultados esperados en 48-72 horas.',
        urgentAlert: false
      }
    ];

    setLabTests(mockLabTests);
    setFilteredTests(mockLabTests);
  }, []);

  // Filtrado
  useEffect(() => {
    let filtered = labTests;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(test =>
        test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.testType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (filterStatus !== 'all') {
      filtered = filtered.filter(test => test.status === filterStatus);
    }

    // Filtro por tipo/categoría
    if (filterType !== 'all') {
      filtered = filtered.filter(test => test.category === filterType);
    }

    setFilteredTests(filtered);
  }, [searchTerm, filterStatus, filterType, labTests]);

  const testCategories = [
    'Hematología',
    'Química Clínica',
    'Microbiología',
    'Inmunología',
    'Urianálisis',
    'Marcadores Cardíacos',
    'Hormonas',
    'Coagulación'
  ];

  const priorities = ['Normal', 'Urgente', 'STAT'];
  const statuses = [
    'Pendiente Muestra',
    'Muestra Recibida',
    'En Proceso',
    'En Análisis',
    'En Cultivo',
    'Completado',
    'Cancelado'
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Pendiente Muestra': 'bg-gray-100 text-gray-700 border-gray-300',
      'Muestra Recibida': 'bg-blue-100 text-blue-700 border-blue-300',
      'En Proceso': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'En Análisis': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'En Cultivo': 'bg-purple-100 text-purple-700 border-purple-300',
      'Completado': 'bg-green-100 text-green-700 border-green-300',
      'Cancelado': 'bg-red-100 text-red-700 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Normal': 'bg-blue-500 text-white',
      'Urgente': 'bg-orange-500 text-white',
      'STAT': 'bg-red-500 text-white animate-pulse'
    };
    return colors[priority] || 'bg-gray-500 text-white';
  };

  const getResultStatusColor = (status) => {
    const colors = {
      'normal': 'text-green-600',
      'high': 'text-orange-600',
      'low': 'text-orange-600',
      'critical': 'text-red-600 font-bold'
    };
    return colors[status] || 'text-gray-600';
  };

  const getTurnaroundTime = (test) => {
    if (!test.sampleCollected || !test.resultsReady) return null;
    const collected = new Date(test.sampleCollected);
    const ready = new Date(test.resultsReady);
    const diffHours = Math.floor((ready - collected) / 3600000);
    const diffMins = Math.floor(((ready - collected) % 3600000) / 60000);
    return `${diffHours}h ${diffMins}m`;
  };

  const handleSaveTest = (testData) => {
    if (editingTest) {
      setLabTests(labTests.map(t => t.id === editingTest.id ? { ...testData, id: t.id } : t));
    } else {
      setLabTests([...labTests, { ...testData, id: Date.now(), orderId: `LAB-2025-${String(labTests.length + 1).padStart(3, '0')}` }]);
    }
    setShowTestForm(false);
    setEditingTest(null);
  };

  const handleEditTest = (test) => {
    setEditingTest(test);
    setShowTestForm(true);
  };

  const handleDeleteTest = (id) => {
    if (window.confirm('¿Está seguro de eliminar esta prueba?')) {
      setLabTests(labTests.filter(t => t.id !== id));
    }
  };

  const printResult = (test) => {
    alert(`Imprimiendo resultados de ${test.testType} para ${test.patientName}`);
  };

  const downloadResult = (test) => {
    alert(`Descargando resultados en PDF de ${test.testType}`);
  };

  // Estadísticas
  const totalTests = labTests.length;
  const pendingTests = labTests.filter(t => t.status === 'Pendiente Muestra' || t.status === 'Muestra Recibida').length;
  const inProgressTests = labTests.filter(t => t.status === 'En Proceso' || t.status === 'En Análisis' || t.status === 'En Cultivo').length;
  const completedTests = labTests.filter(t => t.status === 'Completado').length;
  const urgentTests = labTests.filter(t => t.priority === 'Urgente' || t.priority === 'STAT').length;
  const criticalResults = labTests.filter(t => t.urgentAlert).length;

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-3">
            <TestTube className="text-blue-600" size={32} />
            Laboratorio Clínico
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestión de pruebas y resultados de laboratorio
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTest(null);
            setShowTestForm(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Nueva Prueba
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <TestTube size={24} className="text-blue-200" />
          </div>
          <p className="text-blue-100 text-xs">Total Pruebas</p>
          <p className="text-2xl font-bold mt-1">{totalTests}</p>
        </div>

        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Clock size={24} className="text-gray-200" />
          </div>
          <p className="text-gray-100 text-xs">Pendientes</p>
          <p className="text-2xl font-bold mt-1">{pendingTests}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-4 text-white shadow-lg animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <Activity size={24} className="text-yellow-200" />
          </div>
          <p className="text-yellow-100 text-xs">En Proceso</p>
          <p className="text-2xl font-bold mt-1">{inProgressTests}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle size={24} className="text-green-200" />
          </div>
          <p className="text-green-100 text-xs">Completadas</p>
          <p className="text-2xl font-bold mt-1">{completedTests}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle size={24} className="text-orange-200" />
          </div>
          <p className="text-orange-100 text-xs">Urgentes</p>
          <p className="text-2xl font-bold mt-1">{urgentTests}</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 text-white shadow-lg animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle size={24} className="text-red-200" />
          </div>
          <p className="text-red-100 text-xs">Críticos</p>
          <p className="text-2xl font-bold mt-1">{criticalResults}</p>
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
              placeholder="Buscar paciente, orden..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          >
            <option value="all">Todos los estados</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          >
            <option value="all">Todas las categorías</option>
            {testCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          />
        </div>
      </div>

      {/* Tests List */}
      <div className="space-y-4">
        {filteredTests.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <TestTube className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 dark:text-gray-400">No se encontraron pruebas</p>
          </div>
        ) : (
          filteredTests.map(test => (
            <div
              key={test.id}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all ${
                test.urgentAlert ? 'border-l-4 border-red-500' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{test.patientName}</h3>
                    <span className="text-sm text-gray-500">({test.patientId})</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(test.priority)}`}>
                      {test.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(test.status)}`}>
                      {test.status}
                    </span>
                    {test.urgentAlert && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white animate-pulse">
                        ⚠️ CRÍTICO
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{test.age} años • {test.gender}</span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-xs">
                      {test.orderId}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {test.status === 'Completado' && (
                    <>
                      <button
                        onClick={() => setSelectedTest(test)}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                        title="Ver resultados"
                      >
                        <Eye size={18} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => printResult(test)}
                        className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors"
                        title="Imprimir"
                      >
                        <Printer size={18} className="text-green-600" />
                      </button>
                      <button
                        onClick={() => downloadResult(test)}
                        className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg transition-colors"
                        title="Descargar PDF"
                      >
                        <Download size={18} className="text-purple-600" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleEditTest(test)}
                    className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={18} className="text-yellow-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteTest(test.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>

              {/* Test Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Tipo de Prueba</p>
                    <p className="text-lg font-bold text-blue-600">{test.testType}</p>
                    <p className="text-xs text-gray-500">{test.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Ordenado por</p>
                    <p className="text-base">{test.orderedBy}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(test.orderedDate).toLocaleString('es-ES')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-2 mb-4 text-sm overflow-x-auto">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${test.orderedDate ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                  <Calendar size={14} />
                  <span>Ordenada</span>
                </div>
                <div className="text-gray-400">→</div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${test.sampleCollected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                  <Droplet size={14} />
                  <span>Muestra</span>
                </div>
                <div className="text-gray-400">→</div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${test.status.includes('Proceso') || test.status.includes('Análisis') ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-400'}`}>
                  <Microscope size={14} />
                  <span>Análisis</span>
                </div>
                <div className="text-gray-400">→</div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${test.resultsReady ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'}`}>
                  <FileText size={14} />
                  <span>Resultados</span>
                </div>
              </div>

              {/* Turnaround Time */}
              {getTurnaroundTime(test) && (
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock size={14} />
                  <span>Tiempo de respuesta: <strong>{getTurnaroundTime(test)}</strong></span>
                </div>
              )}

              {/* Results Preview */}
              {test.results && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Beaker className="text-blue-600" size={16} />
                    Resultados
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(test.results).map(([key, data]) => (
                      <div key={key} className="bg-white dark:bg-gray-800 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className={`text-lg font-bold ${getResultStatusColor(data.status)}`}>
                          {data.value} {data.unit || ''}
                        </p>
                        {data.range && (
                          <p className="text-xs text-gray-500">Ref: {data.range}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  {test.reviewedBy && (
                    <p className="text-xs text-gray-500 mt-3">
                      Revisado por: <strong>{test.reviewedBy}</strong>
                    </p>
                  )}
                </div>
              )}

              {/* Notes */}
              {test.notes && (
                <div className={`p-3 rounded-lg text-sm ${test.urgentAlert ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  <FileText className="inline mr-2" size={14} />
                  {test.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Test Form Modal */}
      {showTestForm && (
        <TestForm
          test={editingTest}
          onSave={handleSaveTest}
          onCancel={() => {
            setShowTestForm(false);
            setEditingTest(null);
          }}
          categories={testCategories}
          priorities={priorities}
          statuses={statuses}
        />
      )}

      {/* Results Detail Modal */}
      {selectedTest && (
        <ResultsDetailModal
          test={selectedTest}
          onClose={() => setSelectedTest(null)}
        />
      )}
    </div>
  );
};

// Test Form Component
const TestForm = ({ test, onSave, onCancel, categories, priorities, statuses }) => {
  const [formData, setFormData] = useState(test || {
    patientName: '',
    patientId: '',
    age: '',
    gender: 'Masculino',
    testType: '',
    category: 'Hematología',
    priority: 'Normal',
    status: 'Pendiente Muestra',
    orderedBy: '',
    orderedDate: new Date().toISOString().slice(0, 16),
    sampleCollected: null,
    resultsReady: null,
    reviewedBy: '',
    results: null,
    notes: '',
    urgentAlert: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full my-8">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TestTube size={24} />
            {test ? 'Editar Prueba' : 'Nueva Prueba de Laboratorio'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Patient Info */}
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ID Paciente *</label>
                <input
                  type="text"
                  required
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Edad *</label>
                <input
                  type="number"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">Género *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              >
                <option>Masculino</option>
                <option>Femenino</option>
                <option>Otro</option>
              </select>
            </div>
          </div>

          {/* Test Details */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TestTube size={18} />
              Detalles de la Prueba
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Prueba *</label>
                <input
                  type="text"
                  required
                  value={formData.testType}
                  onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
                  placeholder="Ej: Biometría Hemática"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Categoría *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                >
                  {statuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h3 className="font-semibold mb-3">Información de Orden</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ordenado por *</label>
                <input
                  type="text"
                  required
                  value={formData.orderedBy}
                  onChange={(e) => setFormData({ ...formData, orderedBy: e.target.value })}
                  placeholder="Dr. Juan Pérez"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fecha de Orden *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.orderedDate}
                  onChange={(e) => setFormData({ ...formData, orderedDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Notes & Alert */}
          <div>
            <label className="block text-sm font-medium mb-1">Notas / Observaciones</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Indicaciones especiales, observaciones..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="urgentAlert"
              checked={formData.urgentAlert}
              onChange={(e) => setFormData({ ...formData, urgentAlert: e.target.checked })}
              className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
            />
            <label htmlFor="urgentAlert" className="font-medium text-red-600">
              Marcar como resultado crítico / alerta urgente
            </label>
          </div>

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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Guardar Prueba
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Results Detail Modal Component
const ResultsDetailModal = ({ test, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText size={24} />
              Resultados de Laboratorio
            </h2>
            <p className="text-blue-100 text-sm mt-1">{test.orderId}</p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Patient Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h3 className="font-semibold mb-3">Información del Paciente</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-medium">{test.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p className="font-medium">{test.patientId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Edad</p>
                <p className="font-medium">{test.age} años</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Género</p>
                <p className="font-medium">{test.gender}</p>
              </div>
            </div>
          </div>

          {/* Test Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <h3 className="font-semibold mb-3">Información de la Prueba</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tipo</p>
                <p className="font-medium">{test.testType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Categoría</p>
                <p className="font-medium">{test.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ordenado por</p>
                <p className="font-medium">{test.orderedBy}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Revisado por</p>
                <p className="font-medium">{test.reviewedBy}</p>
              </div>
            </div>
          </div>

          {/* Results */}
          {test.results && (
            <div>
              <h3 className="font-semibold mb-4 text-lg">Resultados Detallados</h3>
              <div className="space-y-3">
                {Object.entries(test.results).map(([key, data]) => (
                  <div key={key} className="bg-white dark:bg-gray-700 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold capitalize mb-1">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {data.range && `Rango de referencia: ${data.range}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${
                          data.status === 'normal' ? 'text-green-600' :
                          data.status === 'critical' ? 'text-red-600' :
                          'text-orange-600'
                        }`}>
                          {data.value} {data.unit || ''}
                        </p>
                        <p className={`text-xs font-semibold ${
                          data.status === 'normal' ? 'text-green-600' :
                          data.status === 'critical' ? 'text-red-600' :
                          'text-orange-600'
                        }`}>
                          {data.status === 'normal' ? '✓ Normal' :
                           data.status === 'critical' ? '⚠ Crítico' :
                           data.status === 'high' ? '↑ Alto' : '↓ Bajo'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {test.notes && (
            <div className={`rounded-xl p-4 ${
              test.urgentAlert
                ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-300'
                : 'bg-gray-50 dark:bg-gray-700'
            }`}>
              <h3 className="font-semibold mb-2">Observaciones</h3>
              <p className={test.urgentAlert ? 'text-red-700 dark:text-red-300 font-medium' : ''}>
                {test.notes}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h3 className="font-semibold mb-3">Línea de Tiempo</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Orden creada:</span>
                <span className="font-medium">{new Date(test.orderedDate).toLocaleString('es-ES')}</span>
              </div>
              {test.sampleCollected && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Muestra recolectada:</span>
                  <span className="font-medium">{new Date(test.sampleCollected).toLocaleString('es-ES')}</span>
                </div>
              )}
              {test.resultsReady && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Resultados listos:</span>
                  <span className="font-medium">{new Date(test.resultsReady).toLocaleString('es-ES')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabManagement;
