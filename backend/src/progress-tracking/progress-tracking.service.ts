import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ProgressEntry } from './entities/progress-entry.entity';
import { CreateProgressEntryDto } from './dto/create-progress-entry.dto';
import { UpdateProgressEntryDto } from './dto/update-progress-entry.dto';

@Injectable()
export class ProgressTrackingService {
  constructor(
    @InjectRepository(ProgressEntry)
    private progressRepository: Repository<ProgressEntry>,
  ) {}

  async create(userId: string, createDto: CreateProgressEntryDto): Promise<ProgressEntry> {
    const entry = this.progressRepository.create({
      ...createDto,
      userId,
    });
    return this.progressRepository.save(entry);
  }

  async findAllByUser(userId: string): Promise<ProgressEntry[]> {
    return this.progressRepository.find({
      where: { userId },
      order: { fecha: 'DESC' },
    });
  }

  async findByDateRange(userId: string, startDate: string, endDate: string): Promise<ProgressEntry[]> {
    return this.progressRepository.find({
      where: {
        userId,
        fecha: Between(new Date(startDate), new Date(endDate)),
      },
      order: { fecha: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<ProgressEntry> {
    const entry = await this.progressRepository.findOne({
      where: { id, userId },
    });

    if (!entry) {
      throw new NotFoundException('Registro de progreso no encontrado');
    }

    return entry;
  }

  async update(id: string, userId: string, updateDto: UpdateProgressEntryDto): Promise<ProgressEntry> {
    const entry = await this.findOne(id, userId);
    Object.assign(entry, updateDto);
    return this.progressRepository.save(entry);
  }

  async remove(id: string, userId: string): Promise<void> {
    const entry = await this.findOne(id, userId);
    await this.progressRepository.remove(entry);
  }

  async getStats(userId: string) {
    const entries = await this.findAllByUser(userId);

    if (entries.length === 0) {
      return {
        totalEntries: 0,
        latestWeight: null,
        weightChange: null,
        latestBodyFat: null,
        bodyFatChange: null,
      };
    }

    const latest = entries[0];
    const oldest = entries[entries.length - 1];

    const weightChange = latest.peso && oldest.peso
      ? Number(latest.peso) - Number(oldest.peso)
      : null;

    const bodyFatChange = latest.grasaCorporal && oldest.grasaCorporal
      ? Number(latest.grasaCorporal) - Number(oldest.grasaCorporal)
      : null;

    return {
      totalEntries: entries.length,
      latestWeight: latest.peso,
      weightChange,
      latestBodyFat: latest.grasaCorporal,
      bodyFatChange,
      firstEntry: oldest.fecha,
      latestEntry: latest.fecha,
    };
  }
}
