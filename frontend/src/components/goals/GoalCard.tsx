import { Target, Calendar, Trophy, Trash2, Edit, Pause, Play, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { UserGoal, GoalStatus, goalTypeLabels, goalTypeIcons } from '../../types/goal.types';
import { cn } from '../../utils/cn';

interface GoalCardProps {
  goal: UserGoal;
  onEdit: (goal: UserGoal) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: GoalStatus) => void;
}

export const GoalCard = ({ goal, onEdit, onDelete, onUpdateStatus }: GoalCardProps) => {
  const isActive = goal.estado === GoalStatus.ACTIVO;
  const isCompleted = goal.estado === GoalStatus.COMPLETADO;
  const isPaused = goal.estado === GoalStatus.PAUSADO;

  const daysRemaining = goal.fechaObjetivo
    ? Math.ceil((new Date(goal.fechaObjetivo).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl border-2 p-6 transition-all',
        isCompleted
          ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
          : isActive
          ? 'border-primary-300 dark:border-primary-700'
          : 'border-gray-200 dark:border-gray-700 opacity-70'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{goalTypeIcons[goal.tipo]}</div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{goal.titulo}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{goalTypeLabels[goal.tipo]}</p>
          </div>
        </div>

        {/* Estado Badge */}
        <div className="flex gap-2">
          {isCompleted && (
            <span className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Completado
            </span>
          )}
          {isPaused && (
            <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
              <Pause className="w-4 h-4" />
              Pausado
            </span>
          )}
        </div>
      </div>

      {/* Descripción */}
      {goal.descripcion && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{goal.descripcion}</p>
      )}

      {/* Progreso */}
      {!isCompleted && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">Progreso</span>
            <span className="font-bold text-primary-600 dark:text-primary-400">
              {goal.porcentajeProgreso}%
            </span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
              style={{ width: `${Math.min(goal.porcentajeProgreso, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {goal.pesoObjetivo && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Peso Objetivo</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {goal.pesoObjetivo} kg
            </div>
            {goal.pesoInicial && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Inicial: {goal.pesoInicial} kg
              </div>
            )}
          </div>
        )}

        {goal.grasaCorporalObjetivo && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Grasa Corporal</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {goal.grasaCorporalObjetivo}%
            </div>
            {goal.grasaCorporalInicial && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Inicial: {goal.grasaCorporalInicial}%
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fechas */}
      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>
            Inicio: {format(new Date(goal.fechaInicio), 'dd MMM yyyy', { locale: es })}
          </span>
        </div>
        {goal.fechaObjetivo && (
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span>
              Meta: {format(new Date(goal.fechaObjetivo), 'dd MMM yyyy', { locale: es })}
            </span>
          </div>
        )}
      </div>

      {/* Días restantes */}
      {daysRemaining !== null && daysRemaining > 0 && !isCompleted && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-medium text-amber-900 dark:text-amber-200">
            {daysRemaining} {daysRemaining === 1 ? 'día restante' : 'días restantes'}
          </span>
        </div>
      )}

      {/* Fecha de completado */}
      {isCompleted && goal.fechaCompletado && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <Trophy className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium text-green-900 dark:text-green-200">
            Completado el {format(new Date(goal.fechaCompletado), 'dd MMM yyyy', { locale: es })}
          </span>
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onEdit(goal)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
          Editar
        </button>

        {isActive && (
          <button
            onClick={() => onUpdateStatus(goal.id, GoalStatus.PAUSADO)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Pause className="w-4 h-4" />
            Pausar
          </button>
        )}

        {isPaused && (
          <button
            onClick={() => onUpdateStatus(goal.id, GoalStatus.ACTIVO)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
          >
            <Play className="w-4 h-4" />
            Reanudar
          </button>
        )}

        {!isCompleted && isActive && goal.porcentajeProgreso >= 100 && (
          <button
            onClick={() => onUpdateStatus(goal.id, GoalStatus.COMPLETADO)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Completar
          </button>
        )}

        <button
          onClick={() => onDelete(goal.id)}
          className="ml-auto flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar
        </button>
      </div>
    </div>
  );
};
