import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, User, MapPin, Plus, Edit2, Trash2, X, Check, Filter, Search } from 'lucide-react';
import { useAppointments } from '../hooks/useDatabase';

export default function AppointmentCalendar({ currentUser }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, week, day
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [filterDoctor, setFilterDoctor] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { appointments, loading, createAppointment, updateAppointment, deleteAppointment } = useAppointments();

  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    type: 'Consulta General',
    date: '',
    time: '',
    duration: 30,
    room: '',
    notes: '',
    status: 'Programada'
  });

  const appointmentTypes = [
    'Consulta General',
    'Cardiología',
    'Pediatría',
    'Neurología',
    'Dermatología',
    'Oftalmología',
    'Traumatología',
    'Ginecología',
    'Psiquiatría',
    'Radiología'
  ];

  const statusColors = {
    'Programada': 'bg-blue-500',
    'Confirmada': 'bg-green-500',
    'Completada': 'bg-gray-500',
    'Cancelada': 'bg-red-500',
    'En Curso': 'bg-yellow-500'
  };

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getAppointmentsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateString);
  };

  const getAppointmentsForTime = (date, hour) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(apt => {
      if (apt.date !== dateString) return false;
      const aptHour = parseInt(apt.time.split(':')[0]);
      return aptHour === hour;
    });
  };

  const handlePreviousPeriod = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNextPeriod = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, date: date.toISOString().split('T')[0] }));
    setShowModal(true);
  };

  const handleSaveAppointment = async () => {
    try {
      if (editingAppointment) {
        await updateAppointment(editingAppointment.id, formData);
      } else {
        await createAppointment({
          ...formData,
          patientId: currentUser?.type === 'patient' ? currentUser.id : null,
          doctorId: null, // Would need to look up doctor ID
          createdBy: currentUser?.id
        });
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handleEditAppointment = (apt) => {
    setEditingAppointment(apt);
    setFormData({
      patientName: apt.patientName || '',
      doctorName: apt.doctor || '',
      type: apt.type || 'Consulta General',
      date: apt.date || '',
      time: apt.time || '',
      duration: apt.duration || 30,
      room: apt.room || '',
      notes: apt.notes || '',
      status: apt.status || 'Programada'
    });
    setShowModal(true);
  };

  const handleDeleteAppointment = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta cita?')) {
      await deleteAppointment(id);
    }
  };

  const resetForm = () => {
    setEditingAppointment(null);
    setFormData({
      patientName: '',
      doctorName: '',
      type: 'Consulta General',
      date: '',
      time: '',
      duration: 30,
      room: '',
      notes: '',
      status: 'Programada'
    });
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filterDoctor !== 'all' && apt.doctor !== filterDoctor) return false;
    if (filterType !== 'all' && apt.type !== filterType) return false;
    if (searchQuery && !apt.patientName?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const uniqueDoctors = [...new Set(appointments.map(apt => apt.doctor).filter(Boolean))];

  // Render Month View
  const renderMonthView = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
    const weeks = [];
    let days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700"></div>);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayAppointments = getAppointmentsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(date)}
          className={`h-24 border border-gray-200 dark:border-gray-700 p-2 cursor-pointer transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 overflow-hidden ${
            isToday ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-500' : 'bg-white dark:bg-gray-800'
          }`}
        >
          <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayAppointments.slice(0, 2).map(apt => (
              <div
                key={apt.id}
                className={`text-xs px-1 py-0.5 rounded text-white truncate ${statusColors[apt.status] || 'bg-gray-500'}`}
              >
                {apt.time} - {apt.patientName}
              </div>
            ))}
            {dayAppointments.length > 2 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">+{dayAppointments.length - 2} más</div>
            )}
          </div>
        </div>
      );

      if ((startingDayOfWeek + day) % 7 === 0 || day === daysInMonth) {
        weeks.push(
          <div key={`week-${weeks.length}`} className="grid grid-cols-7">
            {days}
          </div>
        );
        days = [];
      }
    }

    return <div className="space-y-0">{weeks}</div>;
  };

  // Render Week View
  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 9 PM

    return (
      <div className="overflow-auto">
        <div className="min-w-[800px]">
          {/* Header with days */}
          <div className="grid grid-cols-8 bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10">
            <div className="p-3 border border-gray-200 dark:border-gray-700"></div>
            {weekDays.map(day => (
              <div key={day.toISOString()} className={`p-3 border border-gray-200 dark:border-gray-700 text-center ${
                day.toDateString() === new Date().toDateString() ? 'bg-blue-100 dark:bg-blue-900/40' : ''
              }`}>
                <div className="text-xs text-gray-600 dark:text-gray-400">{day.toLocaleDateString('es-ES', { weekday: 'short' })}</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{day.getDate()}</div>
              </div>
            ))}
          </div>

          {/* Time slots */}
          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-8">
              <div className="p-3 border border-gray-200 dark:border-gray-700 text-right text-sm text-gray-600 dark:text-gray-400">
                {hour}:00
              </div>
              {weekDays.map(day => {
                const appointments = getAppointmentsForTime(day, hour);
                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className="p-1 border border-gray-200 dark:border-gray-700 min-h-[60px] bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                    onClick={() => {
                      const date = new Date(day);
                      date.setHours(hour);
                      handleDateClick(date);
                    }}
                  >
                    {appointments.map(apt => (
                      <div
                        key={apt.id}
                        className={`text-xs p-1 rounded mb-1 text-white ${statusColors[apt.status] || 'bg-gray-500'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAppointment(apt);
                        }}
                      >
                        <div className="font-semibold">{apt.patientName}</div>
                        <div>{apt.type}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Day View
  const renderDayView = () => {
    const hours = Array.from({ length: 14 }, (_, i) => i + 7);

    return (
      <div className="space-y-2">
        {hours.map(hour => {
          const appointments = getAppointmentsForTime(currentDate, hour);
          return (
            <div key={hour} className="flex gap-4">
              <div className="w-20 text-right text-sm font-semibold text-gray-600 dark:text-gray-400 pt-2">
                {hour}:00
              </div>
              <div className="flex-1 min-h-[80px] border-2 border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800 hover:border-blue-400 cursor-pointer transition-colors"
                   onClick={() => {
                     const date = new Date(currentDate);
                     date.setHours(hour);
                     handleDateClick(date);
                   }}>
                {appointments.length > 0 ? (
                  <div className="space-y-2">
                    {appointments.map(apt => (
                      <div
                        key={apt.id}
                        className={`p-3 rounded-lg text-white ${statusColors[apt.status] || 'bg-gray-500'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAppointment(apt);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold">{apt.time} - {apt.patientName}</div>
                            <div className="text-sm opacity-90">{apt.type}</div>
                            {apt.doctor && <div className="text-sm opacity-90">Dr. {apt.doctor}</div>}
                          </div>
                          <div className="flex gap-1">
                            <button className="p-1 hover:bg-white/20 rounded" onClick={(e) => { e.stopPropagation(); handleEditAppointment(apt); }}>
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-1 hover:bg-white/20 rounded" onClick={(e) => { e.stopPropagation(); handleDeleteAppointment(apt.id); }}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 dark:text-gray-600 text-sm">Sin citas programadas</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-4 border-blue-200">
          <h1 className="text-5xl md:text-6xl font-bold text-white flex items-center gap-4">
            <div className="bg-white/20 p-5 rounded-2xl backdrop-blur-xl">
              <CalendarIcon className="w-16 h-16 text-white" />
            </div>
            Calendario de Citas
          </h1>
          <p className="text-blue-100 mt-4 text-2xl font-medium">
            📝 Gestiona y programa citas médicas
          </p>
        </div>

        <div className="bg-gradient-to-br from-white via-blue-50/30 to-white dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.3)] border-4 border-blue-200 dark:border-gray-700/20 overflow-hidden">
          {/* Controls */}
          <div className="p-8 border-b-4 border-blue-200 dark:border-gray-700 space-y-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              {/* Navigation */}
              <div className="flex items-center gap-4">
                <button onClick={handlePreviousPeriod} className="p-4 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:scale-105 bg-white border-4 border-blue-200">
                  <ChevronLeft className="w-7 h-7 text-blue-600" />
                </button>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white min-w-[280px] text-center bg-white px-8 py-4 rounded-2xl shadow-xl border-4 border-purple-200">
                  {view === 'month' && currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                  {view === 'week' && `Semana del ${currentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`}
                  {view === 'day' && currentDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <button onClick={handleNextPeriod} className="p-4 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:scale-105 bg-white border-4 border-blue-200">
                  <ChevronRight className="w-7 h-7 text-blue-600" />
                </button>
                <button onClick={handleToday} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl transition-all text-xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105">
                  📅 Hoy
                </button>
              </div>

              {/* View Toggle & New Appointment */}
              <div className="flex items-center gap-2">
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setView('month')}
                    className={`px-4 py-2 rounded-lg transition-colors ${view === 'month' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                  >
                    Mes
                  </button>
                  <button
                    onClick={() => setView('week')}
                    className={`px-4 py-2 rounded-lg transition-colors ${view === 'week' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                  >
                    Semana
                  </button>
                  <button
                    onClick={() => setView('day')}
                    className={`px-4 py-2 rounded-lg transition-colors ${view === 'day' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                  >
                    Día
                  </button>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Nueva Cita
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar paciente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterDoctor}
                onChange={(e) => setFilterDoctor(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los doctores</option>
                {uniqueDoctors.map(doctor => (
                  <option key={doctor} value={doctor}>{doctor}</option>
                ))}
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las especialidades</option>
                {appointmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Calendar View */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {view === 'month' && (
                  <>
                    <div className="grid grid-cols-7 bg-gray-100 dark:bg-gray-900/50 mb-2">
                      {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                        <div key={day} className="p-3 text-center font-semibold text-gray-700 dark:text-gray-300">
                          {day}
                        </div>
                      ))}
                    </div>
                    {renderMonthView()}
                  </>
                )}
                {view === 'week' && renderWeekView()}
                {view === 'day' && renderDayView()}
              </>
            )}
          </div>
        </div>

        {/* Appointment Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingAppointment ? 'Editar Cita' : 'Nueva Cita'}
                </h3>
                <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre del Paciente *
                    </label>
                    <input
                      type="text"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Doctor
                    </label>
                    <input
                      type="text"
                      value={formData.doctorName}
                      onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tipo de Cita *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      {appointmentTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Estado
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Programada">Programada</option>
                      <option value="Confirmada">Confirmada</option>
                      <option value="En Curso">En Curso</option>
                      <option value="Completada">Completada</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fecha *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hora *
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duración (minutos)
                    </label>
                    <input
                      type="number"
                      min="15"
                      step="15"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sala/Consultorio
                    </label>
                    <input
                      type="text"
                      value={formData.room}
                      onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: Consultorio 3"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notas
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Notas adicionales sobre la cita..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveAppointment}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    {editingAppointment ? 'Actualizar' : 'Guardar'}
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
