import { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "../../hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  Calendar,
  QrCode,
  CreditCard,
  Bell,
  LogOut,
  Menu,
  X,
  Dumbbell,
  ClipboardList,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "../ui";
import { useState } from "react";
import { NotificationBell } from "../notifications/NotificationBell";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    {
      path: "/admin",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      path: "/adm/members",
      icon: Users,
      label: "Socios",
    },
    {
      path: "/adm/classes",
      icon: Calendar,
      label: "Clases",
    },
    {
      path: "/adm/attendance",
      icon: QrCode,
      label: "Asistencia",
    },
    {
      path: "/adm/payments",
      icon: CreditCard,
      label: "Pagos",
    },
    {
      path: "/adm/plans",
      icon: CreditCard,
      label: "Planes",
    },
    {
      path: "/adm/exercises",
      icon: Dumbbell,
      label: "Ejercicios",
    },
    {
      path: "/adm/routines",
      icon: ClipboardList,
      label: "Rutinas",
    },
    {
      path: "/adm/announcements",
      icon: Bell,
      label: "Anuncios",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header del sidebar */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">GymApp Admin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navegación */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Usuario y acciones */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.nombre} {user?.apellido}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {user?.rol.toLowerCase()}
            </p>
          </div>
          <Button variant="outline" onClick={logout} className="w-full">
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <NotificationBell />
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  Ver como usuario
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};
