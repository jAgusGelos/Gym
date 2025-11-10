import { useState } from 'react';
import { useRoutines, useFavoriteRoutines, useToggleFavorite } from '../hooks/useRoutines';
import { Button, Card, CardContent, Loading } from '../components/ui';
import { Dumbbell, Heart, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { Routine, RoutineLevel, RoutineGoal } from '../types/routine.types';

export const RoutinesPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [filters, setFilters] = useState<{ nivel?: RoutineLevel; objetivo?: RoutineGoal }>({});

  const { data: routinesData, isLoading } = useRoutines(1, 20, { ...filters, publico: true });
  const { data: favoritesData, isLoading: isLoadingFavorites } = useFavoriteRoutines();
  const toggleFavorite = useToggleFavorite();

  const handleToggleFavorite = (routineId: string) => {
    toggleFavorite.mutate(routineId);
  };

  const getLevelColor = (nivel: RoutineLevel) => {
    switch (nivel) {
      case RoutineLevel.PRINCIPIANTE:
        return 'bg-green-100 text-green-700';
      case RoutineLevel.INTERMEDIO:
        return 'bg-yellow-100 text-yellow-700';
      case RoutineLevel.AVANZADO:
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getGoalIcon = (objetivo: RoutineGoal) => {
    switch (objetivo) {
      case RoutineGoal.FUERZA:
        return '💪';
      case RoutineGoal.HIPERTROFIA:
        return '🏋️';
      case RoutineGoal.RESISTENCIA:
        return '🏃';
      case RoutineGoal.PERDIDA_PESO:
        return '🔥';
      case RoutineGoal.MOVILIDAD:
        return '🧘';
      default:
        return '🎯';
    }
  };

  const RoutineCard = ({ routine }: { routine: Routine }) => (
    <Card key={routine.id}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {routine.nombre}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Por {routine.creador?.nombre} {routine.creador?.apellido}
            </p>
          </div>
          <button
            onClick={() => handleToggleFavorite(routine.id)}
            className={`p-2 rounded-full transition-colors ${
              routine.isFavorite
                ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                : 'text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            disabled={toggleFavorite.isPending}
          >
            <Heart
              className="w-5 h-5"
              fill={routine.isFavorite ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {routine.descripcion}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getLevelColor(routine.nivel)}`}>
            {routine.nivel}
          </span>
          <span className="px-3 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
            {getGoalIcon(routine.objetivo)} {routine.objetivo.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">
              {routine.duracionEstimada} min
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">
              {routine.cantidadEjercicios || routine.ejercicios?.length || 0} ejercicios
            </span>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          Ver detalles
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-primary-600 text-white p-6">
        <div className="flex items-center gap-3 mb-2">
          <Dumbbell className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Rutinas</h1>
        </div>
        <p className="text-primary-100">
          Encontrá la rutina perfecta para tus objetivos
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'all'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'favorites'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Favoritas
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Filters */}
        {activeTab === 'all' && (
          <div className="mb-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nivel
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilters({ ...filters, nivel: undefined })}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    !filters.nivel
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  Todos
                </button>
                {Object.values(RoutineLevel).map((nivel) => (
                  <button
                    key={nivel}
                    onClick={() => setFilters({ ...filters, nivel })}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      filters.nivel === nivel
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {nivel}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Objetivo
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilters({ ...filters, objetivo: undefined })}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    !filters.objetivo
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  Todos
                </button>
                {Object.values(RoutineGoal).map((objetivo) => (
                  <button
                    key={objetivo}
                    onClick={() => setFilters({ ...filters, objetivo })}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      filters.objetivo === objetivo
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {getGoalIcon(objetivo)} {objetivo.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* All Routines Tab */}
        {activeTab === 'all' && (
          <>
            {isLoading ? (
              <Loading className="py-12" />
            ) : (
              <div className="space-y-4">
                {routinesData?.data.map((routine) => (
                  <RoutineCard key={routine.id} routine={routine} />
                ))}

                {routinesData?.data.length === 0 && (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No se encontraron rutinas con estos filtros
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <>
            {isLoadingFavorites ? (
              <Loading className="py-12" />
            ) : (
              <div className="space-y-4">
                {favoritesData?.data.map((routine) => (
                  <RoutineCard key={routine.id} routine={routine} />
                ))}

                {favoritesData?.data.length === 0 && (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      No tenés rutinas favoritas
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Tocá el corazón en cualquier rutina para agregarla a favoritas
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
