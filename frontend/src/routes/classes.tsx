import { useState } from 'react';
import { useClasses, useMyBookings, useCreateBooking, useCancelBooking } from '../hooks/useClasses';
import { Button, Card, CardHeader, CardTitle, CardContent, Loading } from '../components/ui';
import { Calendar, Clock, Users, UserCheck, AlertCircle } from 'lucide-react';
import { Class } from '../types/class.types';

export const ClassesPage = () => {
  const [activeTab, setActiveTab] = useState<'available' | 'my-bookings'>('available');
  const { data: classesData, isLoading } = useClasses();
  const { data: myBookings, isLoading: isLoadingBookings } = useMyBookings();
  const createBooking = useCreateBooking();
  const cancelBooking = useCancelBooking();

  const handleBookClass = (classId: string) => {
    createBooking.mutate({ classId });
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('¿Estás seguro de que querés cancelar esta reserva?')) {
      cancelBooking.mutate(bookingId);
    }
  };

  const getAvailableSpots = (classItem: Class) => {
    return classItem.cupoMaximo - classItem.cupoActual;
  };

  const isClassFull = (classItem: Class) => {
    return classItem.cupoActual >= classItem.cupoMaximo;
  };

  const isClassBooked = (classId: string) => {
    return myBookings?.some(booking => booking.classId === classId && booking.estado === 'RESERVADO');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-primary-600 text-white p-6">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Clases</h1>
        </div>
        <p className="text-primary-100">
          Reservá tu lugar en las clases disponibles
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'available'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Clases Disponibles
          </button>
          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'my-bookings'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Mis Reservas
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Available Classes Tab */}
        {activeTab === 'available' && (
          <>
            {isLoading ? (
              <Loading className="py-12" />
            ) : (
              <div className="space-y-4">
                {classesData?.data.map((classItem) => {
                  const availableSpots = getAvailableSpots(classItem);
                  const isFull = isClassFull(classItem);
                  const isBooked = isClassBooked(classItem.id);

                  return (
                    <Card key={classItem.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {classItem.nombre}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {classItem.instructor?.nombre} {classItem.instructor?.apellido}
                            </p>
                          </div>
                          {isFull ? (
                            <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                              Lleno
                            </span>
                          ) : (
                            <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                              {availableSpots} lugares
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {classItem.descripcion}
                        </p>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {new Date(classItem.fechaHora).toLocaleDateString('es-AR')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {classItem.duracion} min
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {classItem.cupoActual}/{classItem.cupoMaximo}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {new Date(classItem.fechaHora).toLocaleTimeString('es-AR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>

                        {isBooked ? (
                          <Button variant="outline" className="w-full" disabled>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Ya reservaste esta clase
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleBookClass(classItem.id)}
                            className="w-full"
                            disabled={!classItem.activo || createBooking.isPending}
                            isLoading={createBooking.isPending}
                          >
                            {isFull ? 'Unirse a lista de espera' : 'Reservar clase'}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}

                {classesData?.data.length === 0 && (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No hay clases disponibles en este momento
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* My Bookings Tab */}
        {activeTab === 'my-bookings' && (
          <>
            {isLoadingBookings ? (
              <Loading className="py-12" />
            ) : (
              <div className="space-y-4">
                {myBookings?.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              booking.estado === 'RESERVADO'
                                ? 'bg-green-100 text-green-700'
                                : booking.estado === 'CANCELADO'
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {booking.estado}
                          </span>
                          {booking.enListaEspera && (
                            <span className="ml-2 px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                              Lista de espera #{booking.posicionListaEspera}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Reservado el {new Date(booking.createdAt).toLocaleDateString('es-AR')}
                      </p>

                      {booking.estado === 'RESERVADO' && (
                        <Button
                          variant="outline"
                          onClick={() => handleCancelBooking(booking.id)}
                          className="w-full"
                          isLoading={cancelBooking.isPending}
                        >
                          Cancelar reserva
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {myBookings?.length === 0 && (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No tenés reservas activas
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
