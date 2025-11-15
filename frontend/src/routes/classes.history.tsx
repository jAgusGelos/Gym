import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Award,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  useBookingHistory,
  useAttendanceStats,
  useMonthlyAttendance,
} from "../hooks/useClasses";

export function ClassHistoryPage() {
  const [page, setPage] = useState(1);
  const { data: history, isLoading: loadingHistory } = useBookingHistory(
    page,
    10
  );
  const { data: stats, isLoading: loadingStats } = useAttendanceStats();
  const { data: monthlyData, isLoading: loadingMonthly } =
    useMonthlyAttendance(6);

  if (loadingHistory || loadingStats || loadingMonthly) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/classes"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <Calendar className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Historial de Clases
            </h1>
            <p className="text-sm text-gray-600">
              Tu registro de asistencia y estadísticas
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Asistidas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.attendedClasses}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tasa de Asistencia</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.attendanceRate}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Award className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Racha Actual</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.currentStreak} días
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Canceladas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.canceledClasses}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Favorite Instructor */}
      {stats?.favoriteInstructor && (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-4">
            <Award className="w-12 h-12 text-purple-200" />
            <div>
              <p className="text-purple-100 text-sm mb-1">
                Instructor Favorito
              </p>
              <p className="text-2xl font-bold">
                {stats.favoriteInstructor.nombre}
              </p>
              <p className="text-purple-100 text-sm">
                {stats.favoriteInstructor.classCount} clases asistidas
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Chart */}
      {monthlyData && monthlyData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Asistencia por Mes (Últimos 6 meses)
          </h2>
          <MonthlyChart data={monthlyData} />
        </div>
      )}

      {/* History List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Historial Detallado
          </h2>
        </div>

        {!history || history.data.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay historial
            </h3>
            <p className="text-gray-600">
              Aún no has asistido a ninguna clase. ¡Reserva tu primera clase!
            </p>
            <Link
              to="/classes"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Ver Clases Disponibles
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {history.data.map((booking: any) => (
                <div
                  key={booking.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(booking.estado)}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {booking.class?.nombre || "Clase"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {booking.class?.instructor
                              ? `con ${booking.class.instructor.nombre} ${booking.class.instructor.apellido}`
                              : "Sin instructor"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {booking.class?.fechaHoraInicio &&
                            format(
                              new Date(booking.class.fechaHoraInicio),
                              "d 'de' MMMM, yyyy 'a las' HH:mm",
                              { locale: es }
                            )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                          booking.estado
                        )}`}
                      >
                        {getStatusText(booking.estado)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {history.totalPages > 1 && (
              <div className="p-6 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-600">
                  Página {page} de {history.totalPages}
                </span>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(history.totalPages, p + 1))
                  }
                  disabled={page === history.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function getStatusIcon(estado: string) {
  switch (estado) {
    case "ASISTIDO":
      return (
        <div className="p-2 bg-green-100 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
      );
    case "CANCELADO":
      return (
        <div className="p-2 bg-red-100 rounded-lg">
          <XCircle className="w-5 h-5 text-red-600" />
        </div>
      );
    case "NO_ASISTIDO":
      return (
        <div className="p-2 bg-yellow-100 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
        </div>
      );
    default:
      return (
        <div className="p-2 bg-gray-100 rounded-lg">
          <Calendar className="w-5 h-5 text-gray-600" />
        </div>
      );
  }
}

function getStatusBadgeColor(estado: string) {
  switch (estado) {
    case "ASISTIDO":
      return "bg-green-100 text-green-700";
    case "CANCELADO":
      return "bg-red-100 text-red-700";
    case "NO_ASISTIDO":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getStatusText(estado: string) {
  switch (estado) {
    case "ASISTIDO":
      return "Asistida";
    case "CANCELADO":
      return "Cancelada";
    case "NO_ASISTIDO":
      return "No Asistida";
    default:
      return "Desconocido";
  }
}

function MonthlyChart({ data }: { data: any[] }) {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d.count));
  const chartHeight = 200;
  const chartWidth = 600;
  const barWidth = chartWidth / data.length - 20;
  const barSpacing = (chartWidth - barWidth * data.length) / (data.length + 1);

  return (
    <div className="overflow-x-auto">
      <svg width={chartWidth} height={chartHeight + 60} className="mx-auto">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((percent) => {
          const y = chartHeight * (1 - percent);
          const value = Math.round(maxValue * percent);
          return (
            <g key={percent}>
              <line
                x1="0"
                y1={y}
                x2={chartWidth}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text
                x="-5"
                y={y + 5}
                fontSize="12"
                fill="#6b7280"
                textAnchor="end"
              >
                {value}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (item.count / maxValue) * chartHeight;
          const x = barSpacing + index * (barWidth + barSpacing);
          const y = chartHeight - barHeight;

          return (
            <g key={item.month}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#6366f1"
                rx="4"
              />
              <text
                x={x + barWidth / 2}
                y={y - 5}
                fontSize="12"
                fill="#374151"
                textAnchor="middle"
                fontWeight="600"
              >
                {item.count}
              </text>
              <text
                x={x + barWidth / 2}
                y={chartHeight + 20}
                fontSize="11"
                fill="#6b7280"
                textAnchor="middle"
              >
                {getMonthName(item.month)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function getMonthName(monthKey: string) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [year, month] = monthKey.split("-");
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  return months[parseInt(month) - 1];
}
