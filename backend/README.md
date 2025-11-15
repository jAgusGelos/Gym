# Backend - Aplicación de Gimnasio

Backend construido con NestJS, TypeORM y PostgreSQL.

## 🚀 Características

- Autenticación con JWT (access token + refresh token)
- Autorización basada en roles (SOCIO, ADMIN, ENTRENADOR, RECEPCIONISTA)
- TypeORM con PostgreSQL
- Validación de DTOs con class-validator
- Guards globales para protección de rutas
- Exception filters personalizados
- Logging de requests

## 📋 Requisitos

- Node.js 18+
- npm o yarn
- Docker y Docker Compose (para PostgreSQL)
- PostgreSQL 15+ (si no usas Docker)

## 🛠 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

3. Iniciar PostgreSQL con Docker (desde la raíz del proyecto):
```bash
docker compose up -d
```

O si tienes PostgreSQL instalado localmente, asegúrate de que esté corriendo y configura el .env apropiadamente.

4. Ejecutar migraciones (cuando estén creadas):
```bash
npm run migration:run
```

5. (Opcional) Ejecutar seeds:
```bash
npm run seed
```

## 🏃‍♂️ Ejecución

### Desarrollo
```bash
npm run start:dev
```

La API estará disponible en `http://localhost:3000/api`

### Producción
```bash
npm run build
npm run start:prod
```

## 📚 Estructura del Proyecto

```
src/
├── auth/              # Módulo de autenticación
│   ├── dto/          # Data Transfer Objects
│   ├── strategies/   # Estrategias de Passport (JWT)
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
│
├── users/            # Módulo de usuarios
│   └── entities/     # Entidad User
│
├── memberships/      # Módulo de membresías
│   └── entities/     # Entidad Membership
│
├── attendance/       # Módulo de asistencia
│   └── entities/     # Entidad Attendance
│
├── exercises/        # Módulo de ejercicios
│   └── entities/     # Entidad Exercise
│
├── routines/         # Módulo de rutinas
│   └── entities/     # Entidades Routine, RoutineExercise, UserFavoriteRoutine
│
├── classes/          # Módulo de clases grupales
│   └── entities/     # Entidad Class
│
├── bookings/         # Módulo de reservas
│   └── entities/     # Entidad Booking
│
├── payments/         # Módulo de pagos
│   └── entities/     # Entidad Payment
│
├── announcements/    # Módulo de anuncios
│   └── entities/     # Entidad Announcement
│
├── common/           # Utilidades compartidas
│   ├── decorators/   # Decoradores personalizados (@Public, @Roles, @CurrentUser)
│   ├── guards/       # Guards (JwtAuthGuard, RolesGuard)
│   ├── interceptors/ # Interceptors (Transform, Logging)
│   ├── filters/      # Exception filters
│   ├── dto/          # DTOs comunes (Pagination)
│   └── types/        # Tipos TypeScript
│
├── config/           # Configuraciones
│   ├── database.config.ts
│   └── jwt.config.ts
│
├── app.module.ts     # Módulo principal
└── main.ts          # Entry point
```

## 🔐 Autenticación

### Endpoints Públicos

#### POST /api/auth/register
Registrar nuevo usuario.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "+54911234567"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "rol": "SOCIO",
    "qrCode": "uuid",
    "estado": "ACTIVO"
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

#### POST /api/auth/login
Iniciar sesión.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** Same as register

#### POST /api/auth/refresh
Renovar access token.

**Body:**
```json
{
  "refreshToken": "refresh-token"
}
```

**Response:**
```json
{
  "accessToken": "new-jwt-token"
}
```

### Endpoints Protegidos

#### GET /api/auth/me
Obtener perfil del usuario actual.

**Headers:**
```
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "nombre": "Juan",
  "apellido": "Pérez",
  "rol": "SOCIO",
  "estado": "ACTIVO",
  "qrCode": "uuid"
}
```

#### POST /api/auth/logout
Cerrar sesión.

**Headers:**
```
Authorization: Bearer {access-token}
```

## 🎯 Guards y Decoradores

### @Public()
Marca un endpoint como público (no requiere autenticación).

```typescript
@Public()
@Get('public')
async publicEndpoint() {
  return { message: 'Este endpoint es público' };
}
```

### @Roles(...roles)
Restringe acceso a ciertos roles.

```typescript
@Roles(UserRole.ADMIN, UserRole.ENTRENADOR)
@Get('admin-only')
async adminEndpoint() {
  return { message: 'Solo admins y entrenadores' };
}
```

### @CurrentUser()
Obtiene el usuario actual del request.

```typescript
@Get('profile')
async getProfile(@CurrentUser() user: User) {
  return user;
}
```

## 🗄️ Base de Datos

### Entidades

- **User**: Usuarios del sistema
- **Membership**: Membresías de socios
- **Attendance**: Asistencias al gimnasio
- **Exercise**: Biblioteca de ejercicios
- **Routine**: Rutinas de entrenamiento
- **RoutineExercise**: Ejercicios dentro de una rutina
- **UserFavoriteRoutine**: Rutinas favoritas de usuarios
- **Class**: Clases grupales
- **Booking**: Reservas de clases
- **Payment**: Pagos registrados
- **Announcement**: Anuncios del gimnasio

### Migraciones

Crear una migración:
```bash
npm run migration:generate -- src/migrations/MigrationName
```

Ejecutar migraciones:
```bash
npm run migration:run
```

Revertir última migración:
```bash
npm run migration:revert
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Scripts Disponibles

- `npm run start`: Iniciar en modo producción
- `npm run start:dev`: Iniciar en modo desarrollo (watch mode)
- `npm run start:debug`: Iniciar en modo debug
- `npm run build`: Compilar para producción
- `npm run test`: Ejecutar tests unitarios
- `npm run test:e2e`: Ejecutar tests E2E
- `npm run lint`: Linter
- `npm run format`: Formatear código con Prettier

## 🌍 Variables de Entorno

Ver `.env.example` para la lista completa de variables requeridas.

### Principales:

- `DB_HOST`: Host de PostgreSQL
- `DB_PORT`: Puerto de PostgreSQL
- `DB_USERNAME`: Usuario de PostgreSQL
- `DB_PASSWORD`: Contraseña de PostgreSQL
- `DB_DATABASE`: Nombre de la base de datos
- `JWT_SECRET`: Secret para access tokens
- `JWT_REFRESH_SECRET`: Secret para refresh tokens
- `JWT_EXPIRES_IN`: Expiración de access token (ej: "15m")
- `JWT_REFRESH_EXPIRES_IN`: Expiración de refresh token (ej: "7d")
- `PORT`: Puerto del servidor (default: 3000)
- `NODE_ENV`: Entorno (development, production)
- `FRONTEND_URL`: URL del frontend para CORS

## 🚧 Estado Actual

✅ Configuración base de NestJS
✅ TypeORM con PostgreSQL
✅ Todas las entidades creadas
✅ Módulo de autenticación con JWT
✅ Guards globales (JWT + Roles)
✅ Decoradores personalizados
✅ Exception filters
✅ Validación global de DTOs
✅ CORS configurado

### Por Implementar (según TODO.md):

- [ ] Módulos de negocio (Users, Memberships, Attendance, etc.)
- [ ] Endpoints CRUD para cada entidad
- [ ] Sistema de notificaciones
- [ ] Seeds de datos iniciales
- [ ] Tests unitarios y E2E
- [ ] Documentación Swagger
- [ ] OAuth (Google, Apple)

## 📖 Documentación API

La documentación completa de la API está disponible en `MVP_PLAN.md` en la raíz del proyecto.

## 🐛 Debugging

Para debuggear en VSCode, usa la siguiente configuración en `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug NestJS",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "start:debug"],
  "console": "integratedTerminal"
}
```

## 📄 Licencia

MIT
