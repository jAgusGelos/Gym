import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from '@tanstack/react-router';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '../components/ui';
import { useRegister } from '../hooks/useAuth';
import { RegisterData } from '../types/auth.types';

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  telefono: z.string().optional(),
});

export const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo o título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600 mb-2">GymApp</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Creá tu cuenta
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registrarse</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="tu@email.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Nombre"
                  placeholder="Juan"
                  error={errors.nombre?.message}
                  {...register('nombre')}
                />

                <Input
                  label="Apellido"
                  placeholder="Pérez"
                  error={errors.apellido?.message}
                  {...register('apellido')}
                />
              </div>

              <Input
                label="Teléfono (opcional)"
                type="tel"
                placeholder="+54 9 11 1234-5678"
                error={errors.telefono?.message}
                {...register('telefono')}
              />

              <div className="relative">
                <Input
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              {registerMutation.isError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {registerMutation.error instanceof Error
                      ? registerMutation.error.message
                      : 'Error al registrarse. Intentá nuevamente.'}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                isLoading={registerMutation.isPending}
              >
                Crear Cuenta
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ¿Ya tenés cuenta?{' '}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Iniciá sesión
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
