import { ClassSchedule, DayOfWeek } from '../types/class.types';

export interface ScheduleRange {
  dayOfWeek: DayOfWeek;
  startTime: string; // "09:00"
  endTime: string; // "15:00"
  duration: number; // en minutos
  instructorId: string;
  cupoMaximo?: number;
}

/**
 * Expande un range de horarios en schedules individuales
 * Ejemplo: 09:00-15:00 con duración 60 min -> [09:00-10:00, 10:00-11:00, ...]
 */
export function expandScheduleRange(range: ScheduleRange): Omit<ClassSchedule, 'id' | 'instructor'>[] {
  const schedules: Omit<ClassSchedule, 'id' | 'instructor'>[] = [];

  const [startHours, startMinutes] = range.startTime.split(':').map(Number);
  const [endHours, endMinutes] = range.endTime.split(':').map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  let currentMinutes = startTotalMinutes;

  while (currentMinutes < endTotalMinutes) {
    const nextMinutes = Math.min(currentMinutes + range.duration, endTotalMinutes);

    const currentHours = Math.floor(currentMinutes / 60);
    const currentMins = currentMinutes % 60;
    const nextHours = Math.floor(nextMinutes / 60);
    const nextMins = nextMinutes % 60;

    schedules.push({
      dayOfWeek: range.dayOfWeek,
      startTime: `${String(currentHours).padStart(2, '0')}:${String(currentMins).padStart(2, '0')}`,
      endTime: `${String(nextHours).padStart(2, '0')}:${String(nextMins).padStart(2, '0')}`,
      instructorId: range.instructorId,
      cupoMaximo: range.cupoMaximo !== undefined && !isNaN(range.cupoMaximo) ? range.cupoMaximo : null,
      activo: true,
    });

    currentMinutes = nextMinutes;
  }

  return schedules;
}

/**
 * Comprime schedules consecutivos del mismo día/instructor en un range
 * Esto es útil para mostrar al admin de forma comprimida
 */
export function compressSchedulesToRanges(schedules: ClassSchedule[]): ScheduleRange[] {
  const ranges: ScheduleRange[] = [];

  // Agrupar por día e instructor
  const grouped = new Map<string, ClassSchedule[]>();

  schedules.forEach(schedule => {
    const key = `${schedule.dayOfWeek}-${schedule.instructorId}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(schedule);
  });

  // Procesar cada grupo
  grouped.forEach(group => {
    // Ordenar por hora de inicio
    group.sort((a, b) => a.startTime.localeCompare(b.startTime));

    let currentRange: ScheduleRange | null = null;

    for (let i = 0; i < group.length; i++) {
      const schedule = group[i];
      const [hours, minutes] = schedule.startTime.split(':').map(Number);
      const [endHours, endMinutes] = schedule.endTime.split(':').map(Number);
      const duration = (endHours * 60 + endMinutes) - (hours * 60 + minutes);

      if (!currentRange) {
        // Iniciar nuevo range
        currentRange = {
          dayOfWeek: schedule.dayOfWeek,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          duration: duration,
          instructorId: schedule.instructorId,
          cupoMaximo: schedule.cupoMaximo,
        };
      } else {
        // Verificar si este schedule es consecutivo y de la misma duración
        const isConsecutive = currentRange.endTime === schedule.startTime;
        const sameDuration = currentRange.duration === duration;
        const sameCupo = currentRange.cupoMaximo === schedule.cupoMaximo;

        if (isConsecutive && sameDuration && sameCupo) {
          // Extender el range actual
          currentRange.endTime = schedule.endTime;
        } else {
          // Guardar el range actual y empezar uno nuevo
          ranges.push(currentRange);
          currentRange = {
            dayOfWeek: schedule.dayOfWeek,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            duration: duration,
            instructorId: schedule.instructorId,
            cupoMaximo: schedule.cupoMaximo,
          };
        }
      }
    }

    // Guardar el último range
    if (currentRange) {
      ranges.push(currentRange);
    }
  });

  return ranges;
}

/**
 * Genera un preview de los horarios que se crearían a partir de un range
 */
export function getScheduleRangePreview(range: ScheduleRange): string[] {
  const schedules = expandScheduleRange(range);
  return schedules.map(s => `${s.startTime}-${s.endTime}`);
}

/**
 * Valida que un range sea válido
 */
export function validateScheduleRange(range: ScheduleRange): string | null {
  const [startHours, startMinutes] = range.startTime.split(':').map(Number);
  const [endHours, endMinutes] = range.endTime.split(':').map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  if (startTotalMinutes >= endTotalMinutes) {
    return 'La hora de fin debe ser mayor que la hora de inicio';
  }

  if (range.duration <= 0) {
    return 'La duración debe ser mayor a 0';
  }

  if (!range.instructorId) {
    return 'Debe seleccionar un instructor';
  }

  return null;
}
