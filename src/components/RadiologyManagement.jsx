import React, { useState, useEffect } from 'react';
import {
  Scan,
  Image as ImageIcon,
  FileText,
  Calendar,
  User,
  Activity,
  Eye,
  Download,
  Printer,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize,
  Stethoscope,
  Brain,
  Bone,
  Heart,
  Cpu,
  Microscope
} from 'lucide-react';

const RadiologyManagement = ({ currentUser }) => {
  const [radiologyStudies, setRadiologyStudies] = useState([]);
  const [filteredStudies, setFilteredStudies] = useState([]);
  const [showStudyForm, setShowStudyForm] = useState(false);
  const [editingStudy, setEditingStudy] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterModality, setFilterModality] = useState('all');
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [imageZoom, setImageZoom] = useState(100);
  const [imageRotation, setImageRotation] = useState(0);

  // Mock data - En producción vendría de PACS/base de datos
  useEffect(() => {
    const mockStudies = [
      {
        id: 1,
        studyId: 'RX-2025-001',
        patientName: 'María González',
        patientId: 'P-12345',
        age: 45,
        gender: 'Femenino',
        studyType: 'Radiografía de Tórax',
        modality: 'RX',
        bodyPart: 'Tórax',
        laterality: 'Bilateral',
        views: ['PA', 'Lateral'],
        priority: 'Normal',
        status: 'Reportado',
        orderedBy: 'Dr. Carlos Méndez',
        orderedDate: '2025-11-19T08:00:00',
        scheduledDate: '2025-11-19T10:00:00',
        performedDate: '2025-11-19T10:15:00',
        reportedDate: '2025-11-19T14:00:00',
        technician: 'Tec. Juan Pérez',
        radiologist: 'Rad. Dra. Ana Torres',
        findings: 'Campos pulmonares limpios. Silueta cardíaca normal. No se observan infiltrados ni consolidaciones. Sin evidencia de derrame pleural.',
        impression: 'Radiografía de tórax normal.',
        recommendations: 'No requiere seguimiento radiológico inmediato.',
        imageCount: 2,
        imageUrl: '/images/chest-xray-sample.jpg',
        contrast: false,
        radiation: '0.02 mSv',
        urgentAlert: false
      },
      {
        id: 2,
        studyId: 'TC-2025-001',
        patientName: 'Roberto Sánchez',
        patientId: 'P-67890',
        age: 62,
        gender: 'Masculino',
        studyType: 'TC Cráneo Simple',
        modality: 'TC',
        bodyPart: 'Cráneo',
        laterality: 'N/A',
        views: ['Axial', 'Coronal', 'Sagital'],
        priority: 'Urgente',
        status: 'En Proceso',
        orderedBy: 'Dra. Patricia Ruiz',
        orderedDate: '2025-11-20T09:00:00',
        scheduledDate: '2025-11-20T11:00:00',
        performedDate: '2025-11-20T11:30:00',
        reportedDate: null,
        technician: 'Tec. Carmen López',
        radiologist: 'Rad. Dr. Eduardo Vargas',
        findings: null,
        impression: null,
        recommendations: null,
        imageCount: 45,
        imageUrl: '/images/ct-scan-sample.jpg',
        contrast: false,
        radiation: '2.0 mSv',
        urgentAlert: true
      },
      {
        id: 3,
        studyId: 'RM-2025-001',
        patientName: 'Laura Martínez',
        patientId: 'P-11223',
        age: 38,
        gender: 'Femenino',
        studyType: 'RM Columna Lumbar',
        modality: 'RM',
        bodyPart: 'Columna Lumbar',
        laterality: 'N/A',
        views: ['Sagital T1', 'Sagital T2', 'Axial T2'],
        priority: 'Normal',
        status: 'Reportado',
        orderedBy: 'Dr. Alberto Soto',
        orderedDate: '2025-11-18T14:00:00',
        scheduledDate: '2025-11-19T09:00:00',
        performedDate: '2025-11-19T09:45:00',
        reportedDate: '2025-11-19T16:00:00',
        technician: 'Tec. Rosa García',
        radiologist: 'Rad. Dr. Miguel Castro',
        findings: 'Disminución del espacio discal L4-L5. Protrusión discal central posterior que contacta con el saco dural sin compresión medular significativa. Artropatía facetaria bilateral L4-L5.',
        impression: 'Enfermedad degenerativa discal L4-L5 con protrusión discal central.',
        recommendations: 'Correlación clínica. Considerar manejo conservador o evaluación por neurocirugía según sintomatología.',
        imageCount: 120,
        imageUrl: '/images/mri-spine-sample.jpg',
        contrast: true,
        radiation: '0 mSv',
        urgentAlert: false
      },
      {
        id: 4,
        studyId: 'US-2025-001',
        patientName: 'Carmen Díaz',
        patientId: 'P-77889',
        age: 29,
        gender: 'Femenino',
        studyType: 'Ultrasonido Obstétrico',
        modality: 'US',
        bodyPart: 'Abdomen',
        laterality: 'N/A',
        views: ['Transversal', 'Longitudinal'],
        priority: 'Normal',
        status: 'Reportado',
        orderedBy: 'Dra. Isabel Moreno',
        orderedDate: '2025-11-19T11:00:00',
        scheduledDate: '2025-11-19T15:00:00',
        performedDate: '2025-11-19T15:20:00',
        reportedDate: '2025-11-19T16:00:00',
        technician: 'Tec. Sofía Vega',
        radiologist: 'Rad. Dra. Patricia Ruiz',
        findings: 'Embarazo único intrauterino. Feto en posición cefálica. Frecuencia cardíaca fetal 145 lpm. Movimientos fetales presentes. Líquido amniótico normal. Placenta anterior grado II. Longitud cérvix 35mm.',
        impression: 'Embarazo de 32 semanas con desarrollo acorde a edad gestacional.',
        recommendations: 'Control prenatal de rutina. Próximo ultrasonido a las 36 semanas.',
        imageCount: 12,
        imageUrl: '/images/ultrasound-sample.jpg',
        contrast: false,
        radiation: '0 mSv',
        urgentAlert: false
      },
      {
        id: 5,
        studyId: 'RX-2025-002',
        patientName: 'Jorge Fernández',
        patientId: 'P-44556',
        age: 55,
        gender: 'Masculino',
        studyType: 'Radiografía de Rodilla',
        modality: 'RX',
        bodyPart: 'Rodilla',
        laterality: 'Derecha',
        views: ['AP', 'Lateral', 'Axial'],
        priority: 'Normal',
        status: 'Programado',
        orderedBy: 'Dra. Carmen López',
        orderedDate: '2025-11-20T10:00:00',
        scheduledDate: '2025-11-20T16:00:00',
        performedDate: null,
        reportedDate: null,
        technician: null,
        radiologist: null,
        findings: null,
        impression: null,
        recommendations: null,
        imageCount: 0,
        imageUrl: null,
        contrast: false,
        radiation: '0.001 mSv',
        urgentAlert: false
      },
      {
        id: 6,
        studyId: 'MG-2025-001',
        patientName: 'Elena Torres',
        patientId: 'P-88990',
        age: 48,
        gender: 'Femenino',
        studyType: 'Mamografía Bilateral',
        modality: 'MG',
        bodyPart: 'Mamas',
        laterality: 'Bilateral',
        views: ['CC', 'MLO'],
        priority: 'Normal',
        status: 'Reportado',
        orderedBy: 'Dr. Luis Ramírez',
        orderedDate: '2025-11-18T09:00:00',
        scheduledDate: '2025-11-19T08:00:00',
        performedDate: '2025-11-19T08:30:00',
        reportedDate: '2025-11-19T12:00:00',
        technician: 'Tec. María González',
        radiologist: 'Rad. Dra. Ana Torres',
        findings: 'Parénquima mamario heterogéneamente denso. Mamas simétricas. No se identifican masas ni calcificaciones sospechosas. No distorsión arquitectural.',
        impression: 'BI-RADS 2: Hallazgos benignos.',
        recommendations: 'Control mamográfico de rutina en 1 año.',
        imageCount: 4,
        imageUrl: '/images/mammography-sample.jpg',
        contrast: false,
        radiation: '0.4 mSv',
        urgentAlert: false
      },
      {
        id: 7,
        studyId: 'TC-2025-002',
        patientName: 'Diego Morales',
        patientId: 'P-22334',
        age: 41,
        gender: 'Masculino',
        studyType: 'Angio-TC de Tórax',
        modality: 'TC',
        bodyPart: 'Tórax',
        laterality: 'N/A',
        views: ['Axial', 'Coronal', 'Sagital', 'MIP', '3D'],
        priority: 'STAT',
        status: 'Completado',
        orderedBy: 'Dr. Carlos Méndez',
        orderedDate: '2025-11-20T13:00:00',
        scheduledDate: '2025-11-20T13:15:00',
        performedDate: '2025-11-20T13:30:00',
        reportedDate: null,
        technician: 'Tec. Juan Pérez',
        radiologist: 'Rad. Dr. Eduardo Vargas',
        findings: null,
        impression: null,
        recommendations: null,
        imageCount: 250,
        imageUrl: '/images/ct-angio-sample.jpg',
        contrast: true,
        radiation: '7.0 mSv',
        urgentAlert: true
      }
    ];

    setRadiologyStudies(mockStudies);
    setFilteredStudies(mockStudies);
  }, []);

  // Filtrado
  useEffect(() => {
    let filtered = radiologyStudies;

    if (searchTerm) {
      filtered = filtered.filter(study =>
        study.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        study.studyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        study.studyType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(study => study.status === filterStatus);
    }

    if (filterModality !== 'all') {
      filtered = filtered.filter(study => study.modality === filterModality);
    }

    setFilteredStudies(filtered);
  }, [searchTerm, filterStatus, filterModality, radiologyStudies]);

  const modalities = [
    { code: 'RX', name: 'Radiografía' },
    { code: 'TC', name: 'Tomografía' },
    { code: 'RM', name: 'Resonancia' },
    { code: 'US', name: 'Ultrasonido' },
    { code: 'MG', name: 'Mamografía' },
    { code: 'FL', name: 'Fluoroscopía' },
    { code: 'PET', name: 'PET-CT' }
  ];

  const priorities = ['Normal', 'Urgente', 'STAT'];
  const statuses = ['Programado', 'En Sala', 'Completado', 'En Proceso', 'Reportado', 'Cancelado'];

  const getStatusColor = (status) => {
    const colors = {
      'Programado': 'bg-blue-100 text-blue-700 border-blue-300',
      'En Sala': 'bg-purple-100 text-purple-700 border-purple-300',
      'Completado': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'En Proceso': 'bg-orange-100 text-orange-700 border-orange-300',
      'Reportado': 'bg-green-100 text-green-700 border-green-300',
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

  const getModalityIcon = (modality) => {
    const icons = {
      'RX': <Scan size={20} />,
      'TC': <Brain size={20} />,
      'RM': <Cpu size={20} />,
      'US': <Activity size={20} />,
      'MG': <ImageIcon size={20} />,
      'FL': <Eye size={20} />,
      'PET': <Heart size={20} />
    };
    return icons[modality] || <ImageIcon size={20} />;
  };

  const handleSaveStudy = (studyData) => {
    if (editingStudy) {
      setRadiologyStudies(radiologyStudies.map(s => s.id === editingStudy.id ? { ...studyData, id: s.id } : s));
    } else {
      const newId = `${studyData.modality}-2025-${String(radiologyStudies.length + 1).padStart(3, '0')}`;
      setRadiologyStudies([...radiologyStudies, { ...studyData, id: Date.now(), studyId: newId }]);
    }
    setShowStudyForm(false);
    setEditingStudy(null);
  };

  const handleEditStudy = (study) => {
    setEditingStudy(study);
    setShowStudyForm(true);
  };

  const handleDeleteStudy = (id) => {
    if (window.confirm('¿Está seguro de eliminar este estudio?')) {
      setRadiologyStudies(radiologyStudies.filter(s => s.id !== id));
    }
  };

  // Estadísticas
  const totalStudies = radiologyStudies.length;
  const scheduledStudies = radiologyStudies.filter(s => s.status === 'Programado').length;
  const inProgressStudies = radiologyStudies.filter(s => s.status === 'En Sala' || s.status === 'Completado' || s.status === 'En Proceso').length;
  const reportedStudies = radiologyStudies.filter(s => s.status === 'Reportado').length;
  const urgentStudies = radiologyStudies.filter(s => s.priority === 'Urgente' || s.priority === 'STAT').length;
  const criticalStudies = radiologyStudies.filter(s => s.urgentAlert).length;

  return (
    <div className="p-8 space-y-8 animate-fadeIn min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 rounded-3xl p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-4 border-purple-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white flex items-center gap-4">
              <div className="bg-white/20 p-5 rounded-2xl backdrop-blur-xl">
                <Scan className="text-white" size={64} />
              </div>
              Radiología e Imágenes
            </h1>
            <p className="text-purple-100 mt-4 text-2xl font-medium">
              🩻 Sistema de gestión de estudios radiológicos y PACS
            </p>
          </div>
          <button
            onClick={() => {
              setEditingStudy(null);
              setShowStudyForm(true);
            }}
            className="bg-white text-purple-600 px-8 py-5 rounded-2xl hover:shadow-2xl transition-all flex items-center gap-3 text-xl font-bold hover:scale-105"
          >
            <Plus size={28} />
            Nuevo Estudio
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-3xl p-8 text-white shadow-[0_20px_60px_-15px_rgba(168,85,247,0.5)] hover:shadow-[0_25px_70px_-15px_rgba(168,85,247,0.6)] transition-all hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <Scan size={32} className="text-white" />
            </div>
          </div>
          <p className="text-purple-100 text-base font-medium">Total Estudios</p>
          <p className="text-4xl font-bold mt-2">{totalStudies}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl p-8 text-white shadow-[0_20px_60px_-15px_rgba(59,130,246,0.5)] hover:shadow-[0_25px_70px_-15px_rgba(59,130,246,0.6)] transition-all hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <Calendar size={32} className="text-white" />
            </div>
          </div>
          <p className="text-blue-100 text-base font-medium">Programados</p>
          <p className="text-4xl font-bold mt-2">{scheduledStudies}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 rounded-3xl p-8 text-white shadow-[0_20px_60px_-15px_rgba(234,179,8,0.5)] hover:shadow-[0_25px_70px_-15px_rgba(234,179,8,0.6)] transition-all hover:scale-105 animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <Activity size={32} className="text-white" />
            </div>
          </div>
          <p className="text-yellow-100 text-base font-medium">En Proceso</p>
          <p className="text-4xl font-bold mt-2">{inProgressStudies}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-3xl p-8 text-white shadow-[0_20px_60px_-15px_rgba(34,197,94,0.5)] hover:shadow-[0_25px_70px_-15px_rgba(34,197,94,0.6)] transition-all hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <CheckCircle size={32} className="text-white" />
            </div>
          </div>
          <p className="text-green-100 text-base font-medium">Reportados</p>
          <p className="text-4xl font-bold mt-2">{reportedStudies}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-3xl p-8 text-white shadow-[0_20px_60px_-15px_rgba(249,115,22,0.5)] hover:shadow-[0_25px_70px_-15px_rgba(249,115,22,0.6)] transition-all hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <AlertCircle size={32} className="text-white" />
            </div>
          </div>
          <p className="text-orange-100 text-base font-medium">Urgentes</p>
          <p className="text-4xl font-bold mt-2">{urgentStudies}</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-3xl p-8 text-white shadow-[0_20px_60px_-15px_rgba(239,68,68,0.5)] hover:shadow-[0_25px_70px_-15px_rgba(239,68,68,0.6)] transition-all hover:scale-105 animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <AlertCircle size={32} className="text-white" />
            </div>
          </div>
          <p className="text-red-100 text-base font-medium">Críticos</p>
          <p className="text-4xl font-bold mt-2">{criticalStudies}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-white via-purple-50/30 to-white dark:bg-gray-800 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] p-8 border-4 border-purple-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            <input
              type="text"
              placeholder="Buscar paciente, estudio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
            />
          </div>

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

          {/* Modality Filter */}
          <select
            value={filterModality}
            onChange={(e) => setFilterModality(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
          >
            <option value="all">Todas las modalidades</option>
            {modalities.map(mod => (
              <option key={mod.code} value={mod.code}>{mod.code} - {mod.name}</option>
            ))}
          </select>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <button className="flex-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium">
              Hoy
            </button>
            <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
              Urgentes
            </button>
          </div>
        </div>
      </div>

      {/* Studies List */}
      <div className="space-y-4">
        {filteredStudies.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <Scan className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 dark:text-gray-400">No se encontraron estudios</p>
          </div>
        ) : (
          filteredStudies.map(study => (
            <div
              key={study.id}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all ${
                study.urgentAlert ? 'border-l-4 border-red-500' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      study.modality === 'RX' ? 'bg-blue-100 text-blue-600' :
                      study.modality === 'TC' ? 'bg-purple-100 text-purple-600' :
                      study.modality === 'RM' ? 'bg-pink-100 text-pink-600' :
                      study.modality === 'US' ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {getModalityIcon(study.modality)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{study.patientName}</h3>
                      <p className="text-sm text-gray-500">
                        {study.patientId} • {study.age} años • {study.gender}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(study.priority)}`}>
                      {study.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(study.status)}`}>
                      {study.status}
                    </span>
                    {study.urgentAlert && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white animate-pulse">
                        ⚠️ CRÍTICO
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium">
                      {study.studyId}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">•</span>
                    <span className="text-sm font-semibold text-purple-600">{study.studyType}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {study.status === 'Reportado' && (
                    <>
                      <button
                        onClick={() => setSelectedStudy(study)}
                        className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg transition-colors"
                        title="Ver reporte"
                      >
                        <Eye size={18} className="text-purple-600" />
                      </button>
                      {study.imageCount > 0 && (
                        <button
                          onClick={() => {
                            setSelectedStudy(study);
                            setImageViewerOpen(true);
                          }}
                          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                          title="Ver imágenes"
                        >
                          <ImageIcon size={18} className="text-blue-600" />
                        </button>
                      )}
                      <button
                        className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors"
                        title="Imprimir"
                      >
                        <Printer size={18} className="text-green-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-orange-100 dark:hover:bg-orange-900 rounded-lg transition-colors"
                        title="Descargar"
                      >
                        <Download size={18} className="text-orange-600" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleEditStudy(study)}
                    className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={18} className="text-yellow-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteStudy(study.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>

              {/* Study Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Parte del Cuerpo</p>
                  <p className="font-semibold">{study.bodyPart}</p>
                  {study.laterality !== 'N/A' && (
                    <p className="text-xs text-gray-500">{study.laterality}</p>
                  )}
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Vistas</p>
                  <p className="text-sm font-medium">{study.views.join(', ')}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Imágenes</p>
                  <p className="font-semibold text-purple-600">{study.imageCount}</p>
                  {study.contrast && (
                    <p className="text-xs text-orange-600 font-medium">+ Contraste</p>
                  )}
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Radiación</p>
                  <p className="font-semibold">{study.radiation}</p>
                </div>
              </div>

              {/* Personnel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <Stethoscope size={14} className="text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">Ordenado por</p>
                    <p className="font-medium">{study.orderedBy}</p>
                  </div>
                </div>
                {study.technician && (
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Técnico</p>
                      <p className="font-medium">{study.technician}</p>
                    </div>
                  </div>
                )}
                {study.radiologist && (
                  <div className="flex items-center gap-2">
                    <Microscope size={14} className="text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-500">Radiólogo</p>
                      <p className="font-medium">{study.radiologist}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-2 mb-4 text-xs overflow-x-auto">
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  <Calendar size={12} />
                  <span>{new Date(study.orderedDate).toLocaleDateString()}</span>
                </div>
                {study.scheduledDate && (
                  <>
                    <div className="text-gray-400">→</div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded">
                      <Clock size={12} />
                      <span>{new Date(study.scheduledDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </>
                )}
                {study.performedDate && (
                  <>
                    <div className="text-gray-400">→</div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded">
                      <CheckCircle size={12} />
                      <span>Realizado</span>
                    </div>
                  </>
                )}
                {study.reportedDate && (
                  <>
                    <div className="text-gray-400">→</div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 rounded">
                      <FileText size={12} />
                      <span>Reportado</span>
                    </div>
                  </>
                )}
              </div>

              {/* Report Preview */}
              {study.findings && (
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                  <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                    <FileText className="text-purple-600" size={16} />
                    Reporte Radiológico
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">HALLAZGOS:</p>
                      <p className="text-gray-700 dark:text-gray-300">{study.findings}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">IMPRESIÓN DIAGNÓSTICA:</p>
                      <p className="font-semibold text-purple-700 dark:text-purple-300">{study.impression}</p>
                    </div>
                    {study.recommendations && (
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">RECOMENDACIONES:</p>
                        <p className="text-gray-700 dark:text-gray-300">{study.recommendations}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Study Form Modal */}
      {showStudyForm && (
        <StudyFormModal
          study={editingStudy}
          onSave={handleSaveStudy}
          onCancel={() => {
            setShowStudyForm(false);
            setEditingStudy(null);
          }}
          modalities={modalities}
          priorities={priorities}
          statuses={statuses}
        />
      )}

      {/* Report Detail Modal */}
      {selectedStudy && !imageViewerOpen && (
        <ReportDetailModal
          study={selectedStudy}
          onClose={() => setSelectedStudy(null)}
        />
      )}

      {/* Image Viewer Modal */}
      {imageViewerOpen && selectedStudy && (
        <ImageViewerModal
          study={selectedStudy}
          zoom={imageZoom}
          rotation={imageRotation}
          onZoomIn={() => setImageZoom(Math.min(imageZoom + 25, 200))}
          onZoomOut={() => setImageZoom(Math.max(imageZoom - 25, 25))}
          onRotate={() => setImageRotation((imageRotation + 90) % 360)}
          onClose={() => {
            setImageViewerOpen(false);
            setSelectedStudy(null);
            setImageZoom(100);
            setImageRotation(0);
          }}
        />
      )}
    </div>
  );
};

// Study Form Modal (simplified)
const StudyFormModal = ({ study, onSave, onCancel, modalities, priorities, statuses }) => {
  const [formData, setFormData] = useState(study || {
    patientName: '',
    patientId: '',
    age: '',
    gender: 'Masculino',
    studyType: '',
    modality: 'RX',
    bodyPart: '',
    laterality: 'N/A',
    priority: 'Normal',
    status: 'Programado',
    orderedBy: '',
    contrast: false,
    urgentAlert: false
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-xl font-bold">{study ? 'Editar Estudio' : 'Nuevo Estudio'}</h2>
          <button onClick={onCancel} className="hover:bg-white/20 p-1 rounded"><X size={20} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Nombre del Paciente"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
            />
            <input
              type="text"
              required
              placeholder="ID Paciente"
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
            />
            <select
              value={formData.modality}
              onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
            >
              {modalities.map(m => <option key={m.code} value={m.code}>{m.code} - {m.name}</option>)}
            </select>
            <input
              type="text"
              required
              placeholder="Tipo de Estudio"
              value={formData.studyType}
              onChange={(e) => setFormData({ ...formData, studyType: e.target.value })}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
            />
            <input
              type="text"
              required
              placeholder="Parte del Cuerpo"
              value={formData.bodyPart}
              onChange={(e) => setFormData({ ...formData, bodyPart: e.target.value })}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
            />
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
            >
              {priorities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 border rounded-xl hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Report Detail Modal (simplified)
const ReportDetailModal = ({ study, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Reporte Radiológico</h2>
            <p className="text-sm">{study.studyId} - {study.studyType}</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded"><X size={24} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h3 className="font-bold mb-2">Paciente</h3>
            <p>{study.patientName} ({study.patientId}) - {study.age} años - {study.gender}</p>
          </div>
          {study.findings && (
            <div className="space-y-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">HALLAZGOS</h3>
                <p className="text-gray-700 dark:text-gray-300">{study.findings}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-2">IMPRESIÓN DIAGNÓSTICA</h3>
                <p className="text-gray-700 dark:text-gray-300 font-semibold">{study.impression}</p>
              </div>
              {study.recommendations && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                  <h3 className="font-bold text-green-900 dark:text-green-100 mb-2">RECOMENDACIONES</h3>
                  <p className="text-gray-700 dark:text-gray-300">{study.recommendations}</p>
                </div>
              )}
            </div>
          )}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Radiólogo:</strong> {study.radiologist}<br />
              <strong>Reportado:</strong> {study.reportedDate && new Date(study.reportedDate).toLocaleString('es-ES')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Image Viewer Modal
const ImageViewerModal = ({ study, zoom, rotation, onZoomIn, onZoomOut, onRotate, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex flex-col z-50">
      <div className="bg-gray-900 p-4 flex justify-between items-center">
        <div className="text-white">
          <h3 className="font-bold">{study.studyType}</h3>
          <p className="text-sm text-gray-400">{study.patientName} - {study.studyId}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onZoomOut} className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
            <ZoomOut size={20} />
          </button>
          <button onClick={onZoomIn} className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
            <ZoomIn size={20} />
          </button>
          <button onClick={onRotate} className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
            <RotateCw size={20} />
          </button>
          <button onClick={onClose} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            <X size={20} />
          </button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div
          className="bg-gray-800 rounded-lg p-8 flex items-center justify-center"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transition: 'transform 0.3s'
          }}
        >
          <div className="text-white text-center">
            <ImageIcon size={64} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-bold mb-2">{study.studyType}</p>
            <p className="text-sm text-gray-400">Zoom: {zoom}% | Rotación: {rotation}°</p>
            <p className="text-xs text-gray-500 mt-4">Visor de imágenes DICOM simulado</p>
            <p className="text-xs text-gray-500">{study.imageCount} imágenes en el estudio</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadiologyManagement;
