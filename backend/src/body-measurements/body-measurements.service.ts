import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual } from 'typeorm';
import { CreateBodyMeasurementDto } from './dto/create-body-measurement.dto';
import { UpdateBodyMeasurementDto } from './dto/update-body-measurement.dto';
import { BodyMeasurement } from './entities/body-measurement.entity';

@Injectable()
export class BodyMeasurementsService {
  constructor(
    @InjectRepository(BodyMeasurement)
    private bodyMeasurementRepository: Repository<BodyMeasurement>,
  ) {}

  /**
   * Calcula el IMC (Índice de Masa Corporal)
   * Fórmula: peso (kg) / (altura (m))^2
   */
  private calculateBMI(weightKg: number, heightCm: number): number {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return Math.round(bmi * 100) / 100;
  }

  /**
   * Crea una nueva medición corporal
   */
  async create(
    userId: string,
    createBodyMeasurementDto: CreateBodyMeasurementDto,
    measuredBy?: string,
  ): Promise<BodyMeasurement> {
    // Calcular IMC automáticamente
    const bmi = this.calculateBMI(
      createBodyMeasurementDto.weight,
      createBodyMeasurementDto.height,
    );

    const measurement = this.bodyMeasurementRepository.create({
      ...createBodyMeasurementDto,
      userId,
      bmi,
      measuredBy: measuredBy || userId,
    });

    return await this.bodyMeasurementRepository.save(measurement);
  }

  /**
   * Obtiene todas las mediciones de un usuario
   */
  async findAllByUser(userId: string): Promise<BodyMeasurement[]> {
    return await this.bodyMeasurementRepository.find({
      where: { userId },
      order: { measurementDate: 'DESC' },
    });
  }

  /**
   * Obtiene el historial de mediciones de un usuario con paginación
   */
  async findUserHistory(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: BodyMeasurement[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.bodyMeasurementRepository.findAndCount({
      where: { userId },
      order: { measurementDate: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Obtiene una medición específica
   */
  async findOne(id: string, userId: string): Promise<BodyMeasurement> {
    const measurement = await this.bodyMeasurementRepository.findOne({
      where: { id },
    });

    if (!measurement) {
      throw new NotFoundException('Medición no encontrada');
    }

    if (measurement.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para ver esta medición');
    }

    return measurement;
  }

  /**
   * Obtiene la última medición de un usuario
   */
  async findLatest(userId: string): Promise<BodyMeasurement | null> {
    return await this.bodyMeasurementRepository.findOne({
      where: { userId },
      order: { measurementDate: 'DESC' },
    });
  }

  /**
   * Obtiene mediciones en un rango de fechas
   */
  async findByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<BodyMeasurement[]> {
    return await this.bodyMeasurementRepository.find({
      where: {
        userId,
        measurementDate: Between(startDate, endDate),
      },
      order: { measurementDate: 'ASC' },
    });
  }

  /**
   * Obtiene estadísticas de evolución
   */
  async getEvolutionStats(userId: string): Promise<{
    currentWeight: number | null;
    initialWeight: number | null;
    weightChange: number;
    currentBMI: number | null;
    initialBMI: number | null;
    bmiChange: number;
    currentBodyFat: number | null;
    initialBodyFat: number | null;
    bodyFatChange: number;
    totalMeasurements: number;
    firstMeasurementDate: Date | null;
    lastMeasurementDate: Date | null;
  }> {
    const measurements = await this.findAllByUser(userId);

    if (measurements.length === 0) {
      return {
        currentWeight: null,
        initialWeight: null,
        weightChange: 0,
        currentBMI: null,
        initialBMI: null,
        bmiChange: 0,
        currentBodyFat: null,
        initialBodyFat: null,
        bodyFatChange: 0,
        totalMeasurements: 0,
        firstMeasurementDate: null,
        lastMeasurementDate: null,
      };
    }

    const latest = measurements[0];
    const oldest = measurements[measurements.length - 1];

    return {
      currentWeight: Number(latest.weight),
      initialWeight: Number(oldest.weight),
      weightChange: Number(latest.weight) - Number(oldest.weight),
      currentBMI: Number(latest.bmi),
      initialBMI: Number(oldest.bmi),
      bmiChange: Number(latest.bmi) - Number(oldest.bmi),
      currentBodyFat: latest.bodyFatPercentage
        ? Number(latest.bodyFatPercentage)
        : null,
      initialBodyFat: oldest.bodyFatPercentage
        ? Number(oldest.bodyFatPercentage)
        : null,
      bodyFatChange:
        latest.bodyFatPercentage && oldest.bodyFatPercentage
          ? Number(latest.bodyFatPercentage) - Number(oldest.bodyFatPercentage)
          : 0,
      totalMeasurements: measurements.length,
      firstMeasurementDate: oldest.measurementDate,
      lastMeasurementDate: latest.measurementDate,
    };
  }

  /**
   * Compara dos mediciones
   */
  async compareMeasurements(
    userId: string,
    measurement1Id: string,
    measurement2Id: string,
  ): Promise<{
    measurement1: BodyMeasurement;
    measurement2: BodyMeasurement;
    differences: any;
  }> {
    const m1 = await this.findOne(measurement1Id, userId);
    const m2 = await this.findOne(measurement2Id, userId);

    const differences = {
      weight: Number(m2.weight) - Number(m1.weight),
      bmi: Number(m2.bmi) - Number(m1.bmi),
      bodyFatPercentage:
        m1.bodyFatPercentage && m2.bodyFatPercentage
          ? Number(m2.bodyFatPercentage) - Number(m1.bodyFatPercentage)
          : null,
      muscleMassPercentage:
        m1.muscleMassPercentage && m2.muscleMassPercentage
          ? Number(m2.muscleMassPercentage) - Number(m1.muscleMassPercentage)
          : null,
      neck: m1.neck && m2.neck ? Number(m2.neck) - Number(m1.neck) : null,
      shoulders:
        m1.shoulders && m2.shoulders
          ? Number(m2.shoulders) - Number(m1.shoulders)
          : null,
      chest: m1.chest && m2.chest ? Number(m2.chest) - Number(m1.chest) : null,
      waist: m1.waist && m2.waist ? Number(m2.waist) - Number(m1.waist) : null,
      hips: m1.hips && m2.hips ? Number(m2.hips) - Number(m1.hips) : null,
      leftBicep:
        m1.leftBicep && m2.leftBicep
          ? Number(m2.leftBicep) - Number(m1.leftBicep)
          : null,
      rightBicep:
        m1.rightBicep && m2.rightBicep
          ? Number(m2.rightBicep) - Number(m1.rightBicep)
          : null,
      leftForearm:
        m1.leftForearm && m2.leftForearm
          ? Number(m2.leftForearm) - Number(m1.leftForearm)
          : null,
      rightForearm:
        m1.rightForearm && m2.rightForearm
          ? Number(m2.rightForearm) - Number(m1.rightForearm)
          : null,
      leftThigh:
        m1.leftThigh && m2.leftThigh
          ? Number(m2.leftThigh) - Number(m1.leftThigh)
          : null,
      rightThigh:
        m1.rightThigh && m2.rightThigh
          ? Number(m2.rightThigh) - Number(m1.rightThigh)
          : null,
      leftCalf:
        m1.leftCalf && m2.leftCalf
          ? Number(m2.leftCalf) - Number(m1.leftCalf)
          : null,
      rightCalf:
        m1.rightCalf && m2.rightCalf
          ? Number(m2.rightCalf) - Number(m1.rightCalf)
          : null,
    };

    return {
      measurement1: m1,
      measurement2: m2,
      differences,
    };
  }

  /**
   * Actualiza una medición
   */
  async update(
    id: string,
    userId: string,
    updateBodyMeasurementDto: UpdateBodyMeasurementDto,
  ): Promise<BodyMeasurement> {
    const measurement = await this.findOne(id, userId);

    // Recalcular IMC si cambió el peso o la altura
    if (updateBodyMeasurementDto.weight || updateBodyMeasurementDto.height) {
      const weight = updateBodyMeasurementDto.weight || measurement.weight;
      const height = updateBodyMeasurementDto.height || measurement.height;
      updateBodyMeasurementDto.bmi = this.calculateBMI(
        Number(weight),
        Number(height),
      );
    }

    Object.assign(measurement, updateBodyMeasurementDto);
    return await this.bodyMeasurementRepository.save(measurement);
  }

  /**
   * Elimina una medición
   */
  async remove(id: string, userId: string): Promise<void> {
    const measurement = await this.findOne(id, userId);
    await this.bodyMeasurementRepository.remove(measurement);
  }

  /**
   * Obtiene el progreso de peso en los últimos N meses
   */
  async getWeightProgress(
    userId: string,
    months: number = 6,
  ): Promise<BodyMeasurement[]> {
    const date = new Date();
    date.setMonth(date.getMonth() - months);

    return await this.bodyMeasurementRepository.find({
      where: {
        userId,
        measurementDate: LessThanOrEqual(new Date()),
      },
      order: { measurementDate: 'ASC' },
    });
  }
}
