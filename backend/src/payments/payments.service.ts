import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { User } from '../users/entities/user.entity';
import { Membership } from '../memberships/entities/membership.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

export interface PaymentFilters {
  userId?: string;
  startDate?: string;
  endDate?: string;
  metodoPago?: string;
  estado?: PaymentStatus;
}

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { userId, membershipId, ...rest } = createPaymentDto;

    // Verificar usuario
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar membresía si se proporciona
    if (membershipId) {
      const membership = await this.membershipRepository.findOne({
        where: { id: membershipId },
      });
      if (!membership) {
        throw new NotFoundException('Membresía no encontrada');
      }
    }

    const payment = this.paymentRepository.create({
      userId,
      membershipId,
      ...rest,
      fecha: new Date(createPaymentDto.fecha),
      estado: PaymentStatus.PAGADO,
    });

    return await this.paymentRepository.save(payment);
  }

  async findAll(
    paginationDto: PaginationDto,
    filters?: PaymentFilters,
  ): Promise<PaginatedResult<Payment>> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.user', 'user')
      .leftJoinAndSelect('payment.membership', 'membership')
      .skip(skip)
      .take(limit)
      .orderBy('payment.fecha', 'DESC');

    if (filters?.userId) {
      queryBuilder.andWhere('payment.userId = :userId', {
        userId: filters.userId,
      });
    }

    if (filters?.startDate && filters?.endDate) {
      queryBuilder.andWhere('payment.fecha BETWEEN :start AND :end', {
        start: new Date(filters.startDate),
        end: new Date(filters.endDate),
      });
    }

    if (filters?.metodoPago) {
      queryBuilder.andWhere('payment.metodoPago = :metodo', {
        metodo: filters.metodoPago,
      });
    }

    if (filters?.estado) {
      queryBuilder.andWhere('payment.estado = :estado', {
        estado: filters.estado,
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

  async findUserPayments(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Payment>> {
    return this.findAll(paginationDto, { userId });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['user', 'membership'],
    });

    if (!payment) {
      throw new NotFoundException('Pago no encontrado');
    }

    return payment;
  }
}
