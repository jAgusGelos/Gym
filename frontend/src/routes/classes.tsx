import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  useClasses,
  useMyBookings,
  useCreateBooking,
  useCancelBooking,
} from "../hooks/useClasses";
import { Button, Card, CardContent, Loading } from "../components/ui";
import { useToast } from "../stores/toastStore";
import {
  Calendar,
  Clock,
  Users,
  UserCheck,
  AlertCircle,
  History,
  User as UserIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { DayOfWeek } from "../types/class.types";
import { addDays, startOfWeek, format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { AxiosErrorType } from "../types/error.types";

const DAY_NAMES = {
  [DayOfWeek.SUNDAY]: 'Domingo',
  [DayOfWeek.MONDAY]: 'Lunes',
  [DayOfWeek.TUESDAY]: 'Martes',
  [DayOfWeek.WEDNESDAY]: 'Miércoles',
  [DayOfWeek.THURSDAY]: 'Jueves',
  [DayOfWeek.FRIDAY]: 'Viernes',
  [DayOfWeek.SATURDAY]: 'Sábado',
};

export const ClassesPage = () => {
  const [activeTab, setActiveTab] = useState<"available" | "my-bookings">("available");
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const { data: classesData, isLoading } = useClasses();
  const { data: myBookingsData, isLoading: isLoadingBookings } = useMyBookings();
  const createBooking = useCreateBooking();
  const cancelBooking = useCancelBooking();
  const toast = useToast();

  const classes = classesData?.data || [];
  const myBookings = Array.isArray(myBookingsData) ? myBookingsData : myBookingsData?.data || [];

  // Helper para parsear fecha del backend en zona horaria local
  const parseLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Verificar si ya tiene una reserva para un horario y fecha específicos
  const hasBooking = (scheduleId: string, date: Date) => {
    return myBookings.some(
      (b) =>
        b.scheduleId === scheduleId &&
        isSameDay(parseLocalDate(b.classDate), date) &&
        b.estado === 'RESERVADO'
    );
  };

  // Obtener la reserva para un horario y fecha específicos
  const getBooking = (scheduleId: string, date: Date) => {
    return myBookings.find(
      (b) =>
        b.scheduleId === scheduleId &&
        isSameDay(parseLocalDate(b.classDate), date) &&
        b.estado === 'RESERVADO'
    );
  };

  const handleBookClass = async (scheduleId: string, date: Date, className: string) => {
    try {
      // Asegurarse de que la fecha se envíe en la zona horaria local
      const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const formattedDate = format(localDate, 'yyyy-MM-dd');

      await createBooking.mutateAsync({
        scheduleId,
        classDate: formattedDate,
      });
      toast.success(`Reserva confirmada para ${className}`);
    } catch (error: AxiosErrorType) {
      toast.error(error.response?.data?.message || 'Error al reservar la clase');
    }
  };

  const handleCancelBooking = async (bookingId: string, className: string) => {
    if (confirm(`¿Estás seguro de que querés cancelar tu reserva para ${className}?`)) {
      try {
        await cancelBooking.mutateAsync(bookingId);
        toast.success('Reserva cancelada correctamente');
      } catch (error: AxiosErrorType) {
        toast.error(error.response?.data?.message || 'Error al cancelar la reserva');
      }
    }
  };

  const goToPreviousDay = () => {
    setSelectedDate(addDays(selectedDate, -1));
  };

  const goToNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const isToday = isSameDay(selectedDate, new Date());

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-primary-600 text-white p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Clases</h1>
          </div>
          <Link
            to="/classes/history"
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <History className="w-4 h-4" />
            <span className="text-sm font-medium">Ver Historial</span>
          </Link>
        </div>
        <p className="text-primary-100">
          Reservá tu lugar en las clases disponibles
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          <button
            onClick={() => setActiveTab("available")}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === "available"
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Clases Disponibles
          </button>
          <button
            onClick={() => setActiveTab("my-bookings")}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === "my-bookings"
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Mis Reservas
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Available Classes Tab */}
        {activeTab === "available" && (
          <>
            {/* Selector de día */}
            <div className="bg-white dark:bg-gray-800 p-4 mb-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousDay}
                  className="flex-shrink-0"
                >
                  ← Anterior
                </Button>

                <div className="flex flex-col items-center flex-1">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {format(selectedDate, "EEEE", { locale: es })}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}
                  </p>
                  {!isToday && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={goToToday}
                      className="mt-2 text-xs"
                    >
                      Volver a hoy
                    </Button>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextDay}
                  className="flex-shrink-0"
                >
                  Siguiente →
                </Button>
              </div>
            </div>

            {isLoading ? (
              <Loading className="py-12" />
            ) : (
              <div className="space-y-3">
                {(() => {
                  const dayOfWeek = selectedDate.getDay();

                  // Filtrar clases que tienen horarios para este día
                  const classesForDay = classes.filter((classItem) =>
                    classItem.schedules.some((s) => s.dayOfWeek === dayOfWeek && s.activo)
                  );

                  if (classesForDay.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                          No hay clases disponibles para este día
                        </p>
                      </div>
                    );
                  }

                  return classesForDay.flatMap((classItem) => {
                    // Filtrar solo los horarios de este día
                    const schedulesForDay = classItem.schedules
                      .filter((s) => s.dayOfWeek === dayOfWeek && s.activo)
                      .sort((a, b) => a.startTime.localeCompare(b.startTime));

                    return schedulesForDay.map((schedule) => {
                      const booking = getBooking(schedule.id!, selectedDate);
                      const isBooked = !!booking;
                      const isPast = selectedDate < new Date() && !isSameDay(selectedDate, new Date());

                      return (
                        <Card key={schedule.id}>
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                  {classItem.nombre}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  {classItem.descripcion}
                                </p>
                              </div>
                              {isBooked && (
                                <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-full flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Reservado
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {schedule.startTime} - {schedule.endTime}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <UserIcon className="w-4 h-4" />
                                <span>
                                  {schedule.instructor?.nombre} {schedule.instructor?.apellido}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Users className="w-4 h-4" />
                                <span>
                                  Cupo: {schedule.cupoMaximo || classItem.cupoMaximo} personas
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              {isBooked && booking?.enListaEspera && (
                                <p className="text-sm text-amber-600 dark:text-amber-400">
                                  En lista de espera - Posición: {booking.posicionListaEspera}
                                </p>
                              )}

                              {isBooked ? (
                                <Button
                                  variant="outline"
                                  className="w-full"
                                  onClick={() => handleCancelBooking(booking!.id, classItem.nombre)}
                                  isLoading={cancelBooking.isPending}
                                  disabled={isPast}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Cancelar Reserva
                                </Button>
                              ) : (
                                <Button
                                  className="w-full"
                                  onClick={() => handleBookClass(schedule.id!, selectedDate, classItem.nombre)}
                                  isLoading={createBooking.isPending}
                                  disabled={isPast || isBooked}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  {isPast ? 'Clase Pasada' : isBooked ? 'Reservado' : 'Reservar'}
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    });
                  });
                })()}
              </div>
            )}
          </>
        )}

        {/* My Bookings Tab */}
        {activeTab === "my-bookings" && (
          <>
            {isLoadingBookings ? (
              <Loading className="py-12" />
            ) : (
              <div className="space-y-4">
                {myBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {booking.class?.nombre || 'Clase'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.schedule?.instructor?.nombre} {booking.schedule?.instructor?.apellido}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              booking.estado === "RESERVADO"
                                ? "bg-green-100 text-green-700"
                                : booking.estado === "CANCELADO"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {booking.estado}
                          </span>
                          {booking.enListaEspera && (
                            <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                              Lista de espera #{booking.posicionListaEspera}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(parseLocalDate(booking.classDate), "d 'de' MMMM", { locale: es })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>
                            {booking.schedule?.startTime.substring(0, 5)} - {booking.schedule?.endTime.substring(0, 5)}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Reservado el{" "}
                        {format(new Date(booking.fechaReserva), "d 'de' MMMM, yyyy", { locale: es })}
                      </p>

                      {booking.estado === "RESERVADO" && (
                        <Button
                          variant="outline"
                          onClick={() => handleCancelBooking(booking.id, booking.class?.nombre || 'la clase')}
                          className="w-full"
                          isLoading={cancelBooking.isPending}
                        >
                          Cancelar reserva
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {myBookings.length === 0 && (
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
