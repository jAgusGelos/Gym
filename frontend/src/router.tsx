import { createRouter, createRootRoute, createRoute, Outlet, Navigate } from '@tanstack/react-router';
import { LoginPage } from './routes/login';
import { RegisterPage } from './routes/register';
import { DashboardPage } from './routes/dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserRole } from './types/user.types';

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Public routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <Navigate to="/login" />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
});

// Protected routes
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => <div>Profile</div>,
});

const qrRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/qr',
  component: () => <div>Mi QR</div>,
});

const classesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/classes',
  component: () => <div>Clases</div>,
});

const routinesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/routines',
  component: () => <div>Rutinas</div>,
});

// Admin routes
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => <div>Admin</div>,
});

const adminMembersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/members',
  component: () => <div>Gestión de Socios</div>,
});

const adminClassesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/classes',
  component: () => <div>Gestión de Clases</div>,
});

const adminAttendanceRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/attendance',
  component: () => <div>Control de Asistencia</div>,
});

const adminPaymentsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/payments',
  component: () => <div>Gestión de Pagos</div>,
});

// Route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  dashboardRoute,
  profileRoute,
  qrRoute,
  classesRoute,
  routinesRoute,
  adminRoute.addChildren([
    adminMembersRoute,
    adminClassesRoute,
    adminAttendanceRoute,
    adminPaymentsRoute,
  ]),
]);

// Create router
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

// Register router types
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
