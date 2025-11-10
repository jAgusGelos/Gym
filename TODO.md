# 📝 TODO List - MVP Aplicación de Gimnasio

> Este documento contiene todas las tareas necesarias para completar el MVP. Marca con ✅ cuando completes cada tarea.

---

## 🏗️ FASE A - Infraestructura y Setup (Semana 1-2)

### Backend Setup
- [ ] Inicializar proyecto NestJS
- [ ] Instalar dependencias principales (TypeORM, PostgreSQL, Better Auth, JWT, bcrypt, class-validator)
- [ ] Configurar estructura de carpetas por módulos
- [ ] Configurar archivo .env y .env.example
- [ ] Configurar archivo .gitignore

### Database Setup
- [ ] Instalar y configurar PostgreSQL (Docker)
- [ ] Configurar TypeORM en app.module.ts
- [ ] Crear archivo database.config.ts
- [ ] Crear todas las entidades (User, Membership, Attendance, Exercise, Routine, RoutineExercise, Class, Booking, Payment, Announcement)
- [ ] Agregar relaciones entre entidades
- [ ] Crear y ejecutar migraciones iniciales
- [ ] Crear seeds de prueba (usuarios, ejercicios, clases)

### Auth Module (Backend)
- [ ] Configurar Better Auth
- [ ] Configurar JWT strategy
- [ ] Crear auth.module.ts, auth.service.ts, auth.controller.ts
- [ ] Crear DTOs de autenticación (LoginDto, RegisterDto, AuthResponseDto)
- [ ] Implementar registro con email/password
- [ ] Implementar login con email/password
- [ ] Implementar refresh token
- [ ] Implementar logout
- [ ] Configurar Google OAuth strategy
- [ ] Configurar Apple OAuth strategy
- [ ] Crear JwtAuthGuard
- [ ] Crear RolesGuard
- [ ] Crear decoradores (@Public(), @Roles(), @CurrentUser())
- [ ] Testear todos los endpoints de auth

### Common Module (Backend)
- [ ] Crear decoradores comunes (roles.decorator.ts, public.decorator.ts, current-user.decorator.ts)
- [ ] Crear guards (jwt-auth.guard.ts, roles.guard.ts)
- [ ] Crear interceptors (transform.interceptor.ts, logging.interceptor.ts)
- [ ] Crear filters (http-exception.filter.ts)
- [ ] Crear DTOs comunes (pagination.dto.ts)
- [ ] Crear tipos comunes (request-with-user.type.ts)

### Frontend Setup
- [ ] Inicializar proyecto Vite + React + TypeScript
- [ ] Instalar dependencias principales (TanStack Router, TanStack Query, Tailwind CSS, Axios, Zod, React Hook Form)
- [ ] Configurar Tailwind CSS con breakpoints mobile-first
- [ ] Configurar TanStack Router
- [ ] Configurar TanStack Query (QueryClient)
- [ ] Crear estructura de carpetas (routes, components, hooks, services, stores, types, utils)
- [ ] Configurar archivo .env y .env.example
- [ ] Configurar Axios instance con interceptors
- [ ] Crear tipos TypeScript base (user.types.ts, auth.types.ts, etc.)

### Sistema de Diseño (Frontend)
- [ ] Crear componentes UI base:
  - [ ] Button
  - [ ] Input
  - [ ] Textarea
  - [ ] Select
  - [ ] Checkbox
  - [ ] Radio
  - [ ] Switch
  - [ ] Card
  - [ ] Badge
  - [ ] Avatar
  - [ ] Modal
  - [ ] Drawer
  - [ ] Toast/Notification
  - [ ] Spinner/Loading
  - [ ] Skeleton
  - [ ] Tabs
  - [ ] Accordion
- [ ] Crear layouts:
  - [ ] MobileLayout (con BottomNav y Header)
  - [ ] AdminLayout (con Sidebar y Header)
  - [ ] BottomNav component
  - [ ] Header component
  - [ ] Sidebar component
- [ ] Configurar theme store (dark/light mode)
- [ ] Implementar toggle de dark/light mode

### DevOps
- [ ] Crear Dockerfile para backend
- [ ] Crear docker-compose.yml (PostgreSQL + Backend)
- [ ] Crear scripts npm útiles (dev, build, start, test, migrate, seed)
- [ ] Configurar ESLint + Prettier (backend + frontend)

---

## 🔐 FASE B - Autenticación y Usuarios (Semana 2-3)

### Auth Frontend
- [ ] Crear auth.service.ts (API calls)
- [ ] Crear authStore (Zustand) para estado de autenticación
- [ ] Crear hooks de autenticación:
  - [ ] useAuth()
  - [ ] useLogin()
  - [ ] useRegister()
  - [ ] useLogout()
  - [ ] useRefreshToken()
- [ ] Crear componentes de auth:
  - [ ] LoginForm
  - [ ] RegisterForm
  - [ ] SocialAuthButtons (Google, Apple)
- [ ] Crear rutas de auth:
  - [ ] /login
  - [ ] /register
- [ ] Implementar protected routes (_authenticated layout)
- [ ] Implementar redirección por rol (socio → /home, admin → /admin/dashboard)
- [ ] Implementar auto-refresh de token
- [ ] Implementar persistencia de sesión (localStorage/cookies)
- [ ] Testear flujos completos de autenticación

### Users Module (Backend)
- [ ] Crear users.module.ts, users.service.ts, users.controller.ts
- [ ] Crear DTOs (CreateUserDto, UpdateUserDto, UserResponseDto)
- [ ] Implementar endpoint GET /users/profile
- [ ] Implementar endpoint PUT /users/profile
- [ ] Implementar endpoint GET /users/qr-code (generar imagen QR)
- [ ] Implementar endpoint GET /users/attendance-history
- [ ] Implementar endpoint GET /users/membership
- [ ] Implementar paginación para historial
- [ ] Agregar validaciones
- [ ] Testear todos los endpoints

### Users Frontend
- [ ] Crear users.service.ts
- [ ] Crear tipos TypeScript (user.types.ts)
- [ ] Crear hooks:
  - [ ] useProfile()
  - [ ] useUpdateProfile()
  - [ ] useQRCode()
- [ ] Crear componente de perfil (ProfilePage)
- [ ] Crear formulario de edición de perfil
- [ ] Crear página de QR code (/qr-code)
- [ ] Implementar visualización de QR con qrcode.react
- [ ] Testear funcionalidades

---

## 💪 FASE C - Core Features Socio (Semana 3-5)

### Memberships Module (Backend)
- [ ] Crear memberships.module.ts, memberships.service.ts, memberships.controller.ts
- [ ] Crear DTOs (CreateMembershipDto, UpdateMembershipDto)
- [ ] Implementar endpoint GET /memberships (admin)
- [ ] Implementar endpoint POST /memberships (admin)
- [ ] Implementar endpoint PUT /memberships/:id (admin)
- [ ] Implementar endpoint GET /memberships/:id
- [ ] Implementar lógica de auto-actualización de estado (VENCIDA)
- [ ] Implementar validaciones (fechas, precios)
- [ ] Agregar paginación y filtros
- [ ] Testear endpoints

### Memberships Frontend
- [ ] Crear memberships.service.ts
- [ ] Crear tipos TypeScript (membership.types.ts)
- [ ] Crear hooks:
  - [ ] useMembership()
  - [ ] useMemberships() (admin)
  - [ ] useCreateMembership() (admin)
  - [ ] useUpdateMembership() (admin)
- [ ] Crear MembershipCard component
- [ ] Integrar MembershipCard en HomePage
- [ ] Crear página de gestión de membresías (admin)
- [ ] Crear formulario de crear/editar membresía (admin)
- [ ] Testear funcionalidades

### Attendance Module (Backend)
- [ ] Crear attendance.module.ts, attendance.service.ts, attendance.controller.ts
- [ ] Crear DTOs (CheckInDto, AttendanceStatsDto)
- [ ] Implementar endpoint POST /attendance/check-in (QR)
- [ ] Implementar endpoint POST /attendance/manual-check-in (admin)
- [ ] Implementar endpoint POST /attendance/check-out
- [ ] Implementar endpoint GET /attendance (admin - lista con filtros)
- [ ] Implementar endpoint GET /attendance/stats (admin)
- [ ] Implementar validaciones (QR válido, membresía activa, no duplicado hoy)
- [ ] Agregar paginación y filtros
- [ ] Testear endpoints

### Attendance Frontend
- [ ] Crear attendance.service.ts
- [ ] Crear tipos TypeScript (attendance.types.ts)
- [ ] Crear hooks:
  - [ ] useAttendanceHistory()
  - [ ] useCheckIn() (admin)
  - [ ] useAttendanceStats() (admin)
- [ ] Crear componentes:
  - [ ] AttendanceHistory (lista de asistencias)
  - [ ] AttendanceStatsCards
  - [ ] QRScanner (admin - para escanear QR)
- [ ] Crear página /attendance (historial de asistencias del usuario)
- [ ] Crear página /admin/attendance (control de asistencia admin)
- [ ] Implementar escáner QR con html5-qrcode
- [ ] Implementar check-in manual (admin)
- [ ] Testear funcionalidades

### Exercises Module (Backend)
- [ ] Crear exercises.module.ts, exercises.service.ts, exercises.controller.ts
- [ ] Crear DTOs (CreateExerciseDto, UpdateExerciseDto, FilterExercisesDto)
- [ ] Implementar endpoint GET /exercises (con filtros y búsqueda)
- [ ] Implementar endpoint GET /exercises/:id
- [ ] Implementar endpoint POST /exercises (admin/entrenador)
- [ ] Implementar endpoint PUT /exercises/:id (admin/entrenador)
- [ ] Implementar endpoint DELETE /exercises/:id (admin - soft delete)
- [ ] Implementar paginación, búsqueda y filtros
- [ ] Agregar validaciones
- [ ] Testear endpoints

### Exercises Frontend
- [ ] Crear exercises.service.ts
- [ ] Crear tipos TypeScript (exercise.types.ts)
- [ ] Crear hooks:
  - [ ] useExercises() (con infinite query)
  - [ ] useExercise(id)
  - [ ] useCreateExercise() (admin)
  - [ ] useUpdateExercise() (admin)
  - [ ] useDeleteExercise() (admin)
- [ ] Crear componentes:
  - [ ] ExerciseCard
  - [ ] ExerciseList
  - [ ] ExerciseDetail
  - [ ] ExerciseFilters
  - [ ] ExerciseForm (admin)
- [ ] Crear página /exercises (lista de ejercicios)
- [ ] Crear página /exercises/:id (detalle de ejercicio)
- [ ] Crear página /admin/exercises (CRUD admin)
- [ ] Implementar filtros (categoría, nivel, grupo muscular)
- [ ] Implementar búsqueda
- [ ] Implementar infinite scroll
- [ ] Testear funcionalidades

### Routines Module (Backend)
- [ ] Crear routines.module.ts, routines.service.ts, routines.controller.ts
- [ ] Crear DTOs (CreateRoutineDto, UpdateRoutineDto, FilterRoutinesDto)
- [ ] Implementar endpoint GET /routines (con filtros)
- [ ] Implementar endpoint GET /routines/:id (con ejercicios)
- [ ] Implementar endpoint POST /routines (admin/entrenador)
- [ ] Implementar endpoint PUT /routines/:id (admin/entrenador)
- [ ] Implementar endpoint DELETE /routines/:id (admin)
- [ ] Implementar endpoint POST /routines/:id/favorite
- [ ] Implementar endpoint GET /routines/favorites
- [ ] Implementar paginación y filtros
- [ ] Agregar validaciones (ejercicios existentes, orden correcto)
- [ ] Testear endpoints

### Routines Frontend
- [ ] Crear routines.service.ts
- [ ] Crear tipos TypeScript (routine.types.ts)
- [ ] Crear hooks:
  - [ ] useRoutines()
  - [ ] useRoutine(id)
  - [ ] useCreateRoutine() (admin)
  - [ ] useUpdateRoutine() (admin)
  - [ ] useDeleteRoutine() (admin)
  - [ ] useFavoriteRoutine()
  - [ ] useFavoriteRoutines()
- [ ] Crear componentes:
  - [ ] RoutineCard
  - [ ] RoutineList
  - [ ] RoutineDetail
  - [ ] RoutineFilters
  - [ ] RoutineForm (admin - con drag & drop para ejercicios)
  - [ ] RoutineExerciseList
- [ ] Crear página /routines (lista de rutinas con tabs: todas/favoritas)
- [ ] Crear página /routines/:id (detalle de rutina)
- [ ] Crear página /admin/routines (CRUD admin)
- [ ] Implementar filtros (nivel, objetivo)
- [ ] Implementar favoritos (toggle)
- [ ] Testear funcionalidades

### Classes Module (Backend)
- [ ] Crear classes.module.ts, classes.service.ts, classes.controller.ts
- [ ] Crear DTOs (CreateClassDto, UpdateClassDto, FilterClassesDto)
- [ ] Implementar endpoint GET /classes (con filtros por fecha, instructor)
- [ ] Implementar endpoint GET /classes/:id
- [ ] Implementar endpoint POST /classes (admin)
- [ ] Implementar endpoint PUT /classes/:id (admin)
- [ ] Implementar endpoint DELETE /classes/:id (admin)
- [ ] Implementar validaciones (cupos, fechas, instructor existe)
- [ ] Agregar paginación y filtros
- [ ] Testear endpoints

### Classes Frontend
- [ ] Crear classes.service.ts
- [ ] Crear tipos TypeScript (class.types.ts)
- [ ] Crear hooks:
  - [ ] useClasses()
  - [ ] useClass(id)
  - [ ] useCreateClass() (admin)
  - [ ] useUpdateClass() (admin)
  - [ ] useDeleteClass() (admin)
- [ ] Crear componentes:
  - [ ] ClassCard
  - [ ] ClassList
  - [ ] ClassDetail
  - [ ] ClassFilters
  - [ ] ClassForm (admin)
- [ ] Crear página /classes (lista de clases)
- [ ] Crear página /classes/:id (detalle de clase)
- [ ] Crear página /admin/classes (CRUD admin)
- [ ] Implementar filtros (fecha, instructor)
- [ ] Testear funcionalidades

### Bookings Module (Backend)
- [ ] Crear bookings.module.ts, bookings.service.ts, bookings.controller.ts
- [ ] Crear DTOs (CreateBookingDto, CancelBookingDto)
- [ ] Implementar endpoint POST /bookings
- [ ] Implementar endpoint DELETE /bookings/:id
- [ ] Implementar endpoint GET /bookings/my-bookings
- [ ] Implementar endpoint POST /bookings/:id/check-in (admin)
- [ ] Implementar endpoint GET /bookings/class/:classId (admin)
- [ ] Implementar lógica de cupos (verificar disponibilidad)
- [ ] Implementar lógica de lista de espera
- [ ] Implementar notificación cuando se libera cupo
- [ ] Implementar validaciones (no reservar 2 veces, límite de tiempo para cancelar)
- [ ] Agregar paginación y filtros
- [ ] Testear endpoints

### Bookings Frontend
- [ ] Crear bookings.service.ts
- [ ] Crear tipos TypeScript (booking.types.ts)
- [ ] Crear hooks:
  - [ ] useMyBookings()
  - [ ] useCreateBooking()
  - [ ] useCancelBooking()
  - [ ] useClassBookings() (admin)
- [ ] Crear componentes:
  - [ ] BookingList
  - [ ] BookingCard
- [ ] Integrar botones de reserva/cancelar en ClassDetail
- [ ] Crear página /my-bookings (con tabs: próximas/pasadas)
- [ ] Integrar "Próximas Clases" en HomePage
- [ ] Implementar validaciones client-side (límite de tiempo)
- [ ] Testear funcionalidades

---

## 👨‍💼 FASE D - Panel Administrativo (Semana 5-6)

### Dashboard Module (Backend)
- [ ] Crear dashboard.module.ts, dashboard.service.ts, dashboard.controller.ts
- [ ] Crear DTOs (DashboardStatsDto)
- [ ] Implementar endpoint GET /dashboard/stats
- [ ] Implementar cálculos de estadísticas:
  - [ ] Socios activos
  - [ ] Nuevos socios del mes
  - [ ] Ingresos del mes
  - [ ] Asistencia promedio diaria
  - [ ] Membresías que vencen próxima semana
  - [ ] Clases más populares
  - [ ] Asistencia por día (últimos 30 días)
- [ ] Agregar filtros por rango de fechas
- [ ] Testear endpoint

### Dashboard Frontend (Admin)
- [ ] Crear dashboard.service.ts
- [ ] Crear tipos TypeScript (dashboard.types.ts)
- [ ] Crear hook useDashboardStats()
- [ ] Crear componentes:
  - [ ] StatsCard (KPI card)
  - [ ] StatsGrid
  - [ ] AttendanceChart (line chart)
  - [ ] RevenueChart (bar chart)
  - [ ] MembershipDistributionChart (pie chart)
  - [ ] UpcomingExpirationsTable
  - [ ] PopularClassesTable
- [ ] Crear página /admin/dashboard
- [ ] Integrar gráficos (usar Chart.js o Recharts)
- [ ] Implementar filtros de fechas
- [ ] Testear visualizaciones

### Gestión de Socios (Admin Frontend)
- [ ] Crear página /admin/members (lista de socios)
- [ ] Crear componentes:
  - [ ] MemberTable (tabla con búsqueda, filtros, paginación)
  - [ ] MemberRow
  - [ ] MemberFilters
- [ ] Implementar búsqueda por nombre/email
- [ ] Implementar filtros (estado, tipo de membresía)
- [ ] Implementar acciones (ver detalle, editar, suspender/activar)
- [ ] Crear página /admin/members/:id (detalle de socio)
- [ ] Mostrar información completa del socio
- [ ] Mostrar membresía actual y histórico
- [ ] Mostrar historial de asistencia
- [ ] Mostrar historial de pagos
- [ ] Mostrar reservas
- [ ] Botones de acción rápida (crear membresía, registrar pago)
- [ ] Testear funcionalidades

### Gestión de Membresías (Admin Frontend)
- [ ] Crear página /admin/memberships
- [ ] Crear tabla de membresías con filtros
- [ ] Botón "Crear membresía"
- [ ] Modal/página de crear membresía
- [ ] Modal/página de editar membresía
- [ ] Integrar con MemberDetail (crear desde ahí también)
- [ ] Testear funcionalidades

### Control de Asistencia (Admin Frontend)
- [ ] Completar página /admin/attendance
- [ ] Sección Check-in Manual:
  - [ ] Búsqueda de socio
  - [ ] Botón registrar entrada
- [ ] Sección Check-in con QR:
  - [ ] Integrar QRScanner
  - [ ] Mostrar feedback al escanear
- [ ] Sección Asistencias de Hoy:
  - [ ] Tabla con asistencias del día
- [ ] Sección Estadísticas:
  - [ ] Total hoy, comparación con promedio
- [ ] Testear escáner QR en dispositivo real

### Gestión de Clases (Admin Frontend)
- [ ] Completar página /admin/classes
- [ ] Vista de calendario/lista de clases
- [ ] Botón "Crear clase"
- [ ] Formulario de crear/editar clase
- [ ] Modal para ver reservas de una clase
- [ ] Botón check-in manual para asistentes
- [ ] Testear funcionalidades

---

## 💰 FASE E - Pagos, Anuncios y Comunicación (Semana 6-7)

### Payments Module (Backend)
- [ ] Crear payments.module.ts, payments.service.ts, payments.controller.ts
- [ ] Crear DTOs (CreatePaymentDto, PaymentHistoryDto)
- [ ] Implementar endpoint GET /payments/history (usuario)
- [ ] Implementar endpoint POST /payments (admin)
- [ ] Implementar endpoint GET /payments (admin - todos los pagos)
- [ ] Implementar paginación y filtros
- [ ] Agregar validaciones
- [ ] Testear endpoints

### Payments Frontend
- [ ] Crear payments.service.ts
- [ ] Crear tipos TypeScript (payment.types.ts)
- [ ] Crear hooks:
  - [ ] usePaymentHistory()
  - [ ] useCreatePayment() (admin)
  - [ ] useAllPayments() (admin)
- [ ] Crear componentes:
  - [ ] PaymentCard
  - [ ] PaymentList
  - [ ] PaymentForm (admin)
  - [ ] PaymentFilters
- [ ] Crear página /payments (historial usuario)
- [ ] Crear página /admin/payments (gestión admin)
- [ ] Implementar filtros (fechas, método, estado)
- [ ] Implementar cálculo de totales
- [ ] Botón exportar a CSV (admin)
- [ ] Testear funcionalidades

### Announcements Module (Backend)
- [ ] Crear announcements.module.ts, announcements.service.ts, announcements.controller.ts
- [ ] Crear DTOs (CreateAnnouncementDto, UpdateAnnouncementDto)
- [ ] Implementar endpoint GET /announcements (activos)
- [ ] Implementar endpoint GET /announcements/:id
- [ ] Implementar endpoint POST /announcements (admin)
- [ ] Implementar endpoint PUT /announcements/:id (admin)
- [ ] Implementar endpoint DELETE /announcements/:id (admin - soft delete)
- [ ] Implementar paginación y filtros
- [ ] Agregar validaciones
- [ ] Testear endpoints

### Announcements Frontend
- [ ] Crear announcements.service.ts
- [ ] Crear tipos TypeScript (announcement.types.ts)
- [ ] Crear hooks:
  - [ ] useAnnouncements()
  - [ ] useAnnouncement(id)
  - [ ] useCreateAnnouncement() (admin)
  - [ ] useUpdateAnnouncement() (admin)
  - [ ] useDeleteAnnouncement() (admin)
- [ ] Crear componentes:
  - [ ] AnnouncementCard
  - [ ] AnnouncementList
  - [ ] AnnouncementDetail
  - [ ] AnnouncementForm (admin)
- [ ] Crear página /announcements
- [ ] Crear página /announcements/:id
- [ ] Crear página /admin/announcements (CRUD admin)
- [ ] Integrar últimos anuncios en HomePage
- [ ] Implementar filtros por tipo
- [ ] Testear funcionalidades

### Notifications Module (Backend)
- [ ] Configurar servicio de notificaciones (Firebase Cloud Messaging o similar)
- [ ] Crear notifications.module.ts, notifications.service.ts
- [ ] Implementar método de envío de notificación push
- [ ] Crear endpoint POST /notifications/send (admin)
- [ ] Crear endpoint GET /notifications/my-notifications
- [ ] Implementar notificaciones automáticas:
  - [ ] Membresía próxima a vencer (7 días antes)
  - [ ] Clase reservada (24h antes)
  - [ ] Cupo liberado en lista de espera
  - [ ] Nuevo anuncio importante
- [ ] Testear envío de notificaciones

### Notifications Frontend
- [ ] Configurar Firebase (o servicio elegido)
- [ ] Solicitar permisos de notificaciones
- [ ] Registrar token de dispositivo
- [ ] Crear notificationStore (Zustand)
- [ ] Crear componente NotificationBell (badge con contador)
- [ ] Crear componente NotificationList
- [ ] Integrar en Header
- [ ] Implementar configuración de notificaciones en perfil
- [ ] Testear notificaciones en dispositivo real

---

## 🎨 FASE F - Pulido, Testing y Deployment (Semana 7-8)

### Responsive Design
- [ ] Revisar todas las páginas en móvil (320px, 375px, 414px)
- [ ] Revisar todas las páginas en tablet (768px, 1024px)
- [ ] Revisar todas las páginas en desktop (1280px, 1920px)
- [ ] Ajustar componentes que no se vean bien
- [ ] Verificar que todos los modals funcionen bien en móvil
- [ ] Verificar que todos los formularios sean touch-friendly
- [ ] Verificar navegación en mobile (BottomNav)
- [ ] Verificar navegación en desktop (Sidebar)

### Dark/Light Mode
- [ ] Verificar que todos los componentes soporten ambos modos
- [ ] Ajustar colores que no tengan buen contraste
- [ ] Verificar legibilidad de textos
- [ ] Persistir preferencia del usuario

### Performance
- [ ] Implementar lazy loading de rutas
- [ ] Implementar lazy loading de imágenes
- [ ] Optimizar imágenes (WebP, tamaños responsivos)
- [ ] Implementar infinite scroll donde aplique
- [ ] Implementar optimistic updates en mutations críticas
- [ ] Revisar bundle size y optimizar
- [ ] Implementar code splitting
- [ ] Implementar Service Worker para caching (opcional)

### Testing Backend
- [ ] Tests unitarios de services:
  - [ ] AuthService
  - [ ] UsersService
  - [ ] MembershipsService
  - [ ] AttendanceService
  - [ ] ExercisesService
  - [ ] RoutinesService
  - [ ] ClassesService
  - [ ] BookingsService
  - [ ] PaymentsService
  - [ ] AnnouncementsService
  - [ ] DashboardService
- [ ] Tests de guards:
  - [ ] JwtAuthGuard
  - [ ] RolesGuard
- [ ] Tests e2e de endpoints críticos:
  - [ ] Auth flow completo
  - [ ] Check-in con QR
  - [ ] Reserva de clase
  - [ ] Crear membresía
  - [ ] Registrar pago
- [ ] Verificar coverage > 70%

### Testing Frontend
- [ ] Tests unitarios de componentes UI
- [ ] Tests de custom hooks
- [ ] Tests de utilities
- [ ] Tests e2e con Playwright:
  - [ ] Flujo de login
  - [ ] Flujo de registro
  - [ ] Ver membresía
  - [ ] Reservar clase
  - [ ] Cancelar reserva
  - [ ] Check-in QR (admin)
  - [ ] Crear ejercicio (admin)
  - [ ] Crear rutina (admin)
  - [ ] Registrar pago (admin)
- [ ] Testear en diferentes navegadores (Chrome, Firefox, Safari)
- [ ] Testear en dispositivos reales (iOS, Android)

### Seguridad
- [ ] Revisar todos los endpoints con Guards correctos
- [ ] Verificar validaciones en todos los DTOs
- [ ] Verificar sanitización de inputs
- [ ] Configurar CORS correctamente
- [ ] Configurar rate limiting en endpoints críticos
- [ ] Revisar que passwords se hasheen correctamente
- [ ] Verificar que tokens expiren correctamente
- [ ] Revisar que no se expongan datos sensibles en APIs
- [ ] Audit de dependencias (npm audit)

### Documentation
- [ ] Documentar API con Swagger/OpenAPI
- [ ] Crear README.md del backend con:
  - [ ] Instrucciones de instalación
  - [ ] Variables de entorno
  - [ ] Comandos disponibles
  - [ ] Cómo ejecutar migraciones y seeds
- [ ] Crear README.md del frontend con:
  - [ ] Instrucciones de instalación
  - [ ] Variables de entorno
  - [ ] Comandos disponibles
  - [ ] Estructura de carpetas
- [ ] Documentar decisiones arquitectónicas importantes

### Deployment
- [ ] Backend:
  - [ ] Configurar Railway/Render
  - [ ] Configurar base de datos PostgreSQL
  - [ ] Configurar variables de entorno
  - [ ] Ejecutar migraciones en producción
  - [ ] Ejecutar seeds iniciales (ejercicios base)
  - [ ] Configurar dominio (opcional)
  - [ ] Configurar HTTPS
  - [ ] Configurar backup de base de datos
- [ ] Frontend:
  - [ ] Configurar Vercel/Netlify
  - [ ] Configurar variables de entorno
  - [ ] Configurar dominio (opcional)
  - [ ] Configurar redirects para SPA
- [ ] CI/CD:
  - [ ] Configurar GitHub Actions para tests automáticos
  - [ ] Configurar deploy automático en merge a main
- [ ] Monitoreo:
  - [ ] Configurar logging (opcional)
  - [ ] Configurar error tracking (Sentry, opcional)

### Final Checks
- [ ] Crear usuario admin por defecto
- [ ] Crear datos de ejemplo (ejercicios, clases)
- [ ] Probar flujo completo end-to-end en producción
- [ ] Verificar que todas las features funcionan
- [ ] Verificar performance en producción
- [ ] Revisar que notificaciones funcionen
- [ ] Hacer prueba con usuarios reales (beta testing)

---

## 🚀 Extras Opcionales (Si hay tiempo)

### Nice to Have
- [ ] Implementar búsqueda global
- [ ] Implementar modo offline básico (Service Worker)
- [ ] Agregar animaciones y transiciones suaves
- [ ] Implementar skeleton loaders
- [ ] Agregar tooltips informativos
- [ ] Implementar tour guiado para nuevos usuarios
- [ ] Agregar página de FAQ
- [ ] Implementar chat de soporte (Tawk.to, Crisp)
- [ ] Agregar analíticas (Google Analytics, Mixpanel)
- [ ] Implementar sistema de logs más robusto
- [ ] Agregar página de términos y condiciones
- [ ] Agregar página de política de privacidad

---

## 📊 Criterios de Aceptación del MVP

### Funcionalidades Mínimas
- ✅ Usuario puede registrarse (email, Google, Apple)
- ✅ Usuario puede hacer login
- ✅ Usuario puede ver su perfil y editarlo
- ✅ Usuario puede ver su membresía (tipo, vencimiento, estado)
- ✅ Usuario puede ver su código QR personal
- ✅ Usuario puede ver su historial de asistencia
- ✅ Usuario puede explorar biblioteca de ejercicios (con filtros)
- ✅ Usuario puede ver detalle de ejercicios (con video)
- ✅ Usuario puede explorar rutinas (con filtros)
- ✅ Usuario puede ver detalle de rutinas con ejercicios
- ✅ Usuario puede marcar rutinas como favoritas
- ✅ Usuario puede ver clases grupales disponibles
- ✅ Usuario puede reservar una clase
- ✅ Usuario puede cancelar una reserva
- ✅ Usuario puede ver sus reservas (próximas y pasadas)
- ✅ Usuario puede ver historial de pagos
- ✅ Usuario puede ver anuncios del gimnasio
- ✅ Admin puede ver dashboard con estadísticas
- ✅ Admin puede gestionar socios (CRUD)
- ✅ Admin puede gestionar membresías (CRUD)
- ✅ Admin puede hacer check-in manual o con escáner QR
- ✅ Admin puede gestionar clases (CRUD)
- ✅ Admin puede ver reservas de una clase
- ✅ Admin puede gestionar ejercicios (CRUD)
- ✅ Admin puede gestionar rutinas (CRUD)
- ✅ Admin puede registrar pagos
- ✅ Admin puede ver todos los pagos
- ✅ Admin puede gestionar anuncios (CRUD)

### Calidad
- ✅ App responsive (mobile, tablet, desktop)
- ✅ App funciona correctamente en móvil
- ✅ Autenticación segura (JWT + OAuth)
- ✅ Validaciones en frontend y backend
- ✅ Manejo de errores apropiado
- ✅ Feedback visual en todas las acciones
- ✅ Performance aceptable (< 3s carga inicial)
- ✅ Tests > 70% coverage
- ✅ Sin bugs críticos

---

## 📝 Notas

- Marca cada tarea con ✅ al completarla
- Si una tarea está bloqueada, agrega una nota explicando el bloqueo
- Si descubres nuevas tareas durante el desarrollo, agrégalas aquí
- Actualiza este documento regularmente

---

**Última actualización**: 2024-11-10
