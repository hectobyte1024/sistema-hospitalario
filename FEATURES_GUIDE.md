# 🎉 Sistema Hospitalario - Guía Completa de Funcionalidades

## 📱 Acceso Rápido - Barra de Navegación

### **Desktop**
- **🏠 Logo**: Click para volver al Dashboard
- **🔍 Búsqueda Global**: Busca en todas las entidades (pacientes, citas, tratamientos, etc.)
- **📅 Calendario**: Gestión de citas médicas
- **💊 Farmacia**: Control de inventario de medicamentos
- **🚨 Emergencias**: Sistema de triage y gestión de urgencias
- **⚙️ Configuración**: Ajustes del sistema
- **🌙 Modo Oscuro**: Toggle claro/oscuro
- **🔔 Notificaciones**: Centro de notificaciones en tiempo real
- **👤 Perfil**: Acceso a perfil de usuario
- **🚪 Cerrar Sesión**: Salir del sistema

### **Mobile**
Menú hamburguesa con acceso a todas las funcionalidades

---

## 🎯 Módulos Principales

### 1. **👨‍💼 Panel de Administración**
**Acceso**: Usuarios con rol `admin`

#### Características:
- **📊 Estadísticas en Tiempo Real**:
  - Total de usuarios
  - Pacientes activos
  - Citas del día
  - Ocupación de camas
  
- **4 Pestañas**:
  1. **Vista General**:
     - Actividad reciente
     - Métricas del sistema
     - Capacidad de camas
     - Personal activo
     - Rendimiento del sistema
  
  2. **Usuarios**:
     - Tabla completa de usuarios
     - Activar/Desactivar usuarios
     - Eliminar usuarios
     - Ver último inicio de sesión
     - Filtros y búsqueda
  
  3. **Personal**:
     - Lista de doctores con especialización
     - Lista de enfermeros con departamento
     - Información de contacto
  
  4. **Configuración**:
     - Ajustes del hospital
     - Preferencias de notificaciones
     - Configuración de backup

#### Acciones Disponibles:
- ✅ Activar/Desactivar usuarios
- 🗑️ Eliminar usuarios
- 👁️ Ver detalles completos
- 📊 Ver estadísticas en tiempo real

---

### 2. **🩺 Panel Médico (Doctores)**
**Acceso**: Usuarios con rol `doctor`

#### 4 Pestañas Principales:

##### **Vista General**:
- 📊 Gráfica de pastel: Distribución de pacientes por condición
- 📋 Lista de pacientes recientes
- 📈 Estadísticas rápidas

##### **Pacientes**:
- **Sidebar**: Lista de todos los pacientes (scrollable)
- **Panel Principal**:
  - Detalles del paciente seleccionado
  - Información personal (edad, sexo, sangre, condición)
  - 📈 **Gráfica de Tendencias de Signos Vitales**:
    - Temperatura
    - Frecuencia cardíaca
    - Presión arterial
    - Visualización con LineChart (Recharts)
  
  - 💊 **Formulario de Prescripción**:
    - Medicamento
    - Dosis
    - Frecuencia
    - Duración
    - Instrucciones
  
  - 📝 **Formulario de Diagnóstico**:
    - Diagnóstico
    - Plan de tratamiento
    - Notas médicas
  
  - 📜 **Historial Médico**:
    - Timeline con diagnósticos anteriores
    - Tratamientos previos
    - Notas del doctor

##### **Prescripciones**:
- Tabla completa de todas las prescripciones
- Filtros por paciente
- Estado (activa/completada)
- Detalles de medicación

##### **Análisis**:
- 📊 Gráfica de barras: Ingresos mensuales de pacientes
- 📊 Gráfica de barras: Distribución de tipos de sangre
- Estadísticas generales

---

### 3. **📅 Calendario de Citas**
**Acceso**: Todos los usuarios autenticados

#### 3 Vistas:
1. **Vista de Mes**:
   - Calendario mensual completo
   - Citas por día
   - Indicador de día actual
   - Click en día para crear cita

2. **Vista de Semana**:
   - 7 días con franjas horarias
   - 7 AM - 9 PM
   - Citas en grid de tiempo
   - Click en celda para crear cita

3. **Vista de Día**:
   - Horario detallado del día
   - Vista ampliada de citas
   - Edición rápida

#### Funcionalidades:
- ➕ **Crear Cita**:
  - Nombre del paciente
  - Doctor asignado
  - 10 tipos de especialidades
  - Fecha y hora
  - Duración (15-120 min)
  - Sala/Consultorio
  - Notas
  - 5 estados (Programada, Confirmada, En Curso, Completada, Cancelada)

- ✏️ **Editar Cita**: Click en cita existente
- 🗑️ **Eliminar Cita**: Botón de eliminar
- 🔍 **Búsqueda**: Por nombre de paciente
- 🔽 **Filtros**:
  - Por doctor
  - Por especialidad
- 📊 **Códigos de Color**: Por estado de cita
- 📆 **Navegación**: Anterior/Siguiente/Hoy

---

### 4. **💊 Gestión de Farmacia**
**Acceso**: Administradores y personal autorizado

#### Estadísticas Dashboard:
- 📦 Total de artículos
- 💰 Valor total del inventario
- ⚠️ Artículos con stock bajo
- 🔴 Medicamentos por caducar

#### 3 Pestañas:
1. **Inventario** (todos los artículos)
2. **Stock Bajo** (artículos bajo mínimo)
3. **Por Caducar** (próximos a expirar)

#### Gestión de Medicamentos:
- **11 Categorías**:
  - Analgésico
  - Antibiótico
  - Antiinflamatorio
  - Antihipertensivo
  - Antidiabético
  - Antihistamínico
  - Vitaminas
  - Suplementos
  - Material Médico
  - Equipo
  - Otros

- **Información por Artículo**:
  - Nombre del medicamento
  - Categoría
  - Cantidad y unidad (unidades, cajas, frascos, ampolletas, tabletas, ml, gr)
  - Stock mínimo/máximo
  - Precio unitario y valor total
  - Fecha de caducidad
  - Número de lote
  - Proveedor
  - Ubicación física
  - Notas

- **Alertas Automáticas**:
  - 🔴 Rojo: Caducado o agotado
  - 🟠 Naranja: Caduca en <30 días
  - 🟡 Amarillo: Caduca en <90 días o stock bajo
  - 🟢 Verde: Stock normal

- **Funciones**:
  - ➕ Agregar medicamento
  - ✏️ Editar información
  - 🗑️ Eliminar artículo
  - 🔍 Búsqueda por nombre
  - 🔽 Filtros (categoría, estado de stock)
  - 📥 **Exportar a CSV**

---

### 5. **🚨 Sala de Emergencias**
**Acceso**: Personal médico (doctores, enfermeros)

#### Dashboard de Emergencias:
- **4 Tarjetas de Stats**:
  - 🔵 Total activos
  - 🔴 Críticos (animado)
  - 🟠 Urgentes
  - 🟡 En espera

#### Sistema de Triage (5 Niveles):
1. **🔴 Rojo - Crítico**: Atención inmediata
2. **🟠 Naranja - Urgente**: <15 minutos
3. **🟡 Amarillo - Semi-urgente**: <30 minutos
4. **🟢 Verde - Menor**: <60 minutos
5. **🔵 Azul - No urgente**: <2 horas

#### Registro de Caso:
- **Información del Paciente**:
  - Nombre completo
  - Edad
  - Género
  - Motivo de consulta

- **Signos Vitales**:
  - Presión arterial
  - Frecuencia cardíaca
  - Temperatura
  - Saturación de oxígeno
  - Frecuencia respiratoria

- **Historial Médico**:
  - Alergias
  - Medicamentos actuales
  - Notas de triage

- **Asignación**:
  - Doctor asignado
  - Enfermero asignado
  - Número de cama

- **Estados del Paciente**:
  - Esperando
  - En Evaluación
  - En Tratamiento
  - Observación
  - Alta
  - Transferido
  - Fallecido

#### Funcionalidades:
- ⏱️ **Tiempo de Espera**: Calculado automáticamente
- 🎯 **Priorización Automática**: Por nivel de triage y tiempo
- 🔍 **Búsqueda**: Por nombre o síntoma
- 🔽 **Filtros**: Por prioridad
- 📊 **Vista de Tarjetas**: Código de colores por prioridad
- ✏️ **Actualización Rápida**: Click en caso para editar

---

### 6. **👤 Perfil de Usuario**
**Acceso**: Todos los usuarios

#### 3 Pestañas:

##### **Información Personal**:
- 📸 Foto de perfil (subir/cambiar)
- Nombre de usuario
- Email
- Teléfono
- Dirección
- Biografía
- Fecha de miembro
- Último acceso
- Badge de rol con gradiente

##### **Seguridad**:
- 🔒 Cambiar contraseña
- Validación de contraseña actual
- Requisitos de seguridad
- Confirmación de nueva contraseña

##### **Actividad**:
- 📊 Registro de actividad reciente
- Acciones realizadas
- Timestamps
- Tipo de acción

---

### 7. **⚙️ Configuración del Sistema**
**Acceso**: Administradores

#### 5 Secciones:

##### **General**:
- Nombre del hospital
- Idioma (Español, English, Français)
- Zona horaria
- Formato de fecha

##### **Notificaciones**:
Toggles para:
- ✉️ Email
- 📱 SMS
- 🔔 Push
- 📅 Recordatorios de citas
- 🧪 Alertas de resultados
- ⚡ Alertas del sistema

##### **Seguridad**:
- Máximo intentos de login (1-10)
- Tiempo de sesión (5-120 min)
- 🔐 Autenticación de dos factores (toggle)

##### **Apariencia**:
- Tema (Claro/Oscuro/Automático)
- Tamaño de fuente (Pequeño/Mediano/Grande)
- Modo compacto (toggle)

##### **Backup y Restauración**:
- 🔄 Backup automático (toggle)
- Frecuencia (Cada hora/Diario/Semanal)
- 📥 Descargar backup (JSON)
- 📤 Restaurar backup (subir archivo)

---

### 8. **🔔 Centro de Notificaciones**
**Acceso**: Todos los usuarios

#### Características:
- 🔔 Icono de campana en navbar
- Badge con contador de no leídas
- Muestra "9+" si más de 9
- **Dropdown Panel**:
  - Lista de notificaciones
  - Iconos por tipo (✓ success, ⚠️ warning, ✗ error, ℹ️ info)
  - Códigos de color por tipo
  - Tiempo relativo ("Hace X min/h/d")
  - Marcar como leída (individual)
  - Botón "Marcar todas como leídas"
  - Botón eliminar
- 🔄 **Auto-refresh**: Cada 30 segundos
- Estado vacío con mensaje

---

### 9. **🔍 Búsqueda Global**
**Acceso**: Todos los usuarios

#### Busca en 6 Entidades:
1. **Pacientes**:
   - Nombre
   - Habitación
   - Condición
   - Tipo de sangre

2. **Citas**:
   - Nombre del paciente
   - Tipo de cita
   - Doctor

3. **Tratamientos**:
   - Medicación
   - Personal que aplica

4. **Pruebas de Laboratorio**:
   - Tipo de prueba
   - Estado
   - Doctor que ordena

5. **Historial Médico**:
   - Diagnóstico
   - Tratamiento
   - Doctor

6. **Notas de Enfermería**

#### Características:
- ⚡ **Debouncing**: 300ms para evitar búsquedas excesivas
- 🎨 **Badges de color** por tipo de entidad
- 📋 Límite de 10 resultados principales
- 🔄 Loading indicator
- ❌ Estado vacío si no hay resultados
- 👆 **Navegación**: Click en resultado para ir a vista correspondiente

---

### 10. **🌓 Modo Oscuro**
**Acceso**: Todos los usuarios

#### Características:
- 🌙 Toggle en navbar (Luna/Sol)
- 💾 Persistencia en localStorage
- 🎨 Transiciones suaves
- ✅ Compatible con todos los componentes
- 📱 Responsive en mobile y desktop

---

## 🗄️ Base de Datos - 28 Tablas

### **Principales**:
1. `users` - Sistema de usuarios
2. `patients` - Pacientes
3. `appointments` - Citas
4. `treatments` - Tratamientos
5. `vital_signs` - Signos vitales
6. `lab_tests` - Laboratorio
7. `medical_history` - Historial
8. `nurse_notes` - Notas

### **Módulos Avanzados**:
9. `notifications` - Notificaciones
10. `rooms` - Habitaciones
11. `prescriptions` - Prescripciones
12. `invoices` / `invoice_items` - Facturación
13. `pharmacy_inventory` - Farmacia
14. `emergency_cases` - Emergencias
15. `surgeries` - Cirugías
16. `imaging_tests` - Radiología
17. `shifts` - Turnos
18. `audit_logs` - Auditoría
19. `password_reset_tokens` - Recuperación
20. `vaccinations` - Vacunas
21. `referrals` - Referencias
22. `consent_forms` - Consentimientos
23. `incident_reports` - Incidentes
24. `blood_inventory` - Banco de sangre
25. `medical_equipment` - Equipos
26. `meal_orders` - Comidas

---

## 🎨 Características de UI/UX

### **Diseño Moderno**:
- Glass morphism effects
- Gradientes animados (purple/blue/emerald/cyan)
- Animaciones suaves (fadeIn, slideIn, scaleIn)
- Badges con gradientes
- Cards con hover effects
- Loading skeletons
- Iconos de Lucide React

### **Responsive**:
- 📱 Mobile first
- 💻 Tablet optimizado
- 🖥️ Desktop completo
- Menú hamburguesa en móvil
- Grid adaptativo

### **Accesibilidad**:
- Tooltips informativos
- Contraste adecuado
- Tamaños de fuente ajustables
- Navegación por teclado
- Estados de loading claros

---

## 🔐 Roles y Permisos

### **Admin** 👨‍💼:
- ✅ Acceso completo
- Gestión de usuarios
- Configuración del sistema
- Todos los módulos

### **Doctor** 🩺:
- Panel médico completo
- Prescripciones
- Diagnósticos
- Ver pacientes
- Historial médico

### **Enfermero** 👨‍⚕️:
- Gestión de pacientes
- Signos vitales
- Tratamientos
- Notas de enfermería
- Emergencias

### **Paciente** 👤:
- Ver su información
- Historial médico
- Citas
- Resultados de laboratorio
- Tratamientos activos

---

## ⚡ Rendimiento

- **Búsqueda con Debouncing**: 300ms
- **Notificaciones Auto-refresh**: 30s
- **Lazy Loading**: Componentes grandes
- **Optimización de Gráficas**: Recharts optimizado
- **localStorage**: Caching de preferencias

---

## 📊 Estadísticas del Sistema

- **Líneas de Código**: 15,000+
- **Componentes**: 15+ componentes principales
- **Funciones de BD**: 100+ operaciones
- **Hooks Personalizados**: 17 hooks
- **Tablas**: 28 tablas
- **Características**: 120+ funcionalidades

---

## 🚀 Tecnologías

- **React 19.1.1** - Framework UI
- **Tauri 2.9.3** - Desktop app
- **SQLite** - Base de datos
- **Recharts 2.x** - Visualizaciones
- **Lucide React** - Iconos
- **Tailwind CSS 4.x** - Estilos
- **Vite 7.x** - Build tool

---

## 📝 Próximas Mejoras Sugeridas

1. **Telemedicina**: Video consultas
2. **IA**: Diagnóstico asistido
3. **PDF**: Exportar reportes
4. **Email/SMS**: Integración real
5. **Multi-idioma**: i18n completo
6. **WebSockets**: Tiempo real
7. **React Native**: App móvil nativa
8. **OCR**: Escaneo de documentos

---

**Sistema desarrollado con ❤️ para gestión hospitalaria profesional**
