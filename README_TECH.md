# 🏋️ Gym Management System - Documentación Técnica

Sistema completo de gestión para gimnasios con aplicación web móvil-first y panel de administración.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [API Documentation](#-api-documentation)
- [Roles y Permisos](#-roles-y-permisos)

## ✨ Características

### Para Socios
- ✅ Registro y autenticación segura
- ✅ Perfil personal con información detallada
- ✅ **Código QR único** para check-in automático
- ✅ **Sistema de reservas** para clases grupales
- ✅ Lista de espera automática cuando las clases están llenas
- ✅ Explorador de rutinas con filtros por nivel y objetivo
- ✅ Sistema de favoritos para rutinas
- ✅ Dashboard personalizado con estadísticas

### Para Administradores
- ✅ **Dashboard** con 6 métricas clave en tiempo real
- ✅ **Gestión de Socios**: CRUD completo, búsqueda, filtros
- ✅ **Gestión de Clases**: Creación, edición, control de cupos
- ✅ **Control de Asistencia**: Scanner QR, historial en vivo
- ✅ **Gestión de Pagos**: Registro, filtros, resumen financiero
- ✅ Alertas automáticas de membresías por vencer
- ✅ Sistema de notificaciones toast para todas las operaciones

### Características Técnicas
- 🚀 Mobile-first responsive design
- 🌓 Dark mode ready
- 🔐 Autenticación JWT con refresh tokens
- 📊 Optimistic updates con React Query
- 🎨 UI moderna con Tailwind CSS
- 🔔 Sistema de notificaciones toast
- 🛡️ Validación robusta client y server-side
- 🎯 TypeScript end-to-end

## 🛠️ Stack Tecnológico

### Backend
- **Framework**: NestJS 10+
- **Database**: PostgreSQL 15
- **ORM**: TypeORM
- **Authentication**: JWT con Passport
- **Validation**: class-validator
- **Password Hashing**: bcrypt

### Frontend
- **Framework**: React 18+ con Vite
- **Routing**: TanStack Router v1
- **State Management**:
  - TanStack Query v5 (server state)
  - Zustand (client state)
- **Forms**: React Hook Form + Zod
- **Styling**: Tailwind CSS 3+
- **Icons**: Lucide React
- **QR**: qrcode.react

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database Client**: PostgreSQL 15

## 📁 Estructura del Proyecto

```
Gym/
├── backend/
│   ├── src/
│   │   ├── auth/              # Autenticación JWT
│   │   ├── users/             # Gestión de usuarios
│   │   ├── memberships/       # Membresías
│   │   ├── classes/           # Clases grupales
│   │   ├── bookings/          # Sistema de reservas
│   │   ├── attendance/        # Control de asistencia
│   │   ├── routines/          # Rutinas de ejercicio
│   │   ├── exercises/         # Base de ejercicios
│   │   ├── payments/          # Pagos
│   │   ├── announcements/     # Anuncios
│   │   ├── common/            # Guards, decorators
│   │   └── config/            # Configuraciones
│   └── docker-compose.yml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # Componentes base (Button, Input, Modal, etc.)
│   │   │   ├── forms/        # Formularios (Member, Class, Payment)
│   │   │   └── layouts/      # Layouts (Mobile, Admin)
│   │   ├── hooks/            # Custom hooks
│   │   ├── routes/           # Páginas
│   │   │   ├── admin/       # Panel de administración
│   │   │   └── ...          # Páginas de usuario
│   │   ├── stores/          # Zustand stores
│   │   ├── types/           # TypeScript types
│   │   └── services/        # API client
│   └── package.json
│
├── MVP_PLAN.md              # Plan exhaustivo del MVP
├── TODO.md                  # Lista de tareas
├── README.md                # Roadmap del producto
└── README_TECH.md           # Este archivo
```

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Docker y Docker Compose

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd Gym
```

### 2. Backend Setup

```bash
cd backend

# Instalar dependencias
npm install

# Iniciar base de datos
make db-up
# O manualmente:
docker-compose up -d

# Ejecutar migraciones (si las hay)
npm run migration:run

# Iniciar servidor en desarrollo
npm run start:dev
```

El backend estará disponible en `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env si es necesario

# Iniciar en desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 📖 Uso

### Credenciales de Prueba

El sistema permite crear usuarios desde el panel de registro o desde el panel de admin.

**Roles disponibles**:
- `SOCIO` - Usuario regular del gimnasio
- `ADMIN` - Administrador con acceso total
- `ENTRENADOR` - Instructor de clases
- `RECEPCIONISTA` - Personal de recepción

### Flujos Principales

#### Como Socio:
1. Registrarse en `/register`
2. Login en `/login`
3. Ver dashboard personal
4. Reservar clases en `/classes`
5. Explorar rutinas en `/routines`
6. Ver código QR en `/qr`

#### Como Admin:
1. Login con cuenta ADMIN
2. Acceder al panel en `/admin`
3. Gestionar socios, clases, pagos
4. Controlar asistencia con scanner QR
5. Ver estadísticas y métricas

## 📡 API Documentation

### Autenticación

```typescript
POST /api/auth/register
Body: { email, password, nombre, apellido, telefono?, rol? }
Response: { user, accessToken, refreshToken }

POST /api/auth/login
Body: { email, password }
Response: { user, accessToken, refreshToken }

POST /api/auth/refresh
Body: { refreshToken }
Response: { accessToken }
```

### Usuarios

```typescript
GET    /api/users               # Listar usuarios (Admin)
GET    /api/users/:id           # Ver usuario
PATCH  /api/users/:id           # Actualizar usuario
DELETE /api/users/:id           # Eliminar usuario (soft delete)
GET    /api/users/stats         # Estadísticas (Admin)
```

### Clases

```typescript
GET    /api/classes             # Listar clases
POST   /api/classes             # Crear clase (Admin)
GET    /api/classes/:id         # Ver clase
PATCH  /api/classes/:id         # Actualizar clase (Admin)
DELETE /api/classes/:id         # Eliminar clase (Admin)
```

### Reservas

```typescript
GET    /api/bookings/my-bookings    # Mis reservas
POST   /api/bookings                # Crear reserva
PATCH  /api/bookings/:id/cancel     # Cancelar reserva
```

### Asistencia

```typescript
GET    /api/attendance               # Listar asistencias (Admin)
POST   /api/attendance/check-in      # Check-in con QR
POST   /api/attendance/manual        # Check-in manual (Admin)
```

### Rutinas

```typescript
GET    /api/routines                # Listar rutinas
GET    /api/routines/favorites      # Mis favoritas
POST   /api/routines/:id/favorite   # Toggle favorito
GET    /api/routines/:id            # Ver rutina
```

### Pagos

```typescript
GET    /api/payments                # Listar pagos (Admin)
POST   /api/payments                # Registrar pago (Admin)
```

## 🔐 Roles y Permisos

### SOCIO
- Ver su perfil
- Ver su QR
- Reservar/cancelar clases
- Ver rutinas
- Marcar favoritos

### RECEPCIONISTA
- Todo lo de SOCIO
- Acceso al panel de admin
- Gestionar socios
- Gestionar clases
- Control de asistencia

### ADMIN
- Acceso total al sistema
- Gestionar socios, clases, pagos
- Ver todas las estadísticas
- Eliminar recursos

### ENTRENADOR
- Todo lo de SOCIO
- Crear rutinas públicas
- Asignado como instructor de clases

## 🔧 Scripts Disponibles

### Backend
```bash
npm run start:dev     # Desarrollo con hot-reload
npm run start:prod    # Producción
npm run build         # Compilar
npm run test          # Tests
make db-up            # Iniciar base de datos
make db-down          # Detener base de datos
make db-reset         # Resetear base de datos
```

### Frontend
```bash
npm run dev           # Desarrollo
npm run build         # Build para producción
npm run preview       # Preview del build
npm run lint          # Linter
```

## 🎨 Componentes UI Disponibles

### Base Components
- `Button` - 5 variantes (primary, secondary, outline, ghost, danger)
- `Input` - Con label, error y helper text
- `Select` - Dropdown personalizado
- `Card` - Con Header, Title, Content, Footer
- `Modal` - Reutilizable con backdrop
- `Loading` - Spinner animado
- `Toast` - Notificaciones (success, error, warning, info)

### Forms
- `MemberForm` - Crear/editar socios
- `ClassForm` - Crear/editar clases
- `PaymentForm` - Registrar pagos

### Layouts
- `MobileLayout` - Bottom navigation para usuarios
- `AdminLayout` - Sidebar para administración

## 📝 Características Futuras (Post-MVP)

- [ ] Módulo de anuncios implementado
- [ ] Reportes y gráficos avanzados
- [ ] Sistema de notificaciones push
- [ ] Integración con MercadoPago
- [ ] App móvil nativa
- [ ] Sistema de evaluaciones físicas
- [ ] Plan nutricional
- [ ] Gamificación y logros

## 🐛 Troubleshooting

### Base de datos no se conecta
```bash
# Verificar que Docker está corriendo
docker ps

# Reiniciar contenedor
make db-down && make db-up
```

### Errores de CORS
Verificar que el frontend está configurado para conectarse al backend en `VITE_API_URL`.

### Token expirado
El sistema tiene refresh automático de tokens. Si persiste, hacer logout y login nuevamente.

## 👥 Contribución

Este es un proyecto MVP. Para contribuir:
1. Fork el proyecto
2. Crear branch de feature
3. Commit cambios
4. Push al branch
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

---

Desarrollado con ❤️ para modernizar la gestión de gimnasios
