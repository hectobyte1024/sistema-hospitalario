import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initializeApp } from './hooks/useDatabase'

// Initialize database before rendering (with fallback)
initializeApp()
  .then(() => {
    console.log('✓ Database initialized successfully');
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    console.error('Error details:', err.message, err.stack);
    
    // Render app anyway with warning
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
            <h2 style={{ color: '#dc2626', margin: '0 0 8px 0' }}>⚠️ Error al iniciar la base de datos</h2>
            <p style={{ color: '#991b1b', margin: '0 0 8px 0' }}>{err.message || 'Error desconocido'}</p>
            <details style={{ color: '#7f1d1d', fontSize: '0.875rem' }}>
              <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>Ver detalles técnicos</summary>
              <pre style={{ background: '#fff', padding: '8px', borderRadius: '4px', overflow: 'auto' }}>
                {err.stack || JSON.stringify(err, null, 2)}
              </pre>
            </details>
          </div>
          <App />
        </div>
      </StrictMode>,
    )
  });
