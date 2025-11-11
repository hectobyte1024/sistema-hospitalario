import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { login as authLogin } from '../services/auth';

export default function LoginForm({ onLoginSuccess, onBackToHome }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await authLogin(username, password);
      onLoginSuccess(user);
      setUsername('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onBackToHome}
    >
      <div 
        className="glass-effect p-8 md:p-10 rounded-3xl shadow-2xl max-w-md w-full animate-scaleIn border-2 border-white/30 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-5">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-2xl opacity-60 animate-pulse"></div>
              <div className="relative bg-white p-4 rounded-2xl shadow-lg">
                <Activity className="text-purple-600" size={48} />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-2">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Bienvenido
              </span>
            </h2>
            <p className="text-gray-700 font-semibold text-lg">Hospital San Rafael</p>
            <div className="mt-3 w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
        
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-slideInLeft">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                placeholder="Ingrese su usuario"
                required
                disabled={isLoading}
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                placeholder="Ingrese su contraseña"
                required
                disabled={isLoading}
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="spinner mr-2 w-5 h-5 border-2"></div>
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="mt-6 p-5 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-100">
            <p className="text-xs text-gray-700 font-bold mb-3 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Usuarios de prueba
            </p>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center bg-white/50 p-2 rounded-lg">
                <span className="mr-2">👨‍⚕️</span>
                <div>
                  <strong className="text-gray-800">Enfermero:</strong> enfermero / enfermero123
                </div>
              </div>
              <div className="flex items-center bg-white/50 p-2 rounded-lg">
                <span className="mr-2">👤</span>
                <div>
                  <strong className="text-gray-800">Paciente:</strong> paciente / paciente123
                </div>
              </div>
              <div className="flex items-center bg-white/50 p-2 rounded-lg">
                <span className="mr-2">🔐</span>
                <div>
                  <strong className="text-gray-800">Admin:</strong> admin / admin123
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onBackToHome}
            className="w-full mt-6 py-3 text-gray-600 hover:text-purple-600 transition font-medium hover:bg-white/50 rounded-xl"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
