import { ReactNode } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Home, Calendar, Dumbbell, QrCode, User, Megaphone, TrendingUp, Trophy } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MobileLayoutProps {
  children: ReactNode;
}

export const MobileLayout = ({ children }: MobileLayoutProps) => {
  const location = useLocation();

  const navItems = [
    {
      path: '/dashboard',
      icon: Home,
      label: 'Inicio',
    },
    {
      path: '/news',
      icon: Megaphone,
      label: 'Noticias',
    },
    {
      path: '/classes',
      icon: Calendar,
      label: 'Clases',
    },
    {
      path: '/routines',
      icon: Dumbbell,
      label: 'Rutinas',
    },
    {
      path: '/progress',
      icon: TrendingUp,
      label: 'Progreso',
    },
    {
      path: '/achievements',
      icon: Trophy,
      label: 'Logros',
    },
    {
      path: '/profile',
      icon: User,
      label: 'Perfil',
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-inset-bottom">
        <div className="grid grid-cols-7 h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 transition-colors',
                  isActive
                    ? 'text-primary-600 dark:text-primary-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
