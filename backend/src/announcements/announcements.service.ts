import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Or, IsNull } from 'typeorm';
import { Announcement, AnnouncementType } from './entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
  ) {}

  async create(
    createAnnouncementDto: CreateAnnouncementDto,
    autorId: string,
  ): Promise<Announcement> {
    const announcement = this.announcementRepository.create({
      ...createAnnouncementDto,
      autorId,
      fechaPublicacion: new Date(createAnnouncementDto.fechaPublicacion),
      fechaExpiracion: createAnnouncementDto.fechaExpiracion
        ? new Date(createAnnouncementDto.fechaExpiracion)
        : null,
    });

    return await this.announcementRepository.save(announcement);
  }

  async findAll(
    paginationDto: PaginationDto,
    tipo?: AnnouncementType,
  ): Promise<PaginatedResult<Announcement>> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.announcementRepository
      .createQueryBuilder('announcement')
      .leftJoinAndSelect('announcement.autor', 'autor')
      .where('announcement.activo = :activo', { activo: true })
      .andWhere('announcement.fechaPublicacion <= :now', { now: new Date() })
      .andWhere(
        '(announcement.fechaExpiracion IS NULL OR announcement.fechaExpiracion >= :now)',
        { now: new Date() },
      )
      .skip(skip)
      .take(limit)
      .orderBy('announcement.fechaPublicacion', 'DESC');

    if (tipo) {
      queryBuilder.andWhere('announcement.tipo = :tipo', { tipo });
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

  async findOne(id: string): Promise<Announcement> {
    const announcement = await this.announcementRepository.findOne({
      where: { id },
      relations: ['autor'],
    });

    if (!announcement) {
      throw new NotFoundException('Anuncio no encontrado');
    }

    return announcement;
  }

  async update(
    id: string,
    updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<Announcement> {
    const announcement = await this.findOne(id);

    if (updateAnnouncementDto.fechaPublicacion) {
      updateAnnouncementDto.fechaPublicacion = new Date(
        updateAnnouncementDto.fechaPublicacion,
      ).toISOString();
    }

    if (updateAnnouncementDto.fechaExpiracion) {
      updateAnnouncementDto.fechaExpiracion = new Date(
        updateAnnouncementDto.fechaExpiracion,
      ).toISOString();
    }

    Object.assign(announcement, updateAnnouncementDto);
    return await this.announcementRepository.save(announcement);
  }

  async remove(id: string): Promise<void> {
    const announcement = await this.findOne(id);
    // Soft delete
    announcement.activo = false;
    await this.announcementRepository.save(announcement);
  }
}
