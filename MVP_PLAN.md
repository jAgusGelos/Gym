# 📋 Plan Exhaustivo MVP - Aplicación de Gimnasio

## 🎯 Objetivo del MVP
Digitalizar la operación del gimnasio físico y ofrecer al socio una app móvil útil para sus actividades básicas: check-in, visualización de membresía, exploración de rutinas, reserva de clases y seguimiento de entrenamientos.

---

## 🛠 Stack Tecnológico

### Frontend
- **Framework**: React 18+
- **Routing**: TanStack Router v1
- **State Management**: TanStack Query v5 (server state) + Zustand (client state)
- **Styling**: Tailwind CSS 3+ (mobile-first)
- **UI Components**: Custom components + Headless UI
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **QR**: qrcode.react
- **Build Tool**: Vite

### Backend
- **Framework**: NestJS 10+
- **Authentication**: Better Auth (JWT + OAuth)
- **ORM**: TypeORM
- **Database**: PostgreSQL 15+
- **Validation**: class-validator + class-transformer
- **Documentation**: Swagger/OpenAPI
- **QR Generation**: qrcode + uuid
- **Password Hashing**: bcrypt

### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Testing**: Jest (unit) + Playwright (e2e)
- **Code Quality**: ESLint + Prettier
- **Environment**: Docker (PostgreSQL)

---

## 🏗 Arquitectura del Proyecto

### Estructura Backend
```
backend/
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── google.strategy.ts
│   │   │   └── apple.strategy.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       ├── register.dto.ts
│   │       └── auth-response.dto.ts
│   │
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       ├── update-user.dto.ts
│   │       └── user-response.dto.ts
│   │
│   ├── memberships/
│   │   ├── memberships.controller.ts
│   │   ├── memberships.service.ts
│   │   ├── memberships.module.ts
│   │   ├── entities/
│   │   │   └── membership.entity.ts
│   │   └── dto/
│   │       ├── create-membership.dto.ts
│   │       └── update-membership.dto.ts
│   │
│   ├── attendance/
│   │   ├── attendance.controller.ts
│   │   ├── attendance.service.ts
│   │   ├── attendance.module.ts
│   │   ├── entities/
│   │   │   └── attendance.entity.ts
│   │   └── dto/
│   │       ├── check-in.dto.ts
│   │       └── attendance-stats.dto.ts
│   │
│   ├── exercises/
│   │   ├── exercises.controller.ts
│   │   ├── exercises.service.ts
│   │   ├── exercises.module.ts
│   │   ├── entities/
│   │   │   └── exercise.entity.ts
│   │   └── dto/
│   │       ├── create-exercise.dto.ts
│   │       ├── update-exercise.dto.ts
│   │       └── filter-exercises.dto.ts
│   │
│   ├── routines/
│   │   ├── routines.controller.ts
│   │   ├── routines.service.ts
│   │   ├── routines.module.ts
│   │   ├── entities/
│   │   │   ├── routine.entity.ts
│   │   │   └── routine-exercise.entity.ts
│   │   └── dto/
│   │       ├── create-routine.dto.ts
│   │       ├── update-routine.dto.ts
│   │       └── filter-routines.dto.ts
│   │
│   ├── classes/
│   │   ├── classes.controller.ts
│   │   ├── classes.service.ts
│   │   ├── classes.module.ts
│   │   ├── entities/
│   │   │   └── class.entity.ts
│   │   └── dto/
│   │       ├── create-class.dto.ts
│   │       ├── update-class.dto.ts
│   │       └── filter-classes.dto.ts
│   │
│   ├── bookings/
│   │   ├── bookings.controller.ts
│   │   ├── bookings.service.ts
│   │   ├── bookings.module.ts
│   │   ├── entities/
│   │   │   └── booking.entity.ts
│   │   └── dto/
│   │       ├── create-booking.dto.ts
│   │       └── cancel-booking.dto.ts
│   │
│   ├── payments/
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   ├── payments.module.ts
│   │   ├── entities/
│   │   │   └── payment.entity.ts
│   │   └── dto/
│   │       ├── create-payment.dto.ts
│   │       └── payment-history.dto.ts
│   │
│   ├── announcements/
│   │   ├── announcements.controller.ts
│   │   ├── announcements.service.ts
│   │   ├── announcements.module.ts
│   │   ├── entities/
│   │   │   └── announcement.entity.ts
│   │   └── dto/
│   │       ├── create-announcement.dto.ts
│   │       └── update-announcement.dto.ts
│   │
│   ├── notifications/
│   │   ├── notifications.controller.ts
│   │   ├── notifications.service.ts
│   │   └── notifications.module.ts
│   │
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts
│   │   │   ├── public.decorator.ts
│   │   │   └── current-user.decorator.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── interceptors/
│   │   │   ├── transform.interceptor.ts
│   │   │   └── logging.interceptor.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── dto/
│   │   │   └── pagination.dto.ts
│   │   └── types/
│   │       └── request-with-user.type.ts
│   │
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── app.config.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

### Estructura Frontend
```
frontend/
├── src/
│   ├── routes/
│   │   ├── __root.tsx
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── _authenticated/
│   │   │   ├── home.tsx
│   │   │   ├── profile.tsx
│   │   │   ├── qr-code.tsx
│   │   │   ├── attendance.tsx
│   │   │   ├── exercises/
│   │   │   │   ├── index.tsx
│   │   │   │   └── $id.tsx
│   │   │   ├── routines/
│   │   │   │   ├── index.tsx
│   │   │   │   └── $id.tsx
│   │   │   ├── classes/
│   │   │   │   ├── index.tsx
│   │   │   │   └── $id.tsx
│   │   │   ├── my-bookings.tsx
│   │   │   ├── payments.tsx
│   │   │   └── announcements.tsx
│   │   │
│   │   └── _admin/
│   │       ├── dashboard.tsx
│   │       ├── members/
│   │       │   ├── index.tsx
│   │       │   └── $id.tsx
│   │       ├── memberships/
│   │       ├── attendance.tsx
│   │       ├── classes/
│   │       ├── exercises/
│   │       ├── routines/
│   │       ├── payments.tsx
│   │       └── announcements/
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Drawer.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Skeleton.tsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── MobileLayout.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   │
│   │   └── features/
│   │       ├── auth/
│   │       │   ├── LoginForm.tsx
│   │       │   └── RegisterForm.tsx
│   │       ├── membership/
│   │       │   └── MembershipCard.tsx
│   │       ├── exercise/
│   │       │   ├── ExerciseCard.tsx
│   │       │   ├── ExerciseList.tsx
│   │       │   └── ExerciseDetail.tsx
│   │       ├── routine/
│   │       │   ├── RoutineCard.tsx
│   │       │   └── RoutineDetail.tsx
│   │       ├── class/
│   │       │   ├── ClassCard.tsx
│   │       │   └── ClassDetail.tsx
│   │       ├── booking/
│   │       │   └── BookingList.tsx
│   │       ├── attendance/
│   │       │   ├── AttendanceHistory.tsx
│   │       │   └── QRCodeDisplay.tsx
│   │       ├── payment/
│   │       │   └── PaymentHistory.tsx
│   │       ├── announcement/
│   │       │   └── AnnouncementCard.tsx
│   │       └── admin/
│   │           ├── StatsCard.tsx
│   │           ├── MemberTable.tsx
│   │           ├── QRScanner.tsx
│   │           └── DashboardStats.tsx
│   │
│   ├── hooks/
│   │   ├── auth/
│   │   │   ├── useAuth.ts
│   │   │   ├── useLogin.ts
│   │   │   ├── useRegister.ts
│   │   │   └── useLogout.ts
│   │   ├── users/
│   │   │   ├── useProfile.ts
│   │   │   ├── useUpdateProfile.ts
│   │   │   └── useQRCode.ts
│   │   ├── memberships/
│   │   │   ├── useMembership.ts
│   │   │   └── useMemberships.ts
│   │   ├── attendance/
│   │   │   └── useAttendanceHistory.ts
│   │   ├── exercises/
│   │   │   ├── useExercises.ts
│   │   │   └── useExercise.ts
│   │   ├── routines/
│   │   │   ├── useRoutines.ts
│   │   │   └── useRoutine.ts
│   │   ├── classes/
│   │   │   ├── useClasses.ts
│   │   │   └── useClass.ts
│   │   ├── bookings/
│   │   │   ├── useMyBookings.ts
│   │   │   ├── useCreateBooking.ts
│   │   │   └── useCancelBooking.ts
│   │   ├── payments/
│   │   │   └── usePaymentHistory.ts
│   │   └── announcements/
│   │       └── useAnnouncements.ts
│   │
│   ├── services/
│   │   ├── api.ts (axios instance)
│   │   ├── auth.service.ts
│   │   ├── users.service.ts
│   │   ├── memberships.service.ts
│   │   ├── attendance.service.ts
│   │   ├── exercises.service.ts
│   │   ├── routines.service.ts
│   │   ├── classes.service.ts
│   │   ├── bookings.service.ts
│   │   ├── payments.service.ts
│   │   └── announcements.service.ts
│   │
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── themeStore.ts
│   │   └── notificationStore.ts
│   │
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── membership.types.ts
│   │   ├── attendance.types.ts
│   │   ├── exercise.types.ts
│   │   ├── routine.types.ts
│   │   ├── class.types.ts
│   │   ├── booking.types.ts
│   │   ├── payment.types.ts
│   │   └── announcement.types.ts
│   │
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .env
├── .env.example
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 💾 Modelos de Base de Datos (TypeORM Entities)

### 1. User Entity
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string; // null para OAuth

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({
    type: 'enum',
    enum: UserRole, // SOCIO, ADMIN, ENTRENADOR, RECEPCIONISTA
    default: UserRole.SOCIO,
  })
  rol: UserRole;

  @Column({ unique: true })
  qrCode: string; // UUID para check-in

  @Column({
    type: 'enum',
    enum: UserStatus, // ACTIVO, INACTIVO, SUSPENDIDO
    default: UserStatus.ACTIVO,
  })
  estado: UserStatus;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'date', nullable: true })
  fechaNacimiento: Date;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  appleId: string;

  @CreateDateColumn()
  fechaRegistro: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**Relaciones**:
- OneToMany con Membership
- OneToMany con Attendance
- OneToMany con Routine (creadas)
- OneToMany con Booking
- OneToMany con Payment

---

### 2. Membership Entity
```typescript
@Entity('memberships')
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: MembershipType, // MENSUAL, TRIMESTRAL, SEMESTRAL, ANUAL
  })
  tipo: MembershipType;

  @Column({ type: 'date' })
  fechaInicio: Date;

  @Column({ type: 'date' })
  fechaVencimiento: Date;

  @Column({
    type: 'enum',
    enum: MembershipStatus, // ACTIVA, VENCIDA, PENDIENTE, CANCELADA
    default: MembershipStatus.PENDIENTE,
  })
  estado: MembershipStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod, // EFECTIVO, TARJETA, TRANSFERENCIA, MERCADOPAGO
    nullable: true,
  })
  metodoPago: PaymentMethod;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

### 3. Attendance Entity
```typescript
@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'timestamp' })
  horaEntrada: Date;

  @Column({ type: 'timestamp', nullable: true })
  horaSalida: Date;

  @Column({
    type: 'enum',
    enum: CheckInType, // QR, MANUAL
    default: CheckInType.QR,
  })
  tipoCheckIn: CheckInType;

  @CreateDateColumn()
  createdAt: Date;
}
```

---

### 4. Exercise Entity
```typescript
@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ nullable: true })
  videoUrl: string;

  @Column({ nullable: true })
  imagenUrl: string;

  @Column({
    type: 'enum',
    enum: ExerciseCategory, // FUERZA, CARDIO, FLEXIBILIDAD, MOVILIDAD, FUNCIONAL
  })
  categoria: ExerciseCategory;

  @Column({
    type: 'enum',
    enum: DifficultyLevel, // PRINCIPIANTE, INTERMEDIO, AVANZADO
  })
  nivelDificultad: DifficultyLevel;

  @Column({
    type: 'enum',
    enum: MuscleGroup, // PECHO, ESPALDA, HOMBROS, BRAZOS, PIERNAS, ABDOMEN, GLUTEOS, CUERPO_COMPLETO
    array: true,
  })
  grupoMuscular: MuscleGroup[];

  @Column({ type: 'text', nullable: true })
  instrucciones: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

### 5. Routine Entity
```typescript
@Entity('routines')
export class Routine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: RoutineLevel, // PRINCIPIANTE, INTERMEDIO, AVANZADO
  })
  nivel: RoutineLevel;

  @Column({
    type: 'enum',
    enum: RoutineGoal, // FUERZA, HIPERTROFIA, DEFINICION, RESISTENCIA, MOVILIDAD, PERDIDA_PESO
  })
  objetivo: RoutineGoal;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creadorId' })
  creador: User;

  @Column()
  creadorId: string;

  @OneToMany(() => RoutineExercise, (re) => re.routine, { cascade: true })
  ejercicios: RoutineExercise[];

  @Column({ type: 'int', nullable: true })
  duracionEstimada: number; // minutos

  @Column({ default: true })
  activo: boolean;

  @Column({ default: true })
  publico: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

### 6. RoutineExercise Entity (Join Table)
```typescript
@Entity('routine_exercises')
export class RoutineExercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Routine, (routine) => routine.ejercicios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'routineId' })
  routine: Routine;

  @Column()
  routineId: string;

  @ManyToOne(() => Exercise)
  @JoinColumn({ name: 'exerciseId' })
  exercise: Exercise;

  @Column()
  exerciseId: string;

  @Column()
  orden: number;

  @Column()
  series: number;

  @Column()
  repeticiones: string; // "10-12" or "30 seg" etc

  @Column()
  descanso: number; // segundos

  @Column({ type: 'text', nullable: true })
  notas: string;
}
```

---

### 7. Class Entity
```typescript
@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'instructorId' })
  instructor: User;

  @Column()
  instructorId: string;

  @Column({ type: 'timestamp' })
  fechaHoraInicio: Date;

  @Column({ type: 'timestamp' })
  fechaHoraFin: Date;

  @Column()
  cupoMaximo: number;

  @Column({ default: 0 })
  cupoActual: number;

  @Column({ default: true })
  activo: boolean;

  @Column({ nullable: true })
  imagenUrl: string;

  @OneToMany(() => Booking, (booking) => booking.class)
  reservas: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

### 8. Booking Entity
```typescript
@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Class, (cls) => cls.reservas)
  @JoinColumn({ name: 'classId' })
  class: Class;

  @Column()
  classId: string;

  @Column({
    type: 'enum',
    enum: BookingStatus, // RESERVADO, CANCELADO, ASISTIDO, NO_ASISTIO
    default: BookingStatus.RESERVADO,
  })
  estado: BookingStatus;

  @Column({ nullable: true })
  posicionListaEspera: number;

  @Column({ type: 'boolean', default: false })
  enListaEspera: boolean;

  @CreateDateColumn()
  fechaReserva: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

### 9. Payment Entity
```typescript
@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Membership, { nullable: true })
  @JoinColumn({ name: 'membershipId' })
  membership: Membership;

  @Column({ nullable: true })
  membershipId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'timestamp' })
  fecha: Date;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  metodoPago: PaymentMethod;

  @Column({ nullable: true })
  comprobante: string; // URL o número

  @Column({
    type: 'enum',
    enum: PaymentStatus, // PAGADO, PENDIENTE, RECHAZADO
    default: PaymentStatus.PENDIENTE,
  })
  estado: PaymentStatus;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

---

### 10. Announcement Entity
```typescript
@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column({ type: 'text' })
  contenido: string;

  @Column({
    type: 'enum',
    enum: AnnouncementType, // NOVEDAD, EVENTO, PROMOCION, MANTENIMIENTO
  })
  tipo: AnnouncementType;

  @Column({ nullable: true })
  imagenUrl: string;

  @Column({ type: 'timestamp' })
  fechaPublicacion: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaExpiracion: Date;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'autorId' })
  autor: User;

  @Column()
  autorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

### 11. UserFavoriteRoutine Entity (opcional pero recomendado)
```typescript
@Entity('user_favorite_routines')
export class UserFavoriteRoutine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Routine)
  @JoinColumn({ name: 'routineId' })
  routine: Routine;

  @Column()
  routineId: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

---

## 🔌 API Endpoints Detallados

### Auth Module (`/auth`)

#### POST `/auth/register`
**Descripción**: Registrar nuevo usuario (email/password)
**Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "+54911234567"
}
```
**Response**:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "rol": "SOCIO",
    "qrCode": "uuid"
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

#### POST `/auth/login`
**Descripción**: Login con email/password
**Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```
**Response**: Same as register

#### POST `/auth/refresh`
**Descripción**: Renovar access token
**Body**:
```json
{
  "refreshToken": "refresh-token"
}
```
**Response**:
```json
{
  "accessToken": "new-jwt-token"
}
```

#### GET `/auth/me`
**Descripción**: Obtener usuario actual
**Headers**: `Authorization: Bearer {token}`
**Response**:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "nombre": "Juan",
  "apellido": "Pérez",
  "rol": "SOCIO",
  "qrCode": "uuid",
  "estado": "ACTIVO"
}
```

#### POST `/auth/logout`
**Descripción**: Cerrar sesión
**Headers**: `Authorization: Bearer {token}`

#### GET `/auth/google`
**Descripción**: Iniciar flujo OAuth Google

#### GET `/auth/google/callback`
**Descripción**: Callback OAuth Google

#### GET `/auth/apple`
**Descripción**: Iniciar flujo OAuth Apple

#### GET `/auth/apple/callback`
**Descripción**: Callback OAuth Apple

---

### Users Module (`/users`)

#### GET `/users/profile`
**Descripción**: Obtener perfil del usuario actual
**Headers**: `Authorization: Bearer {token}`
**Response**:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "+54911234567",
  "rol": "SOCIO",
  "estado": "ACTIVO",
  "avatar": "url",
  "fechaNacimiento": "1990-01-01",
  "fechaRegistro": "2024-01-01T00:00:00Z"
}
```

#### PUT `/users/profile`
**Descripción**: Actualizar perfil
**Body**:
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "+54911234567",
  "fechaNacimiento": "1990-01-01"
}
```

#### GET `/users/qr-code`
**Descripción**: Obtener QR code personal (formato imagen base64)
**Response**:
```json
{
  "qrCode": "uuid",
  "qrImage": "data:image/png;base64,..."
}
```

#### GET `/users/attendance-history`
**Descripción**: Historial de asistencia del usuario
**Query**: `?page=1&limit=20&startDate=2024-01-01&endDate=2024-12-31`
**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "fecha": "2024-01-01",
      "horaEntrada": "2024-01-01T08:00:00Z",
      "horaSalida": "2024-01-01T10:00:00Z",
      "tipoCheckIn": "QR"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

#### GET `/users/membership`
**Descripción**: Membresía activa del usuario
**Response**:
```json
{
  "id": "uuid",
  "tipo": "MENSUAL",
  "fechaInicio": "2024-01-01",
  "fechaVencimiento": "2024-02-01",
  "estado": "ACTIVA",
  "diasRestantes": 15
}
```

---

### Memberships Module (`/memberships`)

#### GET `/memberships` (ADMIN)
**Descripción**: Lista de todas las membresías
**Query**: `?page=1&limit=20&estado=ACTIVA&userId=uuid`
**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "nombre": "Juan",
        "apellido": "Pérez",
        "email": "user@example.com"
      },
      "tipo": "MENSUAL",
      "fechaInicio": "2024-01-01",
      "fechaVencimiento": "2024-02-01",
      "estado": "ACTIVA",
      "precio": 5000
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

#### POST `/memberships` (ADMIN)
**Descripción**: Crear nueva membresía
**Body**:
```json
{
  "userId": "uuid",
  "tipo": "MENSUAL",
  "fechaInicio": "2024-01-01",
  "precio": 5000,
  "metodoPago": "EFECTIVO",
  "notas": "Primera membresía"
}
```

#### PUT `/memberships/:id` (ADMIN)
**Descripción**: Actualizar membresía
**Body**:
```json
{
  "estado": "VENCIDA",
  "notas": "Actualizado por falta de pago"
}
```

#### GET `/memberships/:id`
**Descripción**: Detalle de membresía
**Response**: Same as list item

---

### Attendance Module (`/attendance`)

#### POST `/attendance/check-in`
**Descripción**: Check-in con QR code
**Body**:
```json
{
  "qrCode": "uuid-from-qr"
}
```
**Response**:
```json
{
  "id": "uuid",
  "userId": "uuid",
  "fecha": "2024-01-01",
  "horaEntrada": "2024-01-01T08:00:00Z",
  "tipoCheckIn": "QR",
  "user": {
    "nombre": "Juan",
    "apellido": "Pérez"
  }
}
```

#### POST `/attendance/manual-check-in` (ADMIN/RECEPCIONISTA)
**Descripción**: Check-in manual
**Body**:
```json
{
  "userId": "uuid"
}
```

#### POST `/attendance/check-out`
**Descripción**: Check-out (opcional)
**Body**:
```json
{
  "attendanceId": "uuid"
}
```

#### GET `/attendance` (ADMIN)
**Descripción**: Lista de asistencias
**Query**: `?page=1&limit=20&fecha=2024-01-01&userId=uuid`
**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "user": {
        "nombre": "Juan",
        "apellido": "Pérez"
      },
      "fecha": "2024-01-01",
      "horaEntrada": "2024-01-01T08:00:00Z",
      "horaSalida": "2024-01-01T10:00:00Z"
    }
  ],
  "total": 100
}
```

#### GET `/attendance/stats` (ADMIN)
**Descripción**: Estadísticas de asistencia
**Query**: `?startDate=2024-01-01&endDate=2024-01-31`
**Response**:
```json
{
  "totalAsistencias": 450,
  "promedioAsistenciasDiarias": 15,
  "diaConMasAsistencia": {
    "fecha": "2024-01-15",
    "cantidad": 35
  },
  "horasPico": [
    { "hora": "18:00", "cantidad": 120 },
    { "hora": "19:00", "cantidad": 105 }
  ]
}
```

---

### Exercises Module (`/exercises`)

#### GET `/exercises`
**Descripción**: Lista de ejercicios
**Query**: `?page=1&limit=20&categoria=FUERZA&nivel=PRINCIPIANTE&grupoMuscular=PECHO&search=press`
**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "nombre": "Press de Banca",
      "descripcion": "Ejercicio para pecho...",
      "videoUrl": "https://...",
      "imagenUrl": "https://...",
      "categoria": "FUERZA",
      "nivelDificultad": "INTERMEDIO",
      "grupoMuscular": ["PECHO", "BRAZOS"]
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20
}
```

#### GET `/exercises/:id`
**Descripción**: Detalle de ejercicio
**Response**:
```json
{
  "id": "uuid",
  "nombre": "Press de Banca",
  "descripcion": "Ejercicio para desarrollo del pecho...",
  "videoUrl": "https://...",
  "imagenUrl": "https://...",
  "categoria": "FUERZA",
  "nivelDificultad": "INTERMEDIO",
  "grupoMuscular": ["PECHO", "BRAZOS"],
  "instrucciones": "1. Acostarse en el banco...\n2. Agarrar la barra...",
  "activo": true
}
```

#### POST `/exercises` (ADMIN/ENTRENADOR)
**Descripción**: Crear ejercicio
**Body**:
```json
{
  "nombre": "Press de Banca",
  "descripcion": "Ejercicio para pecho",
  "videoUrl": "https://...",
  "categoria": "FUERZA",
  "nivelDificultad": "INTERMEDIO",
  "grupoMuscular": ["PECHO", "BRAZOS"],
  "instrucciones": "Paso a paso..."
}
```

#### PUT `/exercises/:id` (ADMIN/ENTRENADOR)
**Descripción**: Actualizar ejercicio

#### DELETE `/exercises/:id` (ADMIN)
**Descripción**: Eliminar ejercicio (soft delete: activo = false)

---

### Routines Module (`/routines`)

#### GET `/routines`
**Descripción**: Lista de rutinas
**Query**: `?page=1&limit=20&nivel=PRINCIPIANTE&objetivo=FUERZA&publico=true`
**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "nombre": "Rutina Full Body Principiante",
      "descripcion": "Rutina de 3 días...",
      "nivel": "PRINCIPIANTE",
      "objetivo": "FUERZA",
      "duracionEstimada": 60,
      "creador": {
        "nombre": "Juan",
        "apellido": "Trainer"
      },
      "cantidadEjercicios": 8
    }
  ],
  "total": 30
}
```

#### GET `/routines/:id`
**Descripción**: Detalle de rutina con ejercicios
**Response**:
```json
{
  "id": "uuid",
  "nombre": "Rutina Full Body Principiante",
  "descripcion": "Rutina completa...",
  "nivel": "PRINCIPIANTE",
  "objetivo": "FUERZA",
  "duracionEstimada": 60,
  "creador": {
    "nombre": "Juan",
    "apellido": "Trainer"
  },
  "ejercicios": [
    {
      "id": "uuid",
      "orden": 1,
      "exercise": {
        "id": "uuid",
        "nombre": "Sentadillas",
        "videoUrl": "https://..."
      },
      "series": 3,
      "repeticiones": "10-12",
      "descanso": 90,
      "notas": "Mantener la espalda recta"
    }
  ]
}
```

#### POST `/routines` (ADMIN/ENTRENADOR)
**Descripción**: Crear rutina
**Body**:
```json
{
  "nombre": "Rutina Full Body",
  "descripcion": "Rutina de 3 días",
  "nivel": "PRINCIPIANTE",
  "objetivo": "FUERZA",
  "duracionEstimada": 60,
  "publico": true,
  "ejercicios": [
    {
      "exerciseId": "uuid",
      "orden": 1,
      "series": 3,
      "repeticiones": "10-12",
      "descanso": 90,
      "notas": "Opcional"
    }
  ]
}
```

#### PUT `/routines/:id` (ADMIN/ENTRENADOR)
**Descripción**: Actualizar rutina

#### DELETE `/routines/:id` (ADMIN/ENTRENADOR)
**Descripción**: Eliminar rutina

#### POST `/routines/:id/favorite`
**Descripción**: Marcar/desmarcar rutina como favorita
**Response**:
```json
{
  "favorited": true
}
```

#### GET `/routines/favorites`
**Descripción**: Obtener rutinas favoritas del usuario

---

### Classes Module (`/classes`)

#### GET `/classes`
**Descripción**: Lista de clases
**Query**: `?page=1&limit=20&fecha=2024-01-01&instructorId=uuid&activo=true`
**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "nombre": "Spinning",
      "descripcion": "Clase de ciclismo indoor",
      "instructor": {
        "nombre": "María",
        "apellido": "García"
      },
      "fechaHoraInicio": "2024-01-01T18:00:00Z",
      "fechaHoraFin": "2024-01-01T19:00:00Z",
      "cupoMaximo": 20,
      "cupoActual": 15,
      "disponible": true,
      "imagenUrl": "https://..."
    }
  ],
  "total": 50
}
```

#### GET `/classes/:id`
**Descripción**: Detalle de clase
**Response**: Same as list + reservas info

#### POST `/classes` (ADMIN)
**Descripción**: Crear clase
**Body**:
```json
{
  "nombre": "Spinning",
  "descripcion": "Clase de ciclismo",
  "instructorId": "uuid",
  "fechaHoraInicio": "2024-01-01T18:00:00Z",
  "fechaHoraFin": "2024-01-01T19:00:00Z",
  "cupoMaximo": 20,
  "imagenUrl": "https://..."
}
```

#### PUT `/classes/:id` (ADMIN)
**Descripción**: Actualizar clase

#### DELETE `/classes/:id` (ADMIN)
**Descripción**: Eliminar clase

---

### Bookings Module (`/bookings`)

#### POST `/bookings`
**Descripción**: Reservar clase
**Body**:
```json
{
  "classId": "uuid"
}
```
**Response**:
```json
{
  "id": "uuid",
  "classId": "uuid",
  "estado": "RESERVADO",
  "enListaEspera": false,
  "posicionListaEspera": null,
  "class": {
    "nombre": "Spinning",
    "fechaHoraInicio": "2024-01-01T18:00:00Z"
  }
}
```
**Note**: Si no hay cupo, enListaEspera = true

#### DELETE `/bookings/:id`
**Descripción**: Cancelar reserva
**Response**:
```json
{
  "message": "Reserva cancelada exitosamente"
}
```

#### GET `/bookings/my-bookings`
**Descripción**: Mis reservas
**Query**: `?estado=RESERVADO&includeExpired=false`
**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "class": {
        "nombre": "Spinning",
        "fechaHoraInicio": "2024-01-01T18:00:00Z",
        "instructor": {
          "nombre": "María"
        }
      },
      "estado": "RESERVADO",
      "enListaEspera": false
    }
  ]
}
```

#### POST `/bookings/:id/check-in` (ADMIN/RECEPCIONISTA)
**Descripción**: Marcar asistencia a clase con QR
**Body**:
```json
{
  "qrCode": "uuid"
}
```

#### GET `/bookings/class/:classId` (ADMIN/INSTRUCTOR)
**Descripción**: Lista de reservas para una clase

---

### Payments Module (`/payments`)

#### GET `/payments/history`
**Descripción**: Historial de pagos del usuario
**Query**: `?page=1&limit=20`
**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "monto": 5000,
      "fecha": "2024-01-01T00:00:00Z",
      "metodoPago": "EFECTIVO",
      "estado": "PAGADO",
      "membership": {
        "tipo": "MENSUAL"
      }
    }
  ],
  "total": 10
}
```

#### POST `/payments` (ADMIN)
**Descripción**: Registrar pago
**Body**:
```json
{
  "userId": "uuid",
  "membershipId": "uuid",
  "monto": 5000,
  "fecha": "2024-01-01",
  "metodoPago": "EFECTIVO",
  "comprobante": "001234",
  "estado": "PAGADO"
}
```

#### GET `/payments` (ADMIN)
**Descripción**: Todos los pagos
**Query**: `?page=1&limit=20&userId=uuid&startDate=2024-01-01&endDate=2024-01-31&estado=PAGADO`

---

### Announcements Module (`/announcements`)

#### GET `/announcements`
**Descripción**: Lista de anuncios activos
**Query**: `?page=1&limit=20&tipo=NOVEDAD`
**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "titulo": "Nuevo Horario de Spinning",
      "contenido": "A partir del lunes...",
      "tipo": "NOVEDAD",
      "imagenUrl": "https://...",
      "fechaPublicacion": "2024-01-01T00:00:00Z",
      "autor": {
        "nombre": "Admin"
      }
    }
  ],
  "total": 20
}
```

#### GET `/announcements/:id`
**Descripción**: Detalle de anuncio

#### POST `/announcements` (ADMIN)
**Descripción**: Crear anuncio
**Body**:
```json
{
  "titulo": "Nueva Clase",
  "contenido": "Contenido del anuncio...",
  "tipo": "NOVEDAD",
  "imagenUrl": "https://...",
  "fechaPublicacion": "2024-01-01T00:00:00Z",
  "fechaExpiracion": "2024-01-31T23:59:59Z"
}
```

#### PUT `/announcements/:id` (ADMIN)
**Descripción**: Actualizar anuncio

#### DELETE `/announcements/:id` (ADMIN)
**Descripción**: Eliminar anuncio (soft delete: activo = false)

---

### Dashboard Module (`/dashboard`) (ADMIN)

#### GET `/dashboard/stats`
**Descripción**: Estadísticas generales
**Query**: `?startDate=2024-01-01&endDate=2024-01-31`
**Response**:
```json
{
  "sociosActivos": 250,
  "sociosNuevos": 15,
  "membresiasVencenProxSemana": 12,
  "ingresosMes": 1250000,
  "asistenciaPromedioDiaria": 85,
  "clasesConMasReservas": [
    { "nombre": "Spinning", "reservas": 120 },
    { "nombre": "Funcional", "reservas": 95 }
  ],
  "asistenciasPorDia": [
    { "fecha": "2024-01-01", "cantidad": 95 },
    { "fecha": "2024-01-02", "cantidad": 102 }
  ]
}
```

---

## 🎨 Frontend - Features Detalladas

### 1. Sistema de Autenticación

#### Componentes:
- `LoginForm`: Formulario de login con email/password
- `RegisterForm`: Formulario de registro
- `SocialAuthButtons`: Botones de Google/Apple OAuth

#### Flujo:
1. Usuario accede a `/login` o `/register`
2. Ingresa credenciales o usa OAuth
3. Backend valida y retorna JWT
4. Frontend guarda tokens (localStorage/cookie)
5. Redirección según rol:
   - SOCIO → `/home`
   - ADMIN/STAFF → `/admin/dashboard`

#### Protected Routes:
```typescript
// TanStack Router
<Route path="/_authenticated" component={AuthenticatedLayout}>
  <Route path="/home" component={HomePage} />
  {/* ... más rutas protegidas */}
</Route>
```

---

### 2. Dashboard Socio (`/home`)

#### Secciones:
1. **Header**:
   - Nombre del usuario
   - Avatar
   - Botón para perfil

2. **Membresía Card**:
   - Tipo de membresía
   - Fecha de vencimiento
   - Días restantes (con alerta si < 7 días)
   - Estado (badge con color)

3. **Próximas Clases**:
   - Lista de próximas 3 clases reservadas
   - Info: nombre, instructor, fecha/hora
   - Botón para ver todas

4. **Acceso Rápido**:
   - Botón "Mi QR" → abre modal con QR
   - Botón "Reservar Clase"
   - Botón "Ver Rutinas"
   - Botón "Mi Asistencia"

5. **Anuncios**:
   - Últimos 2-3 anuncios en cards

#### Componente:
```tsx
<MobileLayout>
  <div className="px-4 py-6 space-y-6">
    <WelcomeHeader user={user} />
    <MembershipCard membership={membership} />
    <UpcomingClasses bookings={upcomingBookings} />
    <QuickActions />
    <AnnouncementsFeed announcements={latestAnnouncements} />
  </div>
</MobileLayout>
```

---

### 3. Mi QR (`/qr-code`)

#### Funcionalidad:
- Muestra QR code grande (generado desde qrCode del usuario)
- Texto con código UUID debajo
- Botón para aumentar brillo (para escaneo)
- Instrucciones: "Muestra este código al ingresar al gimnasio"

#### Componente:
```tsx
<MobileLayout title="Mi Código QR">
  <div className="flex flex-col items-center justify-center p-8">
    <QRCode
      value={user.qrCode}
      size={280}
      level="H"
      className="bg-white p-4 rounded-lg shadow-lg"
    />
    <p className="mt-4 text-sm text-gray-600">{user.qrCode}</p>
    <p className="mt-2 text-center text-gray-500">
      Muestra este código al ingresar al gimnasio
    </p>
  </div>
</MobileLayout>
```

---

### 4. Historial de Asistencia (`/attendance`)

#### Funcionalidad:
- Lista de asistencias con fecha, hora entrada/salida
- Filtros: rango de fechas
- Estadísticas:
  - Total de asistencias
  - Asistencias este mes
  - Racha actual (días consecutivos)
- Calendario visual (opcional)

#### Componente:
```tsx
<MobileLayout title="Mi Asistencia">
  <div className="p-4 space-y-6">
    <StatsCards
      total={totalAttendances}
      thisMonth={thisMonthAttendances}
      streak={currentStreak}
    />

    <DateRangeFilter
      startDate={startDate}
      endDate={endDate}
      onChange={handleFilterChange}
    />

    <AttendanceList attendances={attendances} />

    {hasMore && <LoadMoreButton onClick={loadMore} />}
  </div>
</MobileLayout>
```

---

### 5. Biblioteca de Ejercicios (`/exercises`)

#### Funcionalidad:
- Lista de ejercicios con cards (imagen/video thumbnail, nombre, categoría)
- Filtros:
  - Búsqueda por nombre
  - Categoría (FUERZA, CARDIO, etc.)
  - Grupo muscular
  - Nivel de dificultad
- Infinite scroll
- Al hacer clic → detalle del ejercicio

#### Componente Lista:
```tsx
<MobileLayout title="Ejercicios">
  <div className="p-4 space-y-4">
    <SearchBar value={searchTerm} onChange={setSearchTerm} />

    <FiltersDrawer
      categories={categories}
      muscleGroups={muscleGroups}
      levels={levels}
      onFilter={handleFilter}
    />

    <ExerciseGrid exercises={exercises} />

    {isFetchingNextPage && <Spinner />}
  </div>
</MobileLayout>
```

#### Detalle Ejercicio (`/exercises/:id`):
- Video del ejercicio (si disponible)
- Nombre y descripción
- Badges: categoría, nivel, grupos musculares
- Instrucciones paso a paso
- Botón "Agregar a rutina" (para futuras fases)

---

### 6. Rutinas (`/routines`)

#### Funcionalidad:
- Lista de rutinas con cards
- Info en card: nombre, nivel, objetivo, duración estimada, # ejercicios
- Filtros:
  - Nivel (PRINCIPIANTE, INTERMEDIO, AVANZADO)
  - Objetivo (FUERZA, HIPERTROFIA, etc.)
- Botón "Favoritos" para ver solo rutinas marcadas
- Al hacer clic → detalle de rutina

#### Componente Lista:
```tsx
<MobileLayout title="Rutinas">
  <Tabs defaultValue="all">
    <TabsList>
      <TabsTrigger value="all">Todas</TabsTrigger>
      <TabsTrigger value="favorites">Favoritas</TabsTrigger>
    </TabsList>

    <TabsContent value="all">
      <FiltersBar
        level={level}
        goal={goal}
        onFilter={handleFilter}
      />

      <RoutineGrid routines={routines} />
    </TabsContent>

    <TabsContent value="favorites">
      <RoutineGrid routines={favoriteRoutines} />
    </TabsContent>
  </Tabs>
</MobileLayout>
```

#### Detalle Rutina (`/routines/:id`):
- Nombre, descripción, nivel, objetivo
- Duración estimada
- Badge "Favorito" (toggle)
- Lista de ejercicios con:
  - Thumbnail del ejercicio
  - Nombre
  - Series x repeticiones
  - Descanso
  - Notas
- Botón "Comenzar rutina" (para futuras fases con seguimiento)

---

### 7. Clases Grupales (`/classes`)

#### Funcionalidad:
- Lista de clases próximas
- Card con: nombre, instructor, fecha/hora, cupos disponibles
- Indicador visual: cupo disponible (verde), cupo limitado (amarillo), sin cupo (rojo)
- Filtros:
  - Por fecha (hoy, mañana, esta semana)
  - Por instructor
- Al hacer clic → detalle de clase

#### Componente Lista:
```tsx
<MobileLayout title="Clases">
  <div className="p-4 space-y-4">
    <DateFilter
      selected={selectedDate}
      onChange={setSelectedDate}
    />

    <ClassList classes={classes}>
      {(classItem) => (
        <ClassCard
          class={classItem}
          onReserve={handleReserve}
          isReserved={isReserved(classItem.id)}
        />
      )}
    </ClassList>
  </div>
</MobileLayout>
```

#### Detalle Clase (`/classes/:id`):
- Imagen de la clase (si disponible)
- Nombre y descripción
- Instructor (con avatar)
- Fecha, hora inicio/fin, duración
- Cupos: X/Y disponibles
- Estado de mi reserva:
  - No reservado: botón "Reservar"
  - Reservado: botón "Cancelar reserva"
  - Lista de espera: indicador + posición
- Información adicional

---

### 8. Mis Reservas (`/my-bookings`)

#### Funcionalidad:
- Tabs:
  - Próximas
  - Pasadas
- Lista de reservas con info de clase
- Botón "Cancelar" para próximas (si falta > 2 horas)
- Indicador de lista de espera con posición
- Badge de estado: RESERVADO, ASISTIDO, NO_ASISTIO

#### Componente:
```tsx
<MobileLayout title="Mis Reservas">
  <Tabs defaultValue="upcoming">
    <TabsList>
      <TabsTrigger value="upcoming">Próximas</TabsTrigger>
      <TabsTrigger value="past">Pasadas</TabsTrigger>
    </TabsList>

    <TabsContent value="upcoming">
      <BookingList
        bookings={upcomingBookings}
        onCancel={handleCancelBooking}
      />
    </TabsContent>

    <TabsContent value="past">
      <BookingList bookings={pastBookings} />
    </TabsContent>
  </Tabs>
</MobileLayout>
```

---

### 9. Historial de Pagos (`/payments`)

#### Funcionalidad:
- Lista de pagos realizados
- Info: fecha, monto, método de pago, concepto (membresía)
- Filtros por rango de fechas
- Total pagado en el período

#### Componente:
```tsx
<MobileLayout title="Mis Pagos">
  <div className="p-4 space-y-4">
    <DateRangeFilter
      startDate={startDate}
      endDate={endDate}
      onChange={handleFilter}
    />

    <TotalCard total={calculateTotal(payments)} />

    <PaymentList payments={payments}>
      {(payment) => (
        <PaymentCard payment={payment} />
      )}
    </PaymentList>
  </div>
</MobileLayout>
```

---

### 10. Anuncios (`/announcements`)

#### Funcionalidad:
- Lista de anuncios activos
- Card con: imagen, título, tipo (badge), fecha
- Al hacer clic → detalle con contenido completo
- Filtro por tipo (NOVEDAD, EVENTO, PROMOCION)

---

### 11. Perfil (`/profile`)

#### Funcionalidad:
- Secciones:
  - **Información Personal**:
    - Avatar (editable)
    - Nombre, apellido, email, teléfono, fecha nacimiento
    - Botón "Editar"

  - **Mi Membresía**:
    - Tipo, vencimiento, estado
    - Botón "Ver historial de pagos"

  - **Configuración**:
    - Toggle dark/light mode
    - Notificaciones (on/off)
    - Idioma (futuro)

  - **Soporte**:
    - Contactar gimnasio (WhatsApp, teléfono, email)
    - FAQ (futuro)

  - **Sesión**:
    - Botón "Cerrar sesión"

---

### 12. Panel Administrativo (`/admin/dashboard`)

#### Funcionalidad:
- **KPIs (Cards)**:
  - Socios activos
  - Nuevos socios este mes
  - Ingresos del mes
  - Asistencia promedio diaria
  - Membresías que vencen próxima semana

- **Gráficos**:
  - Asistencia por día (últimos 30 días) - Line chart
  - Ingresos por mes (últimos 6 meses) - Bar chart
  - Distribución de membresías por tipo - Pie chart

- **Tablas**:
  - Próximos vencimientos (tabla con botón "Renovar")
  - Clases más populares

#### Componente:
```tsx
<AdminLayout>
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold">Dashboard</h1>

    <StatsGrid stats={dashboardStats} />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AttendanceChart data={attendanceData} />
      <RevenueChart data={revenueData} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UpcomingExpirations memberships={expiringMemberships} />
      <PopularClasses classes={popularClasses} />
    </div>
  </div>
</AdminLayout>
```

---

### 13. Gestión de Socios (`/admin/members`)

#### Funcionalidad:
- Tabla de socios con:
  - Nombre, email, teléfono, membresía, estado
  - Acciones: Ver detalle, Editar, Suspender/Activar
- Búsqueda por nombre/email
- Filtros: estado (ACTIVO, INACTIVO), tipo de membresía
- Botón "Agregar socio"
- Paginación

#### Detalle Socio:
- Información personal
- Membresía actual y histórico
- Historial de asistencia
- Historial de pagos
- Reservas
- Botones: Editar, Crear membresía, Registrar pago

---

### 14. Gestión de Asistencia (`/admin/attendance`)

#### Funcionalidad:
- **Check-in Manual**:
  - Búsqueda de socio (nombre, email)
  - Botón "Registrar entrada"

- **Check-in con QR**:
  - Escáner de QR (cámara)
  - Al escanear → registrar asistencia automáticamente

- **Lista de Asistencias Hoy**:
  - Tabla con socios que ingresaron hoy
  - Hora de entrada

- **Estadísticas**:
  - Total asistencias hoy
  - Comparación con promedio

---

### 15. Gestión de Clases (`/admin/classes`)

#### Funcionalidad:
- Lista de clases (calendario o tabla)
- Filtros: fecha, instructor
- Botón "Crear clase"
- Acciones por clase: Ver reservas, Editar, Eliminar

#### Crear/Editar Clase:
- Formulario:
  - Nombre
  - Descripción
  - Instructor (select)
  - Fecha y hora inicio/fin
  - Cupo máximo
  - Imagen (upload)

#### Ver Reservas de Clase:
- Lista de usuarios reservados
- Botón para check-in manual
- Indicador de lista de espera

---

### 16. CRUD Ejercicios (`/admin/exercises`)

#### Funcionalidad:
- Tabla con ejercicios
- Búsqueda y filtros
- Botón "Crear ejercicio"
- Acciones: Ver, Editar, Eliminar

#### Crear/Editar Ejercicio:
- Formulario:
  - Nombre
  - Descripción
  - Categoría (select)
  - Nivel (select)
  - Grupos musculares (multi-select)
  - Instrucciones (textarea)
  - Video URL
  - Imagen (upload)

---

### 17. CRUD Rutinas (`/admin/routines`)

#### Funcionalidad:
- Tabla con rutinas
- Filtros: nivel, objetivo
- Botón "Crear rutina"
- Acciones: Ver, Editar, Eliminar

#### Crear/Editar Rutina:
- Formulario:
  - Nombre
  - Descripción
  - Nivel (select)
  - Objetivo (select)
  - Duración estimada
  - Público (checkbox)
  - **Ejercicios** (drag and drop para ordenar):
    - Buscar y agregar ejercicio
    - Series, repeticiones, descanso
    - Notas

---

### 18. Gestión de Pagos (`/admin/payments`)

#### Funcionalidad:
- Formulario "Registrar pago":
  - Buscar socio
  - Seleccionar membresía (o crear nueva)
  - Monto
  - Fecha
  - Método de pago
  - Comprobante
  - Notas

- Historial de pagos (tabla):
  - Fecha, socio, monto, método, estado
  - Filtros: fecha, socio, método, estado
  - Exportar a CSV

---

### 19. Gestión de Anuncios (`/admin/announcements`)

#### Funcionalidad:
- Lista de anuncios
- Botón "Crear anuncio"
- Acciones: Editar, Eliminar, Activar/Desactivar

#### Crear/Editar Anuncio:
- Formulario:
  - Título
  - Contenido (rich text editor)
  - Tipo (select)
  - Imagen (upload)
  - Fecha publicación
  - Fecha expiración (opcional)

---

## 🎨 Diseño Mobile-First

### Breakpoints:
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  }
}
```

### Estrategia:
1. **Base (Mobile)**: 320px - 640px
   - Stack vertical
   - Bottom navigation (5 tabs principales)
   - Cards full-width con padding lateral
   - Modals como Drawers desde abajo
   - Touch-friendly (min 44x44px para botones)

2. **Tablet (md)**: 768px+
   - 2 columnas en grids
   - Sidebar lateral (admin)
   - Modals más anchos (max-w-lg)

3. **Desktop (lg)**: 1024px+
   - 3-4 columnas en grids
   - Admin: Sidebar permanente + contenido
   - Hover states
   - Tooltips

### Componentes Responsive:
```tsx
// Ejemplo: Card responsive
<Card className="w-full sm:max-w-sm md:max-w-md">
  {/* Contenido */}
</Card>

// Ejemplo: Grid responsive
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <ItemCard key={item.id} item={item} />)}
</div>
```

---

## 🔒 Seguridad

### Backend:
1. **Autenticación**:
   - JWT con expiración corta (15min access token)
   - Refresh token con rotación
   - Bcrypt para passwords (salt rounds: 10)

2. **Autorización**:
   - Guards por rol (RoleGuard)
   - Decoradores: `@Roles('ADMIN', 'ENTRENADOR')`
   - Verificación de ownership (usuario solo puede ver/editar sus datos)

3. **Validación**:
   - class-validator en todos los DTOs
   - Sanitización de inputs
   - Validación de UUIDs

4. **Rate Limiting**:
   - Throttler en endpoints críticos (login, registro)

5. **CORS**:
   - Configurado solo para frontend URL

6. **HTTPS**:
   - Obligatorio en producción

### Frontend:
1. **Tokens**:
   - Access token en memoria o httpOnly cookie
   - Refresh token en httpOnly cookie

2. **XSS Prevention**:
   - React escapa por defecto
   - DOMPurify para rich text (anuncios)

3. **CSRF Protection**:
   - CSRF token en requests (si se usan cookies)

4. **Input Validation**:
   - Zod schemas en forms
   - Validación client-side + server-side

---

## 🧪 Testing

### Backend:
- **Unit Tests** (Jest):
  - Services (lógica de negocio)
  - Guards
  - Utilities

- **Integration Tests**:
  - Endpoints (e2e)
  - Database operations

- **Coverage**: mínimo 70%

### Frontend:
- **Unit Tests** (Vitest):
  - Componentes UI
  - Custom hooks
  - Utilities

- **E2E Tests** (Playwright):
  - Flujos críticos:
    - Login → ver membresía
    - Reservar clase
    - Check-in QR (admin)
    - Crear rutina (admin)

---

## 📦 Deployment

### Backend:
- **Railway** o **Render** (recomendado para MVP)
- PostgreSQL en Railway/Supabase
- Variables de entorno en plataforma

### Frontend:
- **Vercel** o **Netlify**
- Build: `npm run build`
- Variables de entorno (VITE_API_URL)

### Database:
- PostgreSQL 15+
- Migraciones con TypeORM
- Backup diario

---

## 📊 Métricas de Éxito del MVP

1. **Técnicas**:
   - [ ] Backend API funcional con todos los endpoints
   - [ ] Frontend responsive (mobile + desktop)
   - [ ] Autenticación completa (email, Google, Apple)
   - [ ] Sistema QR funcional
   - [ ] CRUD completo de todas las entidades
   - [ ] Tests > 70% coverage

2. **Funcionales**:
   - [ ] Usuario puede registrarse y hacer login
   - [ ] Usuario puede ver su membresía y estado
   - [ ] Usuario puede hacer check-in con QR
   - [ ] Usuario puede explorar ejercicios y rutinas
   - [ ] Usuario puede reservar y cancelar clases
   - [ ] Admin puede gestionar socios y membresías
   - [ ] Admin puede registrar pagos
   - [ ] Admin puede crear ejercicios, rutinas y clases
   - [ ] Admin puede ver dashboard con estadísticas

3. **Experiencia**:
   - [ ] App intuitiva y fácil de usar
   - [ ] Tiempo de carga < 3 segundos
   - [ ] Sin errores críticos
   - [ ] Feedback visual en todas las acciones

---

## 📅 Cronograma Estimado (8 semanas)

### Semana 1-2: Infraestructura
- Setup proyectos
- Base de datos y migraciones
- Autenticación (Better Auth + JWT)
- Sistema de diseño frontend

### Semana 3: Core Features Socio (Parte 1)
- Módulo usuarios y perfil
- Módulo membresías
- Dashboard socio

### Semana 4: Core Features Socio (Parte 2)
- Módulo asistencia + QR
- Módulo ejercicios
- Módulo rutinas

### Semana 5: Core Features Socio (Parte 3)
- Módulo clases
- Módulo reservas
- Mis reservas

### Semana 6: Admin Panel
- Dashboard admin
- Gestión socios y membresías
- Control asistencia (QR scanner)
- Gestión clases

### Semana 7: Admin Panel (Continuación)
- CRUD ejercicios
- CRUD rutinas
- Gestión pagos
- Gestión anuncios

### Semana 8: Pulido y Testing
- Responsive design completo
- Dark/Light mode
- Notificaciones
- Testing E2E
- Optimización de performance
- Deployment

---

## 🚀 Próximos Pasos Inmediatos

1. **Backend**:
   - [ ] Completar todas las entidades TypeORM
   - [ ] Configurar TypeORM con PostgreSQL
   - [ ] Implementar módulo de autenticación con Better Auth
   - [ ] Crear decoradores y guards comunes
   - [ ] Implementar módulos uno por uno según cronograma

2. **Frontend**:
   - [ ] Setup proyecto Vite + React
   - [ ] Configurar TanStack Router
   - [ ] Configurar TanStack Query
   - [ ] Setup Tailwind CSS
   - [ ] Crear componentes UI base
   - [ ] Crear layouts (Mobile, Admin)
   - [ ] Implementar autenticación
   - [ ] Implementar rutas protegidas
   - [ ] Desarrollar features según cronograma

3. **DevOps**:
   - [ ] Docker Compose para desarrollo local
   - [ ] CI/CD básico (GitHub Actions)
   - [ ] Scripts de deployment

---

Este documento es la guía completa para el desarrollo del MVP. Cada feature está detallada con sus componentes, endpoints y funcionalidades específicas. ¡Manos a la obra! 💪
