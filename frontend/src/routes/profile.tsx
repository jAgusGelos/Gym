import { useAuth } from '../hooks/useAuth';
import { Button, Card, CardHeader, CardTitle, CardContent } from '../components/ui';
import { Mail, Phone, User as UserIcon, Calendar, Award, LogOut, Settings } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { UserRole } from '../types/user.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const ProfilePage = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const isStaff = [UserRole.ADMIN, UserRole.RECEPCIONISTA, UserRole.ENTRENADOR].includes(user.rol as UserRole);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-primary-600 text-white p-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Mi Perfil</h1>
          <Button
            variant="ghost"
            onClick={logout}
            className="text-white hover:bg-primary-700"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* Avatar y nombre */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
            <UserIcon className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {user.nombre} {user.apellido}
            </h2>
            <p className="text-primary-100 capitalize">{user.rol.toLowerCase()}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-4">
        {/* Información personal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
              </div>
            </div>

            {user.telefono && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
                  <p className="font-medium text-gray-900 dark:text-white">{user.telefono}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Miembro desde</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {format(new Date(user.fechaRegistro), "d 'de' MMMM, yyyy", { locale: es })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estado de cuenta */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estado de Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                  <p className="font-medium text-green-600">
                    {user.activo ? 'Activo' : 'Inactivo'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Panel de Administración */}
        {isStaff && (
          <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Panel de Administración</h3>
                  <p className="text-sm text-indigo-100">
                    Gestionar {user.rol === UserRole.ADMIN ? 'todo el gimnasio' :
                              user.rol === UserRole.ENTRENADOR ? 'ejercicios y rutinas' :
                              'socios y clases'}
                  </p>
                </div>
                <Settings className="w-8 h-8 text-indigo-100" />
              </div>
              <Link to="/admin">
                <Button className="w-full mt-4 bg-white text-indigo-600 hover:bg-indigo-50">
                  Ir al Panel
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Acciones */}
        <div className="space-y-2">
          <Button variant="outline" className="w-full">
            Editar Perfil
          </Button>
          <Button variant="outline" className="w-full">
            Cambiar Contraseña
          </Button>
        </div>
      </div>
    </div>
  );
};
