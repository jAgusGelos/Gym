import { useState } from 'react';
import { Trophy, Award, Target, Sparkles, Lock, Check } from 'lucide-react';
import { useMyAchievements, useAchievementStats, useCheckAchievements } from '../hooks/useAchievements';
import { AchievementCategory } from '../types/achievement.types';
import { cn } from '../utils/cn';

export const AchievementsPage = () => {
  const { data: achievements = [], isLoading } = useMyAchievements();
  const { data: stats } = useAchievementStats();
  const checkAchievements = useCheckAchievements();
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'TODAS'>('TODAS');

  const handleRefresh = async () => {
    await checkAchievements.mutateAsync();
  };

  const filteredAchievements = achievements.filter(
    (a) => selectedCategory === 'TODAS' || a.achievement.categoria === selectedCategory
  );

  // Ordenar: completados primero, luego en progreso, luego bloqueados
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    if (a.completado && !b.completado) return -1;
    if (!a.completado && b.completado) return 1;
    if (a.progresoActual > 0 && b.progresoActual === 0) return -1;
    if (a.progresoActual === 0 && b.progresoActual > 0) return 1;
    return a.achievement.orden - b.achievement.orden;
  });

  const categoryLabels = {
    TODAS: 'Todos',
    ASISTENCIA: 'Asistencia',
    ENTRENAMIENTO: 'Entrenamientos',
    PROGRESO: 'Progreso',
    SOCIAL: 'Social',
  };

  const categoryIcons = {
    TODAS: Target,
    ASISTENCIA: Trophy,
    ENTRENAMIENTO: Award,
    PROGRESO: Sparkles,
    SOCIAL: Trophy,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando logros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header con stats */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Trophy className="w-8 h-8" />
              Logros
            </h1>
            <p className="text-primary-100 mt-1">Tu progreso y recompensas</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={checkAchievements.isPending}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {checkAchievements.isPending ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">{stats.puntosTotal}</div>
              <div className="text-sm text-primary-100">Puntos</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">{stats.logrosCompletados}</div>
              <div className="text-sm text-primary-100">Completados</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">{stats.porcentajeCompletado}%</div>
              <div className="text-sm text-primary-100">Progreso</div>
            </div>
          </div>
        )}
      </div>

      {/* Filtros de categoría */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 overflow-x-auto">
        <div className="flex gap-2">
          {Object.entries(categoryLabels).map(([key, label]) => {
            const Icon = categoryIcons[key as keyof typeof categoryIcons];
            const isActive = selectedCategory === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as AchievementCategory | 'TODAS')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de logros */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedAchievements.map((userAchievement) => {
            const { achievement, progresoActual, completado, fechaCompletado } = userAchievement;
            const porcentaje = Math.min((progresoActual / achievement.objetivo) * 100, 100);
            const enProgreso = progresoActual > 0 && !completado;
            const bloqueado = progresoActual === 0 && !completado;

            return (
              <div
                key={achievement.id}
                className={cn(
                  'relative rounded-2xl p-6 border-2 transition-all duration-300',
                  completado
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-400 shadow-lg shadow-yellow-200/50'
                    : enProgreso
                    ? 'bg-white dark:bg-gray-800 border-primary-300 dark:border-primary-700'
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60'
                )}
              >
                {/* Badge de completado */}
                {completado && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-lg">
                    <Check className="w-5 h-5" />
                  </div>
                )}

                {/* Icono del logro */}
                <div
                  className={cn(
                    'text-6xl mb-4 flex items-center justify-center h-20',
                    bloqueado && 'filter grayscale opacity-50'
                  )}
                >
                  {bloqueado ? <Lock className="w-16 h-16 text-gray-400" /> : achievement.icono}
                </div>

                {/* Nombre y descripción */}
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {achievement.nombre}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {achievement.descripcion}
                </p>

                {/* Progreso */}
                {!completado && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Progreso</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {progresoActual} / {achievement.objetivo}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-gray-900 dark:text-white">
                      {achievement.puntos} pts
                    </span>
                  </div>
                  {completado && fechaCompletado && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(fechaCompletado).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Estado vacío */}
        {sortedAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay logros en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
};
