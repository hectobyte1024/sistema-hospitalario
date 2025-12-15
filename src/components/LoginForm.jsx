import React, { useState } from 'react';
import { Activity, Key, ArrowLeft } from 'lucide-react';
import { login as authLogin, recoverPasswordByLicense } from '../services/auth';

export default function LoginForm({ onLoginSuccess, onBackToHome }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  
  // Recovery form states
  const [licenseNumber, setLicenseNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🎯 Login form submitted!');
    console.log('📝 Username:', username);
    console.log('📝 Password length:', password.length);
    setError('');
    setIsLoading(true);

    try {
      console.log('🔄 Calling authLogin function...');
      const user = await authLogin(username, password);
      console.log('✅ Login successful! User:', user);
      console.log('🔄 Calling onLoginSuccess...');
      onLoginSuccess(user);
      setUsername('');
      setPassword('');
    } catch (err) {
      console.error('❌ Login failed:', err);
      console.error('❌ Error message:', err.message);
      console.error('❌ Error stack:', err.stack);
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
      console.log('🏁 Login process completed');
    }
  };

  const handleRecoverySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRecoverySuccess(null);
    setIsLoading(true);

    try {
      // Validate passwords match
      if (newPassword !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      // Attempt recovery
      const result = await recoverPasswordByLicense(licenseNumber, newPassword);
      
      setRecoverySuccess({
        message: result.message,
        username: result.username,
        name: result.name
      });
      
      // Clear form
      setLicenseNumber('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Auto return to login after 4 seconds
      setTimeout(() => {
        setShowRecovery(false);
        setRecoverySuccess(null);
      }, 4000);
      
    } catch (err) {
      console.error('❌ Recovery failed:', err);
      setError(err.message || 'Error al recuperar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowRecovery(false);
    setError('');
    setRecoverySuccess(null);
    setLicenseNumber('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 flex items-center justify-center p-6"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.3), transparent 50%)'
      }}
      onClick={showRecovery ? undefined : onBackToHome}
    >
      <div 
        className="glass-effect p-16 md:p-20 rounded-[3rem] shadow-2xl max-w-4xl w-full animate-scaleIn border-4 border-white/20 relative overflow-hidden backdrop-blur-2xl"
        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 100px rgba(139, 92, 246, 0.3)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <div className="relative inline-block mb-10">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full blur-3xl opacity-70 animate-pulse"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <Activity className="text-purple-600" size={96} />
              </div>
            </div>
            <h2 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                {showRecovery ? 'Recuperación' : 'Bienvenido'}
              </span>
            </h2>
            <p className="text-white font-bold text-3xl mb-3 drop-shadow-lg">🏥 Hospital San Rafael</p>
            <p className="text-blue-200 text-2xl font-medium">
              {showRecovery ? '🔑 Recuperar Contraseña' : '✨ Sistema de Gestión Hospitalaria'}
            </p>
            <div className="mt-6 w-40 h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mx-auto rounded-full shadow-lg"></div>
          </div>
        
          {error && (
            <div className="mb-10 p-8 bg-gradient-to-r from-red-600 to-red-700 border-l-[12px] border-red-900 rounded-3xl animate-slideInLeft shadow-2xl transform hover:scale-105 transition-transform">
              <p className="text-2xl text-white font-bold flex items-center gap-4">
                <span className="text-4xl">❌</span>
                {error}
              </p>
            </div>
          )}

          {recoverySuccess && (
            <div className="mb-10 p-8 bg-gradient-to-r from-green-600 to-emerald-700 border-l-[12px] border-green-900 rounded-3xl shadow-2xl animate-slideInLeft transform hover:scale-105 transition-transform">
              <p className="text-2xl text-white font-bold mb-3 flex items-center gap-4">
                <span className="text-4xl">✅</span>
                {recoverySuccess.message}
              </p>
              <p className="text-white text-xl">Usuario: <strong className="text-2xl">{recoverySuccess.username}</strong></p>
              <p className="text-white text-xl">Enfermero(a): <strong className="text-2xl">{recoverySuccess.name}</strong></p>
              <p className="text-lg text-green-200 mt-3">⏳ Redirigiendo al login...</p>
            </div>
          )}

          {/* Recovery Form */}
          {showRecovery ? (
            <form onSubmit={handleRecoverySubmit} className="space-y-10">
              <div>
                <label htmlFor="licenseNumber" className="block text-3xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="text-4xl">📋</span>
                  Cédula Profesional
                </label>
                <input
                  id="licenseNumber"
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full px-8 py-6 bg-white/95 border-4 border-white/40 rounded-3xl focus:ring-6 focus:ring-green-400 focus:border-green-400 transition-all shadow-2xl hover:shadow-3xl text-2xl font-medium"
                  placeholder="Ej: 1234567"
                  required
                  disabled={isLoading}
                  autoComplete="off"
                />
                <p className="text-lg text-blue-200 mt-3 ml-2">
                  💡 Ingrese su número de cédula profesional de enfermería
                </p>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-3xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="text-4xl">🔒</span>
                  Nueva Contraseña
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-8 py-6 bg-white/95 border-4 border-white/40 rounded-3xl focus:ring-6 focus:ring-green-400 focus:border-green-400 transition-all shadow-2xl hover:shadow-3xl text-2xl font-medium"
                  placeholder="Mínimo 6 caracteres"
                  required
                  disabled={isLoading}
                  autoComplete="off"
                  minLength="6"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-3xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="text-4xl">✅</span>
                  Confirmar Contraseña
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-8 py-6 bg-white/95 border-4 border-white/40 rounded-3xl focus:ring-6 focus:ring-green-400 focus:border-green-400 transition-all shadow-2xl hover:shadow-3xl text-2xl font-medium"
                  placeholder="Repita la contraseña"
                  required
                  disabled={isLoading}
                  autoComplete="off"
                  minLength="6"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-8 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-3xl hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 transition-all font-bold text-3xl shadow-2xl hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden transform hover:scale-105 active:scale-95"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-4">
                    <div className="spinner mr-3 w-9 h-9 border-4"></div>
                    Procesando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-4">
                    <Key size={36} />
                    Recuperar Contraseña
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={handleBackToLogin}
                disabled={isLoading}
                className="w-full py-6 text-white hover:text-purple-200 transition font-bold text-2xl hover:bg-white/20 rounded-3xl border-4 border-white/30 hover:border-white/60 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <ArrowLeft size={32} />
                Volver al Login
              </button>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleSubmit} className="space-y-10">
              <div>
                <label htmlFor="username" className="block text-3xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="text-4xl">👤</span>
                  Usuario
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-8 py-6 bg-white/95 border-4 border-white/40 rounded-3xl focus:ring-6 focus:ring-purple-400 focus:border-purple-400 transition-all shadow-2xl hover:shadow-3xl text-2xl font-medium"
                  placeholder="Ingrese su nombre de usuario"
                  required
                  disabled={isLoading}
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-3xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="text-4xl">🔐</span>
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-8 py-6 bg-white/95 border-4 border-white/40 rounded-3xl focus:ring-6 focus:ring-purple-400 focus:border-purple-400 transition-all shadow-2xl hover:shadow-3xl text-2xl font-medium"
                  placeholder="Ingrese su contraseña"
                  required
                  disabled={isLoading}
                  autoComplete="off"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-8 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-3xl hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all font-bold text-3xl shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden transform hover:scale-105 active:scale-95"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-4">
                    <div className="spinner mr-3 w-9 h-9 border-4"></div>
                    Iniciando sesión...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-4">
                    <span className="text-4xl">🚀</span>
                    Iniciar Sesión
                  </span>
                )}
              </button>

              {/* Recovery Link */}
              <button
                type="button"
                onClick={() => setShowRecovery(true)}
                className="w-full text-white hover:text-green-300 transition font-bold text-2xl underline decoration-4 underline-offset-8 hover:scale-105 transform py-4"
              >
                ¿Olvidaste tu contraseña? 🔑 Recupérala aquí
              </button>

              <div className="mt-12 p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border-4 border-white/20 shadow-2xl">
                <p className="text-2xl text-white font-bold mb-6 flex items-center gap-3">
                  <span className="w-4 h-4 bg-purple-400 rounded-full animate-pulse"></span>
                  👥 Usuarios de Prueba
                </p>
                <div className="space-y-4 text-lg text-white">
                  <div className="flex items-center bg-gradient-to-r from-white/20 to-white/10 p-6 rounded-2xl hover:from-white/30 hover:to-white/20 transition cursor-pointer transform hover:scale-105 shadow-lg">
                    <span className="mr-4 text-4xl">👨‍⚕️</span>
                    <div>
                      <strong className="text-white block text-2xl mb-1">Enfermero</strong>
                      <span className="text-blue-200 text-lg font-mono">enfermero / enfermero123</span>
                    </div>
                  </div>
                  <div className="flex items-center bg-gradient-to-r from-white/20 to-white/10 p-6 rounded-2xl hover:from-white/30 hover:to-white/20 transition cursor-pointer transform hover:scale-105 shadow-lg">
                    <span className="mr-4 text-4xl">👤</span>
                    <div>
                      <strong className="text-white block text-2xl mb-1">Paciente</strong>
                      <span className="text-blue-200 text-lg font-mono">paciente / paciente123</span>
                    </div>
                  </div>
                  <div className="flex items-center bg-gradient-to-r from-white/20 to-white/10 p-6 rounded-2xl hover:from-white/30 hover:to-white/20 transition cursor-pointer transform hover:scale-105 shadow-lg">
                    <span className="mr-4 text-4xl">🔐</span>
                    <div>
                      <strong className="text-white block text-2xl mb-1">Admin</strong>
                      <span className="text-blue-200 text-lg font-mono">admin / admin123</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={onBackToHome}
                type="button"
                className="w-full mt-10 py-6 text-white hover:text-purple-200 transition font-bold text-2xl hover:bg-white/20 rounded-3xl border-4 border-white/30 hover:border-white/60 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <span className="text-3xl">←</span>
                Volver al inicio
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
