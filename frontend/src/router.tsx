import { createRouter, createRootRoute, createRoute, Outlet, Navigate } from '@tanstack/react-router';
import { LoginPage } from './routes/login';
import { RegisterPage } from './routes/register';
import { DashboardPage } from './routes/dashboard';
import { ProfilePage } from './routes/profile';
import { QRPage } from './routes/qr';
import { ClassesPage } from './routes/classes';
import { RoutinesPage } from './routes/routines';
import { AdminDashboard } from './routes/admin/dashboard';
import { MembersPage } from './routes/admin/members';
import { AdminClassesPage } from './routes/admin/classes';
import { AttendancePage } from './routes/admin/attendance';
import { PaymentsPage } from './routes/admin/payments';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MobileLayout } from './components/layouts/MobileLayout';
import { AdminLayout } from './components/layouts/AdminLayout';
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
      <MobileLayout>
        <DashboardPage />
      </MobileLayout>
    </ProtectedRoute>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => (
    <ProtectedRoute>
      <MobileLayout>
        <ProfilePage />
      </MobileLayout>
    </ProtectedRoute>
  ),
});

const qrRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/qr',
  component: () => (
    <ProtectedRoute>
      <MobileLayout>
        <QRPage />
      </MobileLayout>
    </ProtectedRoute>
  ),
});

const classesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/classes',
  component: () => (
    <ProtectedRoute>
      <MobileLayout>
        <ClassesPage />
      </MobileLayout>
    </ProtectedRoute>
  ),
});

const routinesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/routines',
  component: () => (
    <ProtectedRoute>
      <MobileLayout>
        <RoutinesPage />
      </MobileLayout>
    </ProtectedRoute>
  ),
});

// Admin routes
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.RECEPCIONISTA]}>
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    </ProtectedRoute>
  ),
});

const adminMembersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/members',
  component: () => (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.RECEPCIONISTA]}>
      <AdminLayout>
        <MembersPage />
      </AdminLayout>
    </ProtectedRoute>
  ),
});

const adminClassesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/classes',
  component: () => (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.RECEPCIONISTA]}>
      <AdminLayout>
        <AdminClassesPage />
      </AdminLayout>
    </ProtectedRoute>
  ),
});

const adminAttendanceRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/attendance',
  component: () => (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.RECEPCIONISTA]}>
      <AdminLayout>
        <AttendancePage />
      </AdminLayout>
    </ProtectedRoute>
  ),
});

const adminPaymentsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/payments',
  component: () => (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <AdminLayout>
        <PaymentsPage />
      </AdminLayout>
    </ProtectedRoute>
  ),
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
