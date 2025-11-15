import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Achievement,
  AchievementCriterio,
} from './entities/achievement.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { Attendance } from '../attendance/entities/attendance.entity';
import { ProgressEntry } from '../progress-tracking/entities/progress-entry.entity';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    @InjectRepository(UserAchievement)
    private userAchievementRepository: Repository<UserAchievement>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(ProgressEntry)
    private progressRepository: Repository<ProgressEntry>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  // Admin: Crear un logro
  async create(
    createAchievementDto: CreateAchievementDto,
  ): Promise<Achievement> {
    const achievement = this.achievementRepository.create(createAchievementDto);
    return this.achievementRepository.save(achievement);
  }

  // Obtener todos los logros disponibles
  async findAll(): Promise<Achievement[]> {
    return this.achievementRepository.find({
      where: { activo: true },
      order: { orden: 'ASC', createdAt: 'ASC' },
    });
  }

  // Obtener un logro por ID
  async findOne(id: string): Promise<Achievement> {
    const achievement = await this.achievementRepository.findOne({
      where: { id },
    });
    if (!achievement) {
      throw new NotFoundException('Logro no encontrado');
    }
    return achievement;
  }

  // Obtener logros del usuario con progreso
  async getUserAchievements(userId: string) {
    const allAchievements = await this.findAll();
    const userAchievements = await this.userAchievementRepository.find({
      where: { user: { id: userId } },
      relations: ['achievement'],
    });

    // Mapear todos los achievements con el progreso del usuario
    return allAchievements.map((achievement) => {
      const userAchievement = userAchievements.find(
        (ua) => ua.achievement.id === achievement.id,
      );

      return {
        achievement,
        progresoActual: userAchievement?.progresoActual || 0,
        completado: userAchievement?.completado || false,
        fechaCompletado: userAchievement?.fechaCompletado || null,
      };
    });
  }

  // Obtener estadísticas del usuario
  async getUserStats(userId: string) {
    const achievements = await this.getUserAchievements(userId);
    const completados = achievements.filter((a) => a.completado);
    const puntosTotal = completados.reduce(
      (sum, a) => sum + a.achievement.puntos,
      0,
    );
    const porcentajeCompletado = Math.round(
      (completados.length / achievements.length) * 100,
    );

    return {
      totalLogros: achievements.length,
      logrosCompletados: completados.length,
      puntosTotal,
      porcentajeCompletado,
      ultimosLogros: completados
        .filter((a) => a.fechaCompletado !== null)
        .sort(
          (a, b) =>
            new Date(b.fechaCompletado!).getTime() -
            new Date(a.fechaCompletado!).getTime(),
        )
        .slice(0, 5)
        .map((a) => ({
          nombre: a.achievement.nombre,
          icono: a.achievement.icono,
          puntos: a.achievement.puntos,
          fecha: a.fechaCompletado,
        })),
    };
  }

  // Verificar y actualizar progreso de un usuario para todos los criterios
  async checkAndUpdateAchievements(userId: string): Promise<Achievement[]> {
    const achievements = await this.findAll();
    const unlocked: Achievement[] = [];

    for (const achievement of achievements) {
      const progreso = await this.calculateProgress(
        userId,
        achievement.criterio,
      );
      const userAchievement = await this.updateOrCreateUserAchievement(
        userId,
        achievement.id,
        progreso,
        achievement.objetivo,
      );

      if (
        userAchievement.completado &&
        userAchievement.fechaCompletado &&
        new Date(userAchievement.fechaCompletado).getTime() > Date.now() - 5000
      ) {
        unlocked.push(achievement);
      }
    }

    return unlocked;
  }

  // Calcular progreso actual según el criterio
  private async calculateProgress(
    userId: string,
    criterio: AchievementCriterio,
  ): Promise<number> {
    switch (criterio) {
      // Asistencia
      case AchievementCriterio.ASISTIR_7_DIAS:
      case AchievementCriterio.ASISTIR_30_DIAS:
      case AchievementCriterio.ASISTIR_100_DIAS:
      case AchievementCriterio.ASISTIR_365_DIAS:
        return this.attendanceRepository.count({ where: { userId } });

      case AchievementCriterio.RACHA_7_DIAS:
      case AchievementCriterio.RACHA_30_DIAS:
        return this.calculateStreak(userId);

      // Progreso
      case AchievementCriterio.REGISTRAR_PRIMER_PROGRESO:
      case AchievementCriterio.REGISTRAR_10_PROGRESOS:
      case AchievementCriterio.REGISTRAR_50_PROGRESOS:
        return this.progressRepository.count({ where: { userId } });

      case AchievementCriterio.PERDER_5KG:
      case AchievementCriterio.PERDER_10KG:
        return this.calculateWeightLoss(userId);

      case AchievementCriterio.GANAR_5KG:
      case AchievementCriterio.GANAR_10KG:
        return this.calculateWeightGain(userId);

      // Clases
      case AchievementCriterio.RESERVAR_PRIMERA_CLASE:
      case AchievementCriterio.RESERVAR_10_CLASES:
      case AchievementCriterio.RESERVAR_50_CLASES:
        return this.bookingRepository.count({ where: { userId } });

      case AchievementCriterio.ASISTIR_10_CLASES:
      case AchievementCriterio.ASISTIR_50_CLASES:
        return this.bookingRepository.count({
          where: { userId, estado: BookingStatus.ASISTIDO },
        });

      default:
        return 0;
    }
  }

  // Calcular racha de asistencias consecutivas
  private async calculateStreak(userId: string): Promise<number> {
    const attendances = await this.attendanceRepository.find({
      where: { userId },
      order: { fecha: 'DESC' },
      take: 100,
    });

    if (attendances.length === 0) return 0;

    let streak = 1;
    const dates = attendances.map((a) => new Date(a.fecha).toDateString());

    for (let i = 0; i < dates.length - 1; i++) {
      const current = new Date(dates[i]);
      const next = new Date(dates[i + 1]);
      const diffDays = Math.floor(
        (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // Calcular pérdida de peso
  private async calculateWeightLoss(userId: string): Promise<number> {
    const entries = await this.progressRepository.find({
      where: { userId },
      order: { fecha: 'ASC' },
    });

    if (entries.length < 2) return 0;

    const firstWeight = entries[0].peso;
    const lastWeight = entries[entries.length - 1].peso;

    if (!firstWeight || !lastWeight) return 0;

    const loss = Number(firstWeight) - Number(lastWeight);
    return loss > 0 ? loss : 0;
  }

  // Calcular ganancia de peso
  private async calculateWeightGain(userId: string): Promise<number> {
    const entries = await this.progressRepository.find({
      where: { userId },
      order: { fecha: 'ASC' },
    });

    if (entries.length < 2) return 0;

    const firstWeight = entries[0].peso;
    const lastWeight = entries[entries.length - 1].peso;

    if (!firstWeight || !lastWeight) return 0;

    const gain = Number(lastWeight) - Number(firstWeight);
    return gain > 0 ? gain : 0;
  }

  // Crear o actualizar el progreso de un logro del usuario
  private async updateOrCreateUserAchievement(
    userId: string,
    achievementId: string,
    progresoActual: number,
    objetivo: number,
  ): Promise<UserAchievement> {
    const existing = await this.userAchievementRepository.findOne({
      where: {
        user: { id: userId },
        achievement: { id: achievementId }
      },
    });

    const completado = progresoActual >= objetivo;

    if (!existing) {
      const userAchievement = this.userAchievementRepository.create({
        user: { id: userId } as any,
        achievement: { id: achievementId } as any,
        progresoActual,
        completado,
        fechaCompletado: completado ? new Date() : undefined,
      });
      return await this.userAchievementRepository.save(userAchievement);
    } else {
      existing.progresoActual = progresoActual;
      if (completado && !existing.completado) {
        existing.completado = true;
        existing.fechaCompletado = new Date();
      }
      return await this.userAchievementRepository.save(existing);
    }
  }

  // Admin: Eliminar un logro
  async remove(id: string): Promise<void> {
    const achievement = await this.findOne(id);
    await this.achievementRepository.remove(achievement);
  }
}
