import { useAuth } from '../hooks/useAuth';
import { Button, Card, CardHeader, CardTitle, CardContent } from '../components/ui';

export const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <Button variant="outline" onClick={logout}>
            Cerrar Sesión
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bienvenido!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Nombre:</strong> {user?.nombre} {user?.apellido}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Email:</strong> {user?.email}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Rol:</strong> {user?.rol}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
