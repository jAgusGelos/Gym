import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Membership,
  MembershipType,
  MembershipStatus,
} from './entities/membership.entity';
import { User } from '../users/entities/user.entity';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class MembershipsService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createMembershipDto: CreateMembershipDto): Promise<Membership> {
    const { userId, tipo, fechaInicio, ...rest } = createMembershipDto;

    // Verificar que el usuario existe
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Calcular fecha de vencimiento según el tipo
    const fechaVencimiento = this.calculateExpirationDate(
      new Date(fechaInicio),
      tipo,
    );

    const membership = this.membershipRepository.create({
      userId,
      tipo,
      fechaInicio: new Date(fechaInicio),
      fechaVencimiento,
      estado: MembershipStatus.ACTIVA,
      ...rest,
    });

    return await this.membershipRepository.save(membership);
  }

  async findAll(
    paginationDto: PaginationDto,
    filters?: { estado?: MembershipStatus; userId?: string },
  ): Promise<PaginatedResult<Membership>> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.membershipRepository
      .createQueryBuilder('membership')
      .leftJoinAndSelect('membership.user', 'user')
      .skip(skip)
      .take(limit)
      .orderBy('membership.createdAt', 'DESC');

    if (filters?.estado) {
      queryBuilder.andWhere('membership.estado = :estado', {
        estado: filters.estado,
      });
    }

    if (filters?.userId) {
      queryBuilder.andWhere('membership.userId = :userId', {
        userId: filters.userId,
      });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Membership> {
    const membership = await this.membershipRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!membership) {
      throw new NotFoundException('Membresía no encontrada');
    }

    return membership;
  }

  async findActiveByUserId(userId: string): Promise<Membership | null> {
    return await this.membershipRepository.findOne({
      where: {
        userId,
        estado: MembershipStatus.ACTIVA,
      },
      order: { fechaVencimiento: 'DESC' },
    });
  }

  async update(
    id: string,
    updateMembershipDto: UpdateMembershipDto,
  ): Promise<Membership> {
    const membership = await this.findOne(id);

    // Si se cambia el tipo o fecha de inicio, recalcular vencimiento
    if (updateMembershipDto.tipo || updateMembershipDto.fechaInicio) {
      const tipo = updateMembershipDto.tipo || membership.tipo;
      const fechaInicio = updateMembershipDto.fechaInicio
        ? new Date(updateMembershipDto.fechaInicio)
        : membership.fechaInicio;

      updateMembershipDto.fechaVencimiento = this.calculateExpirationDate(
        fechaInicio,
        tipo,
      ).toISOString();
    }

    Object.assign(membership, updateMembershipDto);
    return await this.membershipRepository.save(membership);
  }

  async remove(id: string): Promise<void> {
    const membership = await this.findOne(id);
    await this.membershipRepository.remove(membership);
  }

  async updateExpiredMemberships(): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.membershipRepository
      .createQueryBuilder()
      .update(Membership)
      .set({ estado: MembershipStatus.VENCIDA })
      .where('fechaVencimiento < :today', { today })
      .andWhere('estado = :activa', { activa: MembershipStatus.ACTIVA })
      .execute();
  }

  async getExpiringMemberships(days: number = 7): Promise<Membership[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return await this.membershipRepository
      .createQueryBuilder('membership')
      .leftJoinAndSelect('membership.user', 'user')
      .where('membership.fechaVencimiento BETWEEN :today AND :futureDate', {
        today,
        futureDate,
      })
      .andWhere('membership.estado = :activa', {
        activa: MembershipStatus.ACTIVA,
      })
      .orderBy('membership.fechaVencimiento', 'ASC')
      .getMany();
  }

  private calculateExpirationDate(startDate: Date, type: MembershipType): Date {
    const expirationDate = new Date(startDate);

    switch (type) {
      case MembershipType.MENSUAL:
        expirationDate.setMonth(expirationDate.getMonth() + 1);
        break;
      case MembershipType.TRIMESTRAL:
        expirationDate.setMonth(expirationDate.getMonth() + 3);
        break;
      case MembershipType.SEMESTRAL:
        expirationDate.setMonth(expirationDate.getMonth() + 6);
        break;
      case MembershipType.ANUAL:
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        break;
      default:
        throw new BadRequestException('Tipo de membresía inválido');
    }

    return expirationDate;
  }

  getDaysRemaining(membership: Membership): number {
    const today = new Date();
    const expiration = new Date(membership.fechaVencimiento);
    const diffTime = expiration.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }
}
