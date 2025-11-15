import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { ClassSchedule } from './entities/class-schedule.entity';
import { User } from '../users/entities/user.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

export interface ClassFilters {
  dayOfWeek?: number;
  instructorId?: string;
  activo?: boolean;
}

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(ClassSchedule)
    private scheduleRepository: Repository<ClassSchedule>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createClassDto: CreateClassDto): Promise<Class> {
    const { schedules, ...classData } = createClassDto;

    // Verificar que todos los instructores existen
    const instructorIds = schedules.map((s) => s.instructorId);
    const uniqueInstructorIds = [...new Set(instructorIds)];

    for (const instructorId of uniqueInstructorIds) {
      const instructor = await this.userRepository.findOne({
        where: { id: instructorId },
      });
      if (!instructor) {
        throw new NotFoundException(
          `Instructor con ID ${instructorId} no encontrado`,
        );
      }
    }

    // Validar que los horarios no se solapen en el mismo día
    this.validateSchedules(schedules);

    // Crear la clase - convertir null a undefined para imagenUrl
    const classEntity = this.classRepository.create({
      ...classData,
      imagenUrl: classData.imagenUrl || undefined,
    });
    const savedClass = await this.classRepository.save(classEntity);

    // Crear los horarios
    const scheduleEntities = schedules.map((schedule) =>
      this.scheduleRepository.create({
        ...schedule,
        classId: savedClass.id,
      }),
    );

    await this.scheduleRepository.save(scheduleEntities);

    // Retornar la clase con sus horarios
    return await this.findOne(savedClass.id);
  }

  private validateSchedules(schedules: any[]): void {
    // Validar que no haya solapamientos en el mismo día
    const byDay = new Map<number, any[]>();

    for (const schedule of schedules) {
      if (!byDay.has(schedule.dayOfWeek)) {
        byDay.set(schedule.dayOfWeek, []);
      }
      byDay.get(schedule.dayOfWeek)!.push(schedule);
    }

    for (const [day, daySchedules] of byDay.entries()) {
      for (let i = 0; i < daySchedules.length; i++) {
        for (let j = i + 1; j < daySchedules.length; j++) {
          const s1 = daySchedules[i];
          const s2 = daySchedules[j];

          if (this.schedulesOverlap(s1.startTime, s1.endTime, s2.startTime, s2.endTime)) {
            throw new BadRequestException(
              `Los horarios del día ${day} se solapan: ${s1.startTime}-${s1.endTime} y ${s2.startTime}-${s2.endTime}`,
            );
          }
        }
      }
    }
  }

  private schedulesOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string,
  ): boolean {
    return start1 < end2 && start2 < end1;
  }

  async findAll(
    paginationDto: PaginationDto,
    filters?: ClassFilters,
  ): Promise<PaginatedResult<Class>> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.classRepository
      .createQueryBuilder('class')
      .leftJoinAndSelect('class.schedules', 'schedule')
      .leftJoinAndSelect('schedule.instructor', 'instructor')
      .orderBy('class.nombre', 'ASC')
      .addOrderBy('schedule.dayOfWeek', 'ASC')
      .addOrderBy('schedule.startTime', 'ASC');

    if (filters?.dayOfWeek !== undefined) {
      queryBuilder.andWhere('schedule.dayOfWeek = :dayOfWeek', {
        dayOfWeek: filters.dayOfWeek,
      });
    }

    if (filters?.instructorId) {
      queryBuilder.andWhere('schedule.instructorId = :instructorId', {
        instructorId: filters.instructorId,
      });
    }

    if (filters?.activo !== undefined) {
      queryBuilder.andWhere('class.activo = :activo', {
        activo: filters.activo,
      });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Class> {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['schedules', 'schedules.instructor', 'reservas', 'reservas.user'],
    });

    if (!classEntity) {
      throw new NotFoundException('Clase no encontrada');
    }

    return classEntity;
  }

  async update(id: string, updateClassDto: UpdateClassDto): Promise<Class> {
    const classEntity = await this.findOne(id);
    const { schedules, ...classData } = updateClassDto;

    // Actualizar datos de la clase
    Object.assign(classEntity, classData);
    await this.classRepository.save(classEntity);

    // Si se proporcionan horarios, reemplazarlos completamente
    if (schedules) {
      // Verificar que todos los instructores existen
      const instructorIds = schedules.map((s) => s.instructorId).filter(Boolean);
      const uniqueInstructorIds = [...new Set(instructorIds)];

      for (const instructorId of uniqueInstructorIds) {
        const instructor = await this.userRepository.findOne({
          where: { id: instructorId },
        });
        if (!instructor) {
          throw new NotFoundException(
            `Instructor con ID ${instructorId} no encontrado`,
          );
        }
      }

      // Validar que los horarios no se solapen
      this.validateSchedules(schedules as any[]);

      // Eliminar horarios existentes
      await this.scheduleRepository.delete({ classId: id });

      // Crear nuevos horarios
      const scheduleEntities = schedules.map((schedule) =>
        this.scheduleRepository.create({
          ...schedule,
          classId: id,
        }),
      );

      await this.scheduleRepository.save(scheduleEntities);
    }

    // Retornar la clase actualizada con sus horarios
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const classEntity = await this.findOne(id);
    // Soft delete
    classEntity.activo = false;
    await this.classRepository.save(classEntity);
  }

  // Método auxiliar para obtener los horarios de una clase en un día específico
  async getSchedulesForDay(classId: string, dayOfWeek: number): Promise<ClassSchedule[]> {
    return await this.scheduleRepository.find({
      where: { classId, dayOfWeek, activo: true },
      relations: ['instructor'],
      order: { startTime: 'ASC' },
    });
  }

  // Método auxiliar para obtener todas las clases disponibles en un día específico
  async getClassesForDay(dayOfWeek: number): Promise<Class[]> {
    const classes = await this.classRepository.find({
      where: { activo: true },
      relations: ['schedules', 'schedules.instructor'],
    });

    // Filtrar solo las clases que tienen horarios en ese día
    return classes.filter((classEntity) =>
      classEntity.schedules.some((s) => s.dayOfWeek === dayOfWeek && s.activo),
    );
  }
}
