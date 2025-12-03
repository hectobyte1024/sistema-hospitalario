import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  FileText,
  Download,
  Calendar,
  Filter,
  PieChart,
  LineChart as LineChartIcon,
  ArrowUp,
  ArrowDown,
  FileDown,
  Printer,
  Mail,
  Share2,
  Clock,
  Heart,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ReportsAnalytics = ({ currentUser }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateFrom, setDateFrom] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);

  // Mock data para reportes
  const revenueData = [
    { month: 'Ene', ingresos: 450000, gastos: 280000, utilidad: 170000 },
    { month: 'Feb', ingresos: 520000, gastos: 310000, utilidad: 210000 },
    { month: 'Mar', ingresos: 480000, gastos: 295000, utilidad: 185000 },
    { month: 'Abr', ingresos: 610000, gastos: 340000, utilidad: 270000 },
    { month: 'May', ingresos: 580000, gastos: 325000, utilidad: 255000 },
    { month: 'Jun', ingresos: 650000, gastos: 360000, utilidad: 290000 },
    { month: 'Jul', ingresos: 720000, gastos: 380000, utilidad: 340000 },
    { month: 'Ago', ingresos: 690000, gastos: 370000, utilidad: 320000 },
    { month: 'Sep', ingresos: 730000, gastos: 390000, utilidad: 340000 },
    { month: 'Oct', ingresos: 780000, gastos: 410000, utilidad: 370000 },
    { month: 'Nov', ingresos: 820000, gastos: 430000, utilidad: 390000 }
  ];

  const patientStatsData = [
    { day: 'Lun', nuevos: 12, recurrentes: 45, urgencias: 8 },
    { day: 'Mar', nuevos: 15, recurrentes: 52, urgencias: 6 },
    { day: 'Mié', nuevos: 18, recurrentes: 48, urgencias: 10 },
    { day: 'Jue', nuevos: 14, recurrentes: 50, urgencias: 7 },
    { day: 'Vie', nuevos: 20, recurrentes: 55, urgencias: 12 },
    { day: 'Sáb', nuevos: 8, recurrentes: 30, urgencias: 15 },
    { day: 'Dom', nuevos: 5, recurrentes: 25, urgencias: 18 }
  ];

  const departmentPerformance = [
    { name: 'Urgencias', pacientes: 450, satisfaccion: 92 },
    { name: 'Cirugía', pacientes: 180, satisfaccion: 95 },
    { name: 'Consulta Externa', pacientes: 820, satisfaccion: 88 },
    { name: 'Hospitalización', pacientes: 240, satisfaccion: 90 },
    { name: 'Laboratorio', pacientes: 650, satisfaccion: 85 },
    { name: 'Radiología', pacientes: 380, satisfaccion: 87 }
  ];

  const occupancyData = [
    { name: 'Ocupadas', value: 145, color: '#3b82f6' },
    { name: 'Disponibles', value: 35, color: '#10b981' },
    { name: 'Mantenimiento', value: 8, color: '#f59e0b' },
    { name: 'Reservadas', value: 12, color: '#8b5cf6' }
  ];

  const specialtyRevenue = [
    { name: 'Cardiología', value: 180000 },
    { name: 'Ortopedia', value: 165000 },
    { name: 'Neurología', value: 145000 },
    { name: 'Ginecología', value: 130000 },
    { name: 'Pediatría', value: 120000 },
    { name: 'Otros', value: 80000 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Estadísticas resumen
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.ingresos, 0);
  const totalExpenses = revenueData.reduce((sum, item) => sum + item.gastos, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);

  const currentMonthRevenue = revenueData[revenueData.length - 1]?.ingresos || 0;
  const previousMonthRevenue = revenueData[revenueData.length - 2]?.ingresos || 0;
  const revenueGrowth = (((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100).toFixed(1);

  const totalPatients = patientStatsData.reduce((sum, item) => sum + item.nuevos + item.recurrentes + item.urgencias, 0);
  const totalNewPatients = patientStatsData.reduce((sum, item) => sum + item.nuevos, 0);

  const averageOccupancy = ((occupancyData[0].value / occupancyData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1);

  const exportToPDF = () => {
    alert('Función de exportación a PDF: En producción se generaría un PDF con jsPDF o similar');
  };

  const exportToExcel = () => {
    alert('Función de exportación a Excel: En producción se exportaría con SheetJS o similar');
  };

  const sendEmail = () => {
    alert('Función de envío por email: En producción se enviaría el reporte por correo');
  };

  const print = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
            <BarChart3 size={32} />
            Reportes y Análisis
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Estadísticas avanzadas y reportes del sistema hospitalario
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            title="Exportar a PDF"
          >
            <FileDown size={18} />
            PDF
          </button>
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            title="Exportar a Excel"
          >
            <Download size={18} />
            Excel
          </button>
          <button
            onClick={print}
            className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            title="Imprimir"
          >
            <Printer size={18} />
          </button>
          <button
            onClick={sendEmail}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            title="Enviar por email"
          >
            <Mail size={18} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tipo de Reporte</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
            >
              <option value="overview">Resumen General</option>
              <option value="financial">Financiero</option>
              <option value="patients">Pacientes</option>
              <option value="departments">Departamentos</option>
              <option value="occupancy">Ocupación</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Período</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
            >
              <option value="week">Esta Semana</option>
              <option value="month">Este Mes</option>
              <option value="quarter">Este Trimestre</option>
              <option value="year">Este Año</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Desde</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Hasta</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <DollarSign size={24} />
            </div>
            <div className={`flex items-center gap-1 text-sm ${revenueGrowth >= 0 ? 'text-green-200' : 'text-red-200'}`}>
              {revenueGrowth >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              {Math.abs(revenueGrowth)}%
            </div>
          </div>
          <p className="text-blue-100 text-sm">Ingresos Totales</p>
          <p className="text-3xl font-bold mt-1">${(totalRevenue / 1000).toFixed(0)}K</p>
          <p className="text-xs text-blue-200 mt-2">Margen: {profitMargin}%</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Users size={24} />
            </div>
            <div className="flex items-center gap-1 text-sm text-green-200">
              <ArrowUp size={16} />
              12%
            </div>
          </div>
          <p className="text-green-100 text-sm">Pacientes Atendidos</p>
          <p className="text-3xl font-bold mt-1">{totalPatients}</p>
          <p className="text-xs text-green-200 mt-2">Nuevos: {totalNewPatients}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Activity size={24} />
            </div>
            <div className="flex items-center gap-1 text-sm text-purple-200">
              <CheckCircle size={16} />
              Óptimo
            </div>
          </div>
          <p className="text-purple-100 text-sm">Ocupación Camas</p>
          <p className="text-3xl font-bold mt-1">{averageOccupancy}%</p>
          <p className="text-xs text-purple-200 mt-2">{occupancyData[0].value}/{occupancyData.reduce((sum, item) => sum + item.value, 0)} ocupadas</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div className="flex items-center gap-1 text-sm text-orange-200">
              <ArrowUp size={16} />
              8.5%
            </div>
          </div>
          <p className="text-orange-100 text-sm">Satisfacción</p>
          <p className="text-3xl font-bold mt-1">89.5%</p>
          <p className="text-xs text-orange-200 mt-2">Promedio departamentos</p>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <LineChartIcon className="text-blue-600" size={24} />
              Ingresos vs Gastos
            </h2>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-sm">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                Ingresos
              </span>
              <span className="flex items-center gap-1 text-sm">
                <div className="w-3 h-3 bg-red-600 rounded"></div>
                Gastos
              </span>
              <span className="flex items-center gap-1 text-sm">
                <div className="w-3 h-3 bg-green-600 rounded"></div>
                Utilidad
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="ingresos" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="gastos" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Patient Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="text-purple-600" size={24} />
              Pacientes por Día
            </h2>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-sm">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                Nuevos
              </span>
              <span className="flex items-center gap-1 text-sm">
                <div className="w-3 h-3 bg-green-600 rounded"></div>
                Recurrentes
              </span>
              <span className="flex items-center gap-1 text-sm">
                <div className="w-3 h-3 bg-red-600 rounded"></div>
                Urgencias
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={patientStatsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '8px' }} />
              <Bar dataKey="nuevos" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="recurrentes" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="emergency" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>

        {/* Department Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Activity className="text-green-600" size={24} />
              Rendimiento por Departamento
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={departmentPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '8px' }} />
              <Bar dataKey="patients" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <PieChart className="text-orange-600" size={24} />
              Ocupación de Camas
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPie>
              <Pie
                data={occupancyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {occupancyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '8px' }} />
            </RechartsPie>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Performance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText className="text-purple-600" size={24} />
          Detalle por Departamento
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Pacientes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Satisfacción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {departmentPerformance.map((dept, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{dept.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{dept.pacientes}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            dept.satisfaccion >= 90 ? 'bg-green-500' :
                            dept.satisfaccion >= 80 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${dept.satisfaccion}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{dept.satisfaccion}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {dept.satisfaccion >= 90 ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle size={16} />
                        Excelente
                      </span>
                    ) : dept.satisfaccion >= 80 ? (
                      <span className="flex items-center gap-1 text-yellow-600">
                        <AlertCircle size={16} />
                        Bueno
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600">
                        <XCircle size={16} />
                        Mejorar
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue by Specialty */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <DollarSign className="text-green-600" size={24} />
          Ingresos por Especialidad
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {specialtyRevenue.map((specialty, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{specialty.name}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(specialty.value / 1000).toFixed(0)}K
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                <TrendingUp size={12} />
                <span>+5.2%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-6">Resumen Ejecutivo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-purple-100 text-sm mb-2">Desempeño Financiero</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Ingresos:</span>
                <span className="font-bold">${(totalRevenue / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Gastos:</span>
                <span className="font-bold">${(totalExpenses / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/20 pt-2">
                <span className="text-sm font-semibold">Utilidad Neta:</span>
                <span className="font-bold text-lg">${(totalProfit / 1000).toFixed(0)}K</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-purple-100 text-sm mb-2">Indicadores Operativos</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Ocupación:</span>
                <span className="font-bold">{averageOccupancy}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pacientes/día:</span>
                <span className="font-bold">{(totalPatients / 7).toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Satisfacción:</span>
                <span className="font-bold">89.5%</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-purple-100 text-sm mb-2">Tendencias</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Crecimiento:</span>
                <span className="font-bold text-green-300 flex items-center gap-1">
                  <ArrowUp size={14} />
                  {revenueGrowth}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Nuevos pacientes:</span>
                <span className="font-bold text-green-300 flex items-center gap-1">
                  <ArrowUp size={14} />
                  12%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Eficiencia:</span>
                <span className="font-bold text-green-300 flex items-center gap-1">
                  <ArrowUp size={14} />
                  8.5%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
