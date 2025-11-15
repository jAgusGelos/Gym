/**
 * Utilidades para manejo consistente de fechas en la aplicación
 * Todas las funciones trabajan en zona horaria local para evitar problemas con UTC
 */

/**
 * Parsea una fecha en formato YYYY-MM-DD a un objeto Date en zona horaria local
 * @param dateString Fecha en formato 'YYYY-MM-DD'
 * @returns Date object en zona horaria local
 */
export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Parsea una fecha Date o string y retorna un Date en zona horaria local
 * @param date Date object o string en formato 'YYYY-MM-DD'
 * @returns Date object en zona horaria local
 */
export function ensureLocalDate(date: Date | string): Date {
  if (typeof date === 'string') {
    return parseLocalDate(date);
  }
  // Si es un Date, crear uno nuevo en zona horaria local
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Combina una fecha con una hora específica
 * @param date Date object o string en formato 'YYYY-MM-DD'
 * @param time String en formato 'HH:mm' o 'HH:mm:ss'
 * @returns Date object con fecha y hora combinadas
 */
export function combineDateAndTime(
  date: Date | string,
  time: string,
): Date {
  const baseDate = ensureLocalDate(date);
  const [hours, minutes] = time.split(':').map(Number);
  baseDate.setHours(hours, minutes, 0, 0);
  return baseDate;
}

/**
 * Formatea una fecha a string YYYY-MM-DD
 * @param date Date object
 * @returns String en formato 'YYYY-MM-DD'
 */
export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Verifica si una fecha/hora ya pasó
 * @param date Date object o string en formato 'YYYY-MM-DD'
 * @param time Opcional - String en formato 'HH:mm' o 'HH:mm:ss'
 * @returns true si la fecha/hora ya pasó
 */
export function isPast(date: Date | string, time?: string): boolean {
  const checkDate = time
    ? combineDateAndTime(date, time)
    : ensureLocalDate(date);
  return checkDate < new Date();
}

/**
 * Calcula la diferencia en horas entre dos fechas
 * @param date1 Fecha 1
 * @param date2 Fecha 2
 * @returns Diferencia en horas (positivo si date1 es después de date2)
 */
export function getHoursDifference(date1: Date, date2: Date): number {
  return (date1.getTime() - date2.getTime()) / (1000 * 60 * 60);
}
