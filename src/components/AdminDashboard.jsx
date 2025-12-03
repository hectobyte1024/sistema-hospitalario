import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Activity, Bed, DollarSign, Package, AlertTriangle, TrendingUp, Calendar, FileText, Settings } from 'lucide-react';
import { getAllUsers, getAllPatients, getAllAppointments, getAllRooms, getUsersByRole, deleteUser, deactivateUser } from '../services/database';

export default function AdminDashboard({ currentUser }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalNurses: 0,
    appointmentsToday: 0,
    occupiedBeds: 0,
    availableBeds: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, patientsData, appointmentsData, roomsData] = await Promise.all([
        getAllUsers(),
        getAllPatients(),
        getAllAppointments(),
        getAllRooms()
      ]);

      setUsers(usersData);
      setPatients(patientsData);
      setAppointments(appointmentsData);
      setRooms(roomsData);

      // Calculate statistics
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointmentsData.filter(apt => apt.date === today);
      const doctors = usersData.filter(u => u.role === 'doctor');
      const nurses = usersData.filter(u => u.role === 'nurse');
      const totalBeds = roomsData.reduce((sum, room) => sum + room.bed_count, 0);
      const occupiedBeds = roomsData.reduce((sum, room) => sum + room.occupied_beds, 0);

      setStats({
        totalUsers: usersData.length,
        totalPatients: patientsData.length,
        totalDoctors: doctors.length,
        totalNurses: nurses.length,
        appointmentsToday: todayAppointments.length,
        occupiedBeds: occupiedBeds,
        availableBeds: totalBeds - occupiedBeds,
        revenue: 125000 // Mock data
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('¿Está seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }
    
    try {
      await deleteUser(userId);
      alert('Usuario eliminado exitosamente');
      await loadData();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error al eliminar usuario');
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (!confirm('¿Desea desactivar este usuario?')) {
      return;
    }
    
    try {
      await deactivateUser(userId);
      alert('Usuario desactivado exitosamente');
      await loadData();
    } catch (error) {
      console.error('Error deactivating user:', error);
      alert('Error al desactivar usuario');
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <div className="glass-effect p-6 rounded-2xl border-2 border-white/30 hover:shadow-xl transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-1">{label}</p>
          <p className={`text-3xl font-black bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
            {value}
          </p>
          {trend && (
            <p className="text-xs text-green-600 font-semibold mt-2 flex items-center">
              <TrendingUp size={14} className="mr-1" />
              +12% vs last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-10`}>
          <Icon className="text-gray-700" size={24} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="spinner mb-4 w-12 h-12 border-4 mx-auto"></div>
          <p className="text-gray-600 font-semibold">Cargando panel administrativo...</p>
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
            <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Panel Administrativo
            </h1>
            <p className="text-gray-600 font-semibold">Gestión integral del sistema hospitalario</p>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
            <Shield className="text-purple-600" size={20} />
            <span className="font-bold text-purple-900">{currentUser.name}</span>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Usuarios"
          value={stats.totalUsers}
          color="from-purple-600 to-blue-600"
          trend={true}
        />
        <StatCard
          icon={Activity}
          label="Pacientes Activos"
          value={stats.totalPatients}
          color="from-emerald-600 to-cyan-600"
          trend={true}
        />
        <StatCard
          icon={Calendar}
          label="Citas Hoy"
          value={stats.appointmentsToday}
          color="from-orange-600 to-amber-600"
        />
        <StatCard
          icon={Bed}
          label="Camas Ocupadas"
          value={`${stats.occupiedBeds}/${stats.occupiedBeds + stats.availableBeds}`}
          color="from-pink-600 to-rose-600"
        />
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 glass-effect p-2 rounded-xl border-2 border-white/30">
        {[
          { id: 'overview', label: 'Vista General', icon: Activity },
          { id: 'users', label: 'Usuarios', icon: Users },
          { id: 'staff', label: 'Personal', icon: Shield },
          { id: 'settings', label: 'Configuración', icon: Settings }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Sections */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="glass-effect p-6 rounded-2xl border-2 border-white/30">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Activity className="mr-2 text-purple-600" size={24} />
              Actividad Reciente
            </h3>
            <div className="space-y-3">
              {users.slice(0, 5).map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Nunca'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="glass-effect p-6 rounded-2xl border-2 border-white/30">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <AlertTriangle className="mr-2 text-amber-600" size={24} />
              Estado del Sistema
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">Capacidad de Camas</span>
                  <span className="text-sm font-bold text-purple-600">
                    {Math.round((stats.occupiedBeds / (stats.occupiedBeds + stats.availableBeds)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${(stats.occupiedBeds / (stats.occupiedBeds + stats.availableBeds)) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">Personal Activo</span>
                  <span className="text-sm font-bold text-emerald-600">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 h-2 rounded-full w-[85%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">Rendimiento del Sistema</span>
                  <span className="text-sm font-bold text-green-600">98%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full w-[98%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glass-effect p-6 rounded-2xl border-2 border-white/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold flex items-center">
              <Users className="mr-2 text-purple-600" size={28} />
              Gestión de Usuarios
            </h3>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center">
              <UserPlus className="mr-2" size={20} />
              Nuevo Usuario
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-blue-50">
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Usuario</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Rol</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Teléfono</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Último Acceso</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} className={`border-b border-gray-100 hover:bg-purple-50/50 transition ${index % 2 === 0 ? 'bg-white/50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-500">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'doctor' ? 'bg-blue-100 text-blue-700' :
                        user.role === 'nurse' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.phone || '-'}</td>
                    <td className="px-6 py-4">
                      {user.is_active ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Activo</span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Inactivo</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Nunca'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeactivateUser(user.id)}
                          className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-semibold hover:bg-yellow-200 transition"
                        >
                          Desactivar
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 transition"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-effect p-6 rounded-2xl border-2 border-white/30">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Shield className="mr-2 text-blue-600" size={24} />
              Médicos ({stats.totalDoctors})
            </h3>
            <div className="space-y-3">
              {users.filter(u => u.role === 'doctor').map(doctor => (
                <div key={doctor.id} className="p-4 bg-white/50 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{doctor.name}</p>
                    <p className="text-xs text-gray-500">{doctor.specialization || 'Medicina General'}</p>
                  </div>
                  <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold">
                    {doctor.department || 'General'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-effect p-6 rounded-2xl border-2 border-white/30">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Activity className="mr-2 text-emerald-600" size={24} />
              Enfermeros ({stats.totalNurses})
            </h3>
            <div className="space-y-3">
              {users.filter(u => u.role === 'nurse').map(nurse => (
                <div key={nurse.id} className="p-4 bg-white/50 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{nurse.name}</p>
                    <p className="text-xs text-gray-500">Enfermería</p>
                  </div>
                  <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-bold">
                    {nurse.department || 'General'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="glass-effect p-6 rounded-2xl border-2 border-white/30">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <Settings className="mr-2 text-purple-600" size={28} />
            Configuración del Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white/50 rounded-xl">
              <h4 className="font-bold text-lg mb-4">General</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Hospital</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Hospital General"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Dirección</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Calle Principal #123"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-white/50 rounded-xl">
              <h4 className="font-bold text-lg mb-4">Notificaciones</h4>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Alertas de Email</span>
                  <input type="checkbox" className="w-5 h-5 text-purple-600" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Alertas SMS</span>
                  <input type="checkbox" className="w-5 h-5 text-purple-600" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Recordatorios de Citas</span>
                  <input type="checkbox" className="w-5 h-5 text-purple-600" defaultChecked />
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
              Guardar Cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
