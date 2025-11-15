import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, User } from '../users/entities/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AnnouncementType } from './entities/announcement.entity';

@Controller('announcements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createAnnouncementDto: CreateAnnouncementDto,
    @CurrentUser() user: User,
  ) {
    return this.announcementsService.create(createAnnouncementDto, user.id);
  }

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('tipo') tipo?: AnnouncementType,
  ) {
    return this.announcementsService.findAll(paginationDto, tipo);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.announcementsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    return this.announcementsService.update(id, updateAnnouncementDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.announcementsService.remove(id);
    return { message: 'Anuncio eliminado exitosamente' };
  }
}
