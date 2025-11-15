import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
import { Class } from './entities/class.entity';
import { User } from '../users/entities/user.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

export interface ClassFilters {
  fecha?: string;
  instructorId?: string;
  activo?: boolean;
}

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createClassDto: CreateClassDto): Promise<Class> {
    const { instructorId, fechaHoraInicio, fechaHoraFin, ...rest } =
      createClassDto;

    // Verificar que el instructor existe
    const instructor = await this.userRepository.findOne({
      where: { id: instructorId },
    });

    if (!instructor) {
      throw new NotFoundException('Instructor no encontrado');
    }

    // Validar que la fecha de fin es posterior a la de inicio
    const inicio = new Date(fechaHoraInicio);
    const fin = new Date(fechaHoraFin);

    if (fin <= inicio) {
      throw new BadRequestException(
        'La fecha de fin debe ser posterior a la de inicio',
      );
    }

    const classEntity = this.classRepository.create({
      ...rest,
      instructorId,
      fechaHoraInicio: inicio,
      fechaHoraFin: fin,
    });

    return await this.classRepository.save(classEntity);
  }

  async findAll(
    paginationDto: PaginationDto,
    filters?: ClassFilters,
  ): Promise<PaginatedResult<Class>> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.classRepository
      .createQueryBuilder('class')
      .leftJoinAndSelect('class.instructor', 'instructor')
      .leftJoinAndSelect('class.reservas', 'reservas')
      .skip(skip)
      .take(limit)
      .orderBy('class.fechaHoraInicio', 'ASC');

    if (filters?.fecha) {
      const date = new Date(filters.fecha);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      queryBuilder.andWhere(
        'class.fechaHoraInicio >= :start AND class.fechaHoraInicio < :end',
        {
          start: date,
          end: nextDay,
        },
      );
    }

    if (filters?.instructorId) {
      queryBuilder.andWhere('class.instructorId = :instructorId', {
        instructorId: filters.instructorId,
      });
    }

    if (filters?.activo !== undefined) {
      queryBuilder.andWhere('class.activo = :activo', {
        activo: filters.activo,
      });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    // Calcular disponibilidad para cada clase
    const dataWithAvailability = data.map((classEntity) => ({
      ...classEntity,
      disponible: classEntity.cupoActual < classEntity.cupoMaximo,
      cuposDisponibles: classEntity.cupoMaximo - classEntity.cupoActual,
    }));

    return {
      data: dataWithAvailability as any,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Class> {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['instructor', 'reservas', 'reservas.user'],
    });

    if (!classEntity) {
      throw new NotFoundException('Clase no encontrada');
    }

    return classEntity;
  }

  async update(id: string, updateClassDto: UpdateClassDto): Promise<Class> {
    const classEntity = await this.findOne(id);

    // Validar fechas si se actualizan
    if (updateClassDto.fechaHoraInicio || updateClassDto.fechaHoraFin) {
      const inicio = updateClassDto.fechaHoraInicio
        ? new Date(updateClassDto.fechaHoraInicio)
        : classEntity.fechaHoraInicio;
      const fin = updateClassDto.fechaHoraFin
        ? new Date(updateClassDto.fechaHoraFin)
        : classEntity.fechaHoraFin;

      if (fin <= inicio) {
        throw new BadRequestException(
          'La fecha de fin debe ser posterior a la de inicio',
        );
      }
    }

    // Verificar instructor si se cambia
    if (updateClassDto.instructorId) {
      const instructor = await this.userRepository.findOne({
        where: { id: updateClassDto.instructorId },
      });
      if (!instructor) {
        throw new NotFoundException('Instructor no encontrado');
      }
    }

    Object.assign(classEntity, updateClassDto);
    return await this.classRepository.save(classEntity);
  }

  async remove(id: string): Promise<void> {
    const classEntity = await this.findOne(id);
    // Soft delete
    classEntity.activo = false;
    await this.classRepository.save(classEntity);
  }

  async incrementCupo(id: string): Promise<void> {
    const classEntity = await this.findOne(id);

    if (classEntity.cupoActual >= classEntity.cupoMaximo) {
      throw new BadRequestException('Cupo lleno');
    }

    classEntity.cupoActual += 1;
    await this.classRepository.save(classEntity);
  }

  async decrementCupo(id: string): Promise<void> {
    const classEntity = await this.findOne(id);

    if (classEntity.cupoActual <= 0) {
      throw new BadRequestException('Cupo ya en 0');
    }

    classEntity.cupoActual -= 1;
    await this.classRepository.save(classEntity);
  }

  async hasAvailableSpots(id: string): Promise<boolean> {
    const classEntity = await this.findOne(id);
    return classEntity.cupoActual < classEntity.cupoMaximo;
  }
}
