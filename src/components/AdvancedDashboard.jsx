import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Heart,
  Bed,
  Stethoscope,
  Pill,
  TestTube,
  Scan,
  Scissors,
  ArrowUp,
  ArrowDown,
  Minus,
  BarChart3,
  PieChart,
  LineChart,
  Zap,
  Target,
  Award,
  Bell,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const AdvancedDashboard = ({ currentUser }) => {
  const [timeRange, setTimeRange] = useState('today');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Mock real-time data
  const [realtimeStats, setRealtimeStats] = useState({
    activePatients: 142,
    waitingPatients: 23,
    inSurgery: 4,
    emergencyCases: 7,
    occupiedBeds: 87,
    availableBeds: 33,
    criticalPatients: 5,
    dischargedToday: 12,
    revenue: 145600,
    expenses: 98400,
    staffOnDuty: 67,
    averageWaitTime: 18
  });

  // Hourly patient flow (last 24 hours)
  const hourlyFlow = [
    { hour: '00:00', admissions: 2, discharges: 1, emergencies: 3 },
    { hour: '02:00', admissions: 1, discharges: 0, emergencies: 2 },
    { hour: '04:00', admissions: 1, discharges: 0, emergencies: 1 },
    { hour: '06:00', admissions: 3, discharges: 2, emergencies: 4 },
    { hour: '08:00', admissions: 8, discharges: 5, emergencies: 6 },
    { hour: '10:00', admissions: 12, discharges: 8, emergencies: 5 },
    { hour: '12:00', admissions: 15, discharges: 10, emergencies: 7 },
    { hour: '14:00', admissions: 10, discharges: 12, emergencies: 4 },
    { hour: '16:00', admissions: 9, discharges: 8, emergencies: 5 },
    { hour: '18:00', admissions: 7, discharges: 6, emergencies: 6 },
    { hour: '20:00', admissions: 5, discharges: 4, emergencies: 5 },
    { hour: '22:00', admissions: 3, discharges: 2, emergencies: 4 }
  ];

  // Department performance
  const departmentPerformance = [
    { name: 'Cardiología', efficiency: 92, satisfaction: 94, utilization: 88 },
    { name: 'Emergencias', efficiency: 85, satisfaction: 87, utilization: 95 },
    { name: 'Cirugía', efficiency: 90, satisfaction: 92, utilization: 85 },
    { name: 'Pediatría', efficiency: 88, satisfaction: 95, utilization: 78 },
    { name: 'Radiología', efficiency: 87, satisfaction: 90, utilization: 82 },
    { name: 'Laboratorio', efficiency: 93, satisfaction: 91, utilization: 89 }
  ];

  // Resource utilization
  const resourceData = [
    { name: 'Quirófanos', value: 75, color: '#8b5cf6' },
    { name: 'Camas UCI', value: 90, color: '#ef4444' },
    { name: 'Camas General', value: 72, color: '#3b82f6' },
    { name: 'Equipos Diag.', value: 68, color: '#10b981' },
    { name: 'Personal Médico', value: 85, color: '#f59e0b' },
    { name: 'Farmacia', value: 62, color: '#ec4899' }
  ];

  // Financial overview (last 7 days)
  const financialData = [
    { day: 'Lun', income: 145000, expenses: 98000, profit: 47000 },
    { day: 'Mar', income: 152000, expenses: 102000, profit: 50000 },
    { day: 'Mié', income: 138000, expenses: 95000, profit: 43000 },
    { day: 'Jue', income: 165000, expenses: 108000, profit: 57000 },
    { day: 'Vie', income: 158000, expenses: 105000, profit: 53000 },
    { day: 'Sáb', income: 125000, expenses: 88000, profit: 37000 },
    { day: 'Dom', income: 118000, expenses: 85000, profit: 33000 }
  ];

  // Service distribution
  const serviceDistribution = [
    { name: 'Consultas', value: 35, color: '#3b82f6' },
    { name: 'Cirugías', value: 20, color: '#8b5cf6' },
    { name: 'Emergencias', value: 15, color: '#ef4444' },
    { name: 'Laboratorio', value: 12, color: '#10b981' },
    { name: 'Radiología', value: 10, color: '#f59e0b' },
    { name: 'Farmacia', value: 8, color: '#ec4899' }
  ];

  // Active alerts
  const alerts = [
    { id: 1, type: 'critical', icon: AlertCircle, message: '5 pacientes en estado crítico requieren atención inmediata', time: '2 min' },
    { id: 2, type: 'warning', icon: Clock, message: 'Tiempo de espera en emergencias superó 30 minutos', time: '5 min' },
    { id: 3, type: 'info', icon: Bed, message: 'Ocupación UCI al 90% - considerar redistribución', time: '10 min' },
    { id: 4, type: 'warning', icon: Pill, message: 'Stock bajo de 3 medicamentos esenciales', time: '15 min' }
  ];

  const getAlertColor = (type) => {
    const colors = {
      critical: 'bg-red-500',
      warning: 'bg-orange-500',
      info: 'bg-blue-500',
      success: 'bg-green-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const getTrendIcon = (value, threshold = 0) => {
    if (value > threshold) return <ArrowUp size={16} className="text-green-600" />;
    if (value < threshold) return <ArrowDown size={16} className="text-red-600" />;
    return <Minus size={16} className="text-gray-600" />;
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <Activity className="text-blue-600" size={32} />
            Dashboard Ejecutivo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor en tiempo real de operaciones hospitalarias
          </p>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Clock size={14} />
            <span>Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}</span>
            {autoRefresh && <span className="animate-pulse">• Auto-refresh activo</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              autoRefresh 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            <RefreshCw size={18} className={autoRefresh ? 'animate-spin' : ''} />
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </button>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          >
            <option value="today">Hoy</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mes</option>
            <option value="quarter">Este Trimestre</option>
          </select>
        </div>
      </div>

      {/* Critical Alerts */}
      {alerts.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-4 border-l-4 border-red-500">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="text-red-600 animate-pulse" size={20} />
            <h3 className="font-bold text-red-900 dark:text-red-100">Alertas Activas ({alerts.length})</h3>
          </div>
          <div className="space-y-2">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-lg p-3">
                <div className={`p-2 rounded-full ${getAlertColor(alert.type)}`}>
                  <alert.icon size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">Hace {alert.time}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <CheckCircle size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Patients */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
          <div className="flex justify-between items-start mb-4">
            <Users size={32} className="text-blue-200" />
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs flex items-center gap-1">
              {getTrendIcon(5)}
              +5
            </span>
          </div>
          <p className="text-blue-100 text-sm mb-1">Pacientes Activos</p>
          <p className="text-4xl font-bold mb-2">{realtimeStats.activePatients}</p>
          <div className="flex items-center justify-between text-sm text-blue-100">
            <span>{realtimeStats.waitingPatients} en espera</span>
            <span>{realtimeStats.criticalPatients} críticos</span>
          </div>
        </div>

        {/* Revenue Today */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
          <div className="flex justify-between items-start mb-4">
            <DollarSign size={32} className="text-green-200" />
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs flex items-center gap-1">
              {getTrendIcon(12)}
              +12%
            </span>
          </div>
          <p className="text-green-100 text-sm mb-1">Ingresos Hoy</p>
          <p className="text-4xl font-bold mb-2">${(realtimeStats.revenue / 1000).toFixed(1)}K</p>
          <div className="flex items-center justify-between text-sm text-green-100">
            <span>Gastos: ${(realtimeStats.expenses / 1000).toFixed(1)}K</span>
            <span className="font-semibold">+${((realtimeStats.revenue - realtimeStats.expenses) / 1000).toFixed(1)}K</span>
          </div>
        </div>

        {/* Bed Occupancy */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
          <div className="flex justify-between items-start mb-4">
            <Bed size={32} className="text-purple-200" />
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs flex items-center gap-1">
              {getTrendIcon(-2)}
              72.5%
            </span>
          </div>
          <p className="text-purple-100 text-sm mb-1">Ocupación de Camas</p>
          <p className="text-4xl font-bold mb-2">{realtimeStats.occupiedBeds}/{realtimeStats.occupiedBeds + realtimeStats.availableBeds}</p>
          <div className="w-full bg-purple-700 rounded-full h-2 mb-2">
            <div 
              className="bg-white rounded-full h-2 transition-all"
              style={{ width: `${(realtimeStats.occupiedBeds / (realtimeStats.occupiedBeds + realtimeStats.availableBeds) * 100).toFixed(0)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm text-purple-100">
            <span>{realtimeStats.availableBeds} disponibles</span>
            <span>{realtimeStats.occupiedBeds} ocupadas</span>
          </div>
        </div>

        {/* Staff on Duty */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
          <div className="flex justify-between items-start mb-4">
            <Stethoscope size={32} className="text-orange-200" />
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <CheckCircle size={14} />
              100%
            </span>
          </div>
          <p className="text-orange-100 text-sm mb-1">Personal en Turno</p>
          <p className="text-4xl font-bold mb-2">{realtimeStats.staffOnDuty}</p>
          <div className="flex items-center justify-between text-sm text-orange-100">
            <span>35 médicos</span>
            <span>32 enfermeras</span>
          </div>
        </div>
      </div>

      {/* Service Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <AlertCircle className="text-red-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{realtimeStats.emergencyCases}</p>
          <p className="text-xs text-gray-500">Emergencias</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Scissors className="text-purple-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{realtimeStats.inSurgery}</p>
          <p className="text-xs text-gray-500">En Cirugía</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <TestTube className="text-green-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">28</p>
          <p className="text-xs text-gray-500">Lab Pendiente</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Scan className="text-blue-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">15</p>
          <p className="text-xs text-gray-500">Radiología</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all text-center">
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Pill className="text-pink-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">142</p>
          <p className="text-xs text-gray-500">Farmacia</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="text-yellow-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{realtimeStats.dischargedToday}</p>
          <p className="text-xs text-gray-500">Altas Hoy</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Patient Flow */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Activity className="text-blue-600" size={20} />
              Flujo de Pacientes (24h)
            </h3>
            <LineChart className="text-gray-400" size={20} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={hourlyFlow}>
              <defs>
                <linearGradient id="colorAdmissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDischarges" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEmergencies" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="admissions" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAdmissions)" name="Ingresos" />
              <Area type="monotone" dataKey="discharges" stroke="#10b981" fillOpacity={1} fill="url(#colorDischarges)" name="Altas" />
              <Area type="monotone" dataKey="emergencies" stroke="#ef4444" fillOpacity={1} fill="url(#colorEmergencies)" name="Emergencias" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Financial Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <DollarSign className="text-green-600" size={20} />
              Desempeño Financiero (7 días)
            </h3>
            <BarChart3 className="text-gray-400" size={20} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Ingresos" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expenses" fill="#ef4444" name="Gastos" radius={[8, 8, 0, 0]} />
              <Bar dataKey="profit" fill="#3b82f6" name="Utilidad" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance Radar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Target className="text-purple-600" size={20} />
              Desempeño por Departamento
            </h3>
            <Award className="text-gray-400" size={20} />
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={departmentPerformance}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Eficiencia" dataKey="efficiency" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              <Radar name="Satisfacción" dataKey="satisfaction" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Radar name="Utilización" dataKey="utilization" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Service Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <PieChart className="text-pink-600" size={20} />
              Distribución de Servicios
            </h3>
            <Zap className="text-gray-400" size={20} />
          </div>
          <div className="flex items-center">
            <ResponsiveContainer width="60%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {serviceDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resource Utilization */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Activity className="text-orange-600" size={20} />
            Utilización de Recursos
          </h3>
        </div>
        <div className="space-y-4">
          {resourceData.map((resource, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{resource.name}</span>
                <span className="text-sm font-bold" style={{ color: resource.color }}>
                  {resource.value}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${resource.value}%`,
                    backgroundColor: resource.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 hover:shadow-lg transition-all flex flex-col items-center gap-2">
          <Users size={24} />
          <span className="text-sm font-medium">Ver Pacientes</span>
        </button>
        <button className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 hover:shadow-lg transition-all flex flex-col items-center gap-2">
          <Calendar size={24} />
          <span className="text-sm font-medium">Citas</span>
        </button>
        <button className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 hover:shadow-lg transition-all flex flex-col items-center gap-2">
          <BarChart3 size={24} />
          <span className="text-sm font-medium">Reportes</span>
        </button>
        <button className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-4 hover:shadow-lg transition-all flex flex-col items-center gap-2">
          <AlertCircle size={24} />
          <span className="text-sm font-medium">Alertas</span>
        </button>
      </div>
    </div>
  );
};

export default AdvancedDashboard;
