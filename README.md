# 🏥 Sistema de Gestión Hospitalaria

## 📋 Descripción
Sistema integral de gestión hospitalaria desarrollado con **React 19**, **Tauri 2.9**, **SQLite**, y **Tailwind CSS**. Ofrece una solución completa para la administración de hospitales con módulos para administradores, médicos, enfermeros y pacientes.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB.svg)
![Tauri](https://img.shields.io/badge/Tauri-2.9.2-FFC131.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## ✨ Características Principales

### 🔐 **Sistema de Autenticación**
- Login con hash SHA-256
- Registro de usuarios con validación
- Control de acceso basado en roles (Admin, Doctor, Enfermero, Paciente)
- Cambio de contraseña
- Recuperación de contraseña con tokens seguros
- Seguimiento de último inicio de sesión
- Activación/Desactivación de usuarios

### 👨‍💼 **Panel de Administración**
- Dashboard con estadísticas en tiempo real
- Gestión completa de usuarios (CRUD)
- Directorio de personal (médicos, enfermeros)
- Métricas del sistema (ocupación de camas, citas, rendimiento)
- Configuración del sistema
- Visualización de actividad reciente
- Gestión de departamentos

### 🩺 **Panel Médico (Doctores)**
- Vista de todos los pacientes asignados
- Creación de prescripciones con dosis y frecuencia
- Registro de diagnósticos y tratamientos
- Historial médico completo de pacientes
- Gráficas de tendencias de signos vitales (Recharts)
- Análisis de distribución de pacientes por condición
- Dashboard de análisis y estadísticas
- Acceso a resultados de laboratorio

### 👨‍⚕️ **Panel de Enfermería**
- Gestión de pacientes
- Registro de signos vitales
- Administración de tratamientos
- Notas de enfermería
- Programación de citas
- Vista de pruebas de laboratorio
- Búsqueda rápida de pacientes

### 👤 **Portal del Paciente**
- Ver información personal
- Historial médico
- Citas programadas
- Resultados de laboratorio
- Tratamientos activos
- Prescripciones

### 🔔 **Centro de Notificaciones**
- Notificaciones en tiempo real
- Contador de notificaciones no leídas
- Marcador de leído/no leído
- Eliminación de notificaciones
- Actualización automática cada 30 segundos
- Tipos: info, success, warning, error

### 🔍 **Sistema de Búsqueda Global**
- Búsqueda en tiempo real con debounce
- Busca en todas las entidades:
  - Pacientes (nombre, habitación, condición, tipo de sangre)
  - Citas (paciente, tipo, doctor)
  - Tratamientos (medicación, personal)
  - Pruebas de laboratorio (tipo, estado)
  - Historial médico (diagnóstico, doctor)
- Resultados instantáneos con iconos y categorías
- Navegación directa desde resultados

### 📊 **Visualización de Datos**
Integración con **Recharts** para gráficas interactivas:
- **Gráficas de líneas**: Tendencias de signos vitales
- **Gráficas de pastel**: Distribución de pacientes por condición
- **Gráficas de barras**: Ingresos mensuales, tipos de sangre
- Dashboard de análisis para doctores
- Estadísticas en tiempo real

### 🌓 **Modo Oscuro**
- Toggle de modo claro/oscuro
- Persistencia en localStorage
- Transiciones suaves
- Iconos Sol/Luna
- Compatibilidad con todos los componentes

### 📱 **Diseño Responsivo**
- Menú hamburguesa para móviles
- Diseño adaptativo con Tailwind CSS
- Optimizado para tablets y smartphones
- Navegación intuitiva en todos los dispositivos

### 🎨 **Interfaz Moderna**
- Glass morphism effects
- Gradientes animados (purple/blue/emerald/cyan)
- Animaciones suaves (fadeIn, slideIn, scaleIn)
- Badges de estado con gradientes
- Cards con efectos hover
- Loading skeletons
- Iconos de Lucide React

---

## 🗄️ Base de Datos - 28 Tablas

### **Tablas Principales**
1. **users** - Usuarios del sistema con roles y permisos
2. **patients** - Información completa de pacientes
3. **appointments** - Citas médicas
4. **treatments** - Tratamientos y medicaciones
5. **vital_signs** - Signos vitales (temperatura, presión, frecuencia cardíaca)
6. **lab_tests** - Pruebas de laboratorio
7. **medical_history** - Historial médico
8. **nurse_notes** - Notas de enfermería

### **Módulos Avanzados**
9. **notifications** - Sistema de notificaciones
10. **rooms** - Gestión de habitaciones y camas
11. **prescriptions** - Prescripciones médicas
12. **invoices** - Facturas
13. **invoice_items** - Líneas de factura
14. **pharmacy_inventory** - Inventario de farmacia
15. **emergency_cases** - Casos de emergencia con triage
16. **surgeries** - Programación de cirugías
17. **imaging_tests** - Radiología (X-ray, CT, MRI, Ultrasound)
18. **shifts** - Turnos del personal
19. **audit_logs** - Registro de auditoría
20. **password_reset_tokens** - Tokens de recuperación
21. **vaccinations** - Registro de vacunas
22. **referrals** - Referencias a especialistas
23. **consent_forms** - Formularios de consentimiento
24. **incident_reports** - Reportes de incidentes
25. **blood_inventory** - Banco de sangre
26. **medical_equipment** - Equipos médicos
27. **meal_orders** - Órdenes de comida

---

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- **React 19.1.1** - Framework de UI
- **Lucide React 0.548.0** - Biblioteca de iconos
- **Recharts 2.x** - Gráficas y visualizaciones
- **Tailwind CSS 4.1.16** - Framework CSS utility-first

### **Backend**
- **Tauri 2.9.3** - Framework de aplicaciones de escritorio
- **@tauri-apps/plugin-sql 2.0.0** - Plugin de SQLite
- **SQLite** - Base de datos local

### **Build Tools**
- **Vite 7.1.7** - Build tool y dev server
- **PostCSS 8.5.6** - Procesador CSS
- **ESLint 9.36.0** - Linter

---

## 📦 Instalación

### **Requisitos Previos**
- Node.js 18+ 
- Rust (para Tauri)
- npm o yarn

### **Pasos de Instalación**

1. **Clonar el repositorio**
```bash
git clone https://github.com/hectobyte1024/sistema-hospitalario.git
cd sistema-hospitalario
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run tauri dev
```

4. **Compilar para producción**
```bash
npm run tauri build
```

---

## 👥 Usuarios de Prueba

El sistema crea automáticamente usuarios por defecto:

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| `admin` | `admin123` | Administrador |
| `enfermero` | `enfermero123` | Enfermero |
| `paciente` | `paciente123` | Paciente |

---

## 📁 Estructura del Proyecto

```
sistema-hospitalario/
├── src/
│   ├── components/
│   │   ├── AdminDashboard.jsx      # Panel de administración
│   │   ├── DoctorDashboard.jsx     # Panel médico
│   │   ├── LoginForm.jsx           # Formulario de login
│   │   ├── RegisterForm.jsx        # Formulario de registro
│   │   ├── NotificationCenter.jsx  # Centro de notificaciones
│   │   └── SearchBar.jsx           # Barra de búsqueda global
│   ├── services/
│   │   ├── database.js             # 100+ funciones de BD
│   │   └── auth.js                 # Autenticación y seguridad
│   ├── hooks/
│   │   ├── useDatabase.js          # Hooks básicos
│   │   └── useAdvancedDatabase.js  # 15+ hooks avanzados
│   ├── App.jsx                     # Componente principal
│   ├── main.jsx                    # Punto de entrada
│   └── index.css                   # Estilos globales
├── src-tauri/                      # Configuración de Tauri
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🎯 Funcionalidades Implementadas

### ✅ **Completado (90+ características)**

#### **Autenticación & Seguridad**
- ✅ Login con validación
- ✅ Registro de usuarios
- ✅ Hash de contraseñas (SHA-256)
- ✅ Recuperación de contraseña
- ✅ Cambio de contraseña
- ✅ Control de acceso por roles
- ✅ Tokens de reset seguros
- ✅ Auditoría de accesos

#### **Gestión de Usuarios**
- ✅ CRUD completo de usuarios
- ✅ Roles: Admin, Doctor, Enfermero, Paciente
- ✅ Activación/Desactivación
- ✅ Último inicio de sesión
- ✅ Perfiles con foto y bio
- ✅ Departamentos y especializaciones

#### **Gestión de Pacientes**
- ✅ Información completa (edad, sangre, alergias)
- ✅ Contactos de emergencia
- ✅ Seguro médico
- ✅ Historial médico completo
- ✅ Signos vitales con gráficas
- ✅ Tratamientos activos
- ✅ Prescripciones

#### **Módulos Clínicos**
- ✅ Prescripciones médicas
- ✅ Diagnósticos y tratamientos
- ✅ Pruebas de laboratorio
- ✅ Signos vitales
- ✅ Notas de enfermería
- ✅ Citas médicas
- ✅ Cirugías programadas
- ✅ Radiología e imágenes

#### **Módulos Administrativos**
- ✅ Gestión de habitaciones y camas
- ✅ Facturación e invoices
- ✅ Inventario de farmacia
- ✅ Banco de sangre
- ✅ Equipos médicos
- ✅ Turnos del personal
- ✅ Órdenes de comida
- ✅ Referencias a especialistas

#### **Seguridad & Auditoría**
- ✅ Logs de auditoría
- ✅ Reportes de incidentes
- ✅ Formularios de consentimiento
- ✅ Vacunaciones

#### **UI/UX**
- ✅ Modo oscuro
- ✅ Búsqueda global
- ✅ Notificaciones en tiempo real
- ✅ Gráficas interactivas
- ✅ Diseño responsivo
- ✅ Glass morphism
- ✅ Animaciones suaves
- ✅ Loading states

---

## 🚀 Roadmap Futuro

### **Próximas Características**
- 📄 Exportación a PDF
- 📧 Integración de email (Nodemailer)
- 📱 SMS con Twilio
- 📅 Calendario interactivo
- 🔔 Notificaciones push
- 🌐 Multi-idioma (i18n)
- ♿ Mejoras de accesibilidad
- 📊 Más análisis y reportes
- 🔄 Sincronización en tiempo real (WebSockets)
- ☁️ Backup automático
- 📱 Aplicación móvil (React Native)
- 🎥 Telemedicina con video
- 🤖 IA para diagnóstico asistido

---

## 📊 Estadísticas del Proyecto

- **Líneas de Código**: 10,000+ líneas
- **Componentes React**: 20+ componentes
- **Funciones de BD**: 100+ operaciones CRUD
- **Hooks Personalizados**: 17 hooks
- **Tablas de BD**: 28 tablas
- **Características**: 90+ funcionalidades
- **Dependencias**: 15 packages principales

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**Hectobyte1024**
- GitHub: [@hectobyte1024](https://github.com/hectobyte1024)

---

## 🙏 Agradecimientos

- React Team por React 19
- Tauri Team por el framework de escritorio
- Lucide por los iconos increíbles
- Recharts por las visualizaciones
- Tailwind CSS por el framework CSS
- La comunidad Open Source

---

## 📞 Soporte

Si encuentras algún bug o tienes sugerencias:
- 🐛 Abre un issue en GitHub
- 📧 Contacta al desarrollador
- 💬 Participa en las discusiones

---

**⭐ Si te gusta el proyecto, dale una estrella en GitHub! ⭐**

---

Desarrollado con ❤️ usando React, Tauri y SQLite
