# Sistema Hospitalario - Tauri Desktop App

## ✅ Tauri Setup Complete

Your hospital management system has been successfully converted to a **Tauri desktop application** with SQLite database integration!

## What's Been Done

### 1. **Tauri Desktop Framework** ✓
- Installed `@tauri-apps/cli` and `@tauri-apps/api`
- Configured `src-tauri/` Rust backend
- Updated Vite configuration for Tauri
- Set app window size to 1400x900 (min 1024x768)
- Changed app name to "Hospital San Rafael - Sistema Hospitalario"

### 2. **SQLite Database Integration** ✓
- Added `tauri-plugin-sql` with SQLite support
- Created database schema with 7 tables:
  - `patients` - Patient records
  - `appointments` - Medical appointments
  - `treatments` - Treatment/medication records
  - `vital_signs` - Vital signs measurements
  - `lab_tests` - Laboratory test results
  - `medical_history` - Patient medical history
  - `nurse_notes` - Nursing notes

### 3. **Database Service Layer** ✓
- `src/services/database.js` - Complete CRUD operations for all tables
- Automatic database initialization on app startup
- Initial seed data (3 sample patients)

### 4. **React Hooks for Database** ✓
- `src/hooks/useDatabase.js` - Custom hooks for each entity:
  - `usePatients()` - Manage patients
  - `useAppointments()` - Manage appointments
  - `useTreatments()` - Manage treatments
  - `useVitalSigns()` - Manage vital signs
  - `useNurseNotes()` - Manage nurse notes

## How to Run the Desktop App

### Development Mode
```bash
npm run tauri dev
```

This will:
1. Start the Vite dev server (http://localhost:5173)
2. Compile the Rust backend
3. Open the desktop application window
4. Enable hot-reload for React code

### Build for Production
```bash
npm run tauri build
```

This creates:
- **Linux**: `.deb` and `.AppImage` in `src-tauri/target/release/bundle/`
- **Windows**: `.exe` installer
- **macOS**: `.dmg` and `.app` bundle

## Database Location

The SQLite database is stored at:
- **Linux**: `~/.local/share/com.hospital.sanrafael/hospital.db`
- **macOS**: `~/Library/Application Support/com.hospital.sanrafael/hospital.db`
- **Windows**: `%APPDATA%\com.hospital.sanrafael\hospital.db`

## Next Steps to Complete Migration

### 1. Update `App.jsx` to Use Database Hooks

Replace the in-memory state with database hooks:

```jsx
// Instead of:
const [patients, setPatients] = useState([...mockData]);

// Use:
import { usePatients } from './hooks/useDatabase';
const { patients, loading, addPatient, updatePatient, removePatient } = usePatients();
```

### 2. Convert Each Feature

Priority order:
1. **Patients list** (highest priority - foundation for everything else)
2. **Appointments** 
3. **Vital signs registration**
4. **Treatments**
5. **Nurse notes**
6. **Medical history & lab tests**

### 3. Add Desktop-Specific Features

Now that you have a desktop app, you can add:

- **File exports** (PDF reports, CSV backups)
  ```bash
  npm install @tauri-apps/plugin-dialog @tauri-apps/plugin-fs
  ```

- **System notifications** (appointment reminders, critical alerts)
  ```bash
  npm install @tauri-apps/plugin-notification
  ```

- **Native menus** (File > Export, Help > About, etc.)
  - Edit `src-tauri/src/lib.rs` to add menu items

- **Auto-updater** (for deploying updates)
  ```bash
  npm install @tauri-apps/plugin-updater
  ```

## Project Structure

```
sistema-hospitalario/
├── src/
│   ├── services/
│   │   └── database.js         # SQLite operations
│   ├── hooks/
│   │   └── useDatabase.js      # React hooks for DB
│   ├── App.jsx                 # Main React component (needs migration)
│   └── main.jsx                # App entry + DB init
├── src-tauri/
│   ├── src/
│   │   └── lib.rs              # Rust backend
│   ├── Cargo.toml              # Rust dependencies
│   ├── tauri.conf.json         # Tauri configuration
│   └── capabilities/
│       └── default.json        # Permissions (SQL enabled)
└── package.json                # Node dependencies
```

## Database Schema Overview

All tables have:
- Primary key `id` (auto-increment)
- `created_at` timestamp (automatic)
- Foreign keys where appropriate

Example patient record:
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "age": 45,
  "room": "201",
  "condition": "Estable",
  "admission_date": "2025-10-25",
  "blood_type": "O+",
  "allergies": "Penicilina"
}
```

## Troubleshooting

### Build fails with "Failed to parse version"
- Fixed: Updated Cargo.toml with specific versions (2.7, 2.3)

### Database not initializing
- Check browser console for errors
- Ensure `sql:default` permission in `src-tauri/capabilities/default.json`

### Window doesn't open
- Check terminal for Rust compilation errors
- Ensure port 5173 is not in use
- Try `npm run tauri dev -- --verbose`

### Hot reload not working
- Rust changes require full restart
- React changes should hot-reload automatically

## Useful Commands

```bash
# Check Tauri CLI version
npx tauri --version

# Clean build artifacts
rm -rf src-tauri/target
npm run tauri build

# View app logs
npm run tauri dev -- --verbose

# Open database in SQLite browser
sqlite3 ~/.local/share/com.hospital.sanrafael/hospital.db
```

## Resources

- [Tauri Documentation](https://tauri.app/v2/guides/)
- [Tauri SQL Plugin](https://tauri.app/plugin/sql/)
- [Tauri API Reference](https://tauri.app/v2/api/js/)

---

**Status**: ✅ Tauri setup complete, database layer ready
**Next**: Migrate App.jsx to use database hooks instead of in-memory state
