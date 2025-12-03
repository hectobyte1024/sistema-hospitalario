import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User, Calendar, Pill, TestTube, FileText, Bed } from 'lucide-react';

export default function SearchBar({ onSearch, placeholder = "Buscar pacientes, citas, tratamientos..." }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      // Import database functions dynamically
      const { 
        getAllPatients, 
        getAllAppointments, 
        getAllTreatments,
        getAllLabTests,
        getAllMedicalHistory,
        getAllNurseNotes
      } = await import('../services/database');

      const [patients, appointments, treatments, labTests, history, notes] = await Promise.all([
        getAllPatients(),
        getAllAppointments(),
        getAllTreatments(),
        getAllLabTests(),
        getAllMedicalHistory(),
        getAllNurseNotes()
      ]);

      const lowercaseQuery = searchQuery.toLowerCase();
      
      // Search patients
      const patientResults = patients
        .filter(p => 
          p.name.toLowerCase().includes(lowercaseQuery) ||
          p.room.toLowerCase().includes(lowercaseQuery) ||
          p.condition.toLowerCase().includes(lowercaseQuery) ||
          p.blood_type.toLowerCase().includes(lowercaseQuery)
        )
        .map(p => ({
          type: 'patient',
          id: p.id,
          title: p.name,
          subtitle: `Habitación ${p.room} • ${p.condition}`,
          icon: User,
          data: p
        }));

      // Search appointments
      const appointmentResults = appointments
        .filter(a => 
          a.patient_name.toLowerCase().includes(lowercaseQuery) ||
          a.type.toLowerCase().includes(lowercaseQuery) ||
          (a.doctor && a.doctor.toLowerCase().includes(lowercaseQuery))
        )
        .map(a => ({
          type: 'appointment',
          id: a.id,
          title: `Cita: ${a.patient_name}`,
          subtitle: `${a.date} • ${a.type}`,
          icon: Calendar,
          data: a
        }));

      // Search treatments
      const treatmentResults = treatments
        .filter(t => 
          t.medication.toLowerCase().includes(lowercaseQuery) ||
          t.applied_by.toLowerCase().includes(lowercaseQuery)
        )
        .map(t => ({
          type: 'treatment',
          id: t.id,
          title: `Tratamiento: ${t.medication}`,
          subtitle: `${t.dose} • ${t.frequency}`,
          icon: Pill,
          data: t
        }));

      // Search lab tests
      const labTestResults = labTests
        .filter(l => 
          l.test.toLowerCase().includes(lowercaseQuery) ||
          l.status.toLowerCase().includes(lowercaseQuery) ||
          l.ordered_by.toLowerCase().includes(lowercaseQuery)
        )
        .map(l => ({
          type: 'labTest',
          id: l.id,
          title: `Prueba: ${l.test}`,
          subtitle: `${l.date} • ${l.status}`,
          icon: TestTube,
          data: l
        }));

      // Search medical history
      const historyResults = history
        .filter(h => 
          h.diagnosis.toLowerCase().includes(lowercaseQuery) ||
          h.treatment.toLowerCase().includes(lowercaseQuery) ||
          h.doctor.toLowerCase().includes(lowercaseQuery)
        )
        .map(h => ({
          type: 'history',
          id: h.id,
          title: `Diagnóstico: ${h.diagnosis}`,
          subtitle: `${h.date} • Dr. ${h.doctor}`,
          icon: FileText,
          data: h
        }));

      // Combine all results (limit to top 10)
      const allResults = [
        ...patientResults,
        ...appointmentResults,
        ...treatmentResults,
        ...labTestResults,
        ...historyResults
      ].slice(0, 10);

      setResults(allResults);
      setIsOpen(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce search
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleResultClick = (result) => {
    if (onSearch) {
      onSearch(result);
    }
    setIsOpen(false);
    setQuery('');
  };

  const getTypeLabel = (type) => {
    const labels = {
      patient: 'Paciente',
      appointment: 'Cita',
      treatment: 'Tratamiento',
      labTest: 'Prueba de Lab',
      history: 'Historial'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      patient: 'from-blue-500 to-cyan-500',
      appointment: 'from-purple-500 to-pink-500',
      treatment: 'from-emerald-500 to-green-500',
      labTest: 'from-amber-500 to-orange-500',
      history: 'from-indigo-500 to-violet-500'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 bg-white/90 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md font-medium"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        )}
        {loading && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <div className="spinner w-5 h-5 border-2"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full glass-effect rounded-2xl shadow-2xl border-2 border-white/30 z-50 animate-scaleIn overflow-hidden max-h-96 overflow-y-auto">
          <div className="p-2">
            <p className="text-xs text-gray-500 font-semibold px-3 py-2">
              {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {results.map((result, index) => {
              const Icon = result.icon;
              return (
                <div
                  key={`${result.type}-${result.id}-${index}`}
                  onClick={() => handleResultClick(result)}
                  className="p-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 cursor-pointer transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${getTypeColor(result.type)} flex-shrink-0`}>
                      <Icon className="text-white" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-semibold">
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {result.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {result.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query && !loading && results.length === 0 && (
        <div className="absolute top-full mt-2 w-full glass-effect rounded-2xl shadow-2xl border-2 border-white/30 z-50 p-8 text-center">
          <Search size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-600 font-semibold">No se encontraron resultados</p>
          <p className="text-xs text-gray-400 mt-1">Intenta con otros términos de búsqueda</p>
        </div>
      )}
    </div>
  );
}
