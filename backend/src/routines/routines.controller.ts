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
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { RoutineFiltersDto } from './dto/routine-filters.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, User } from '../users/entities/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('routines')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.ENTRENADOR)
  async create(
    @Body() createRoutineDto: CreateRoutineDto,
    @CurrentUser() user: User,
  ) {
    return this.routinesService.create(createRoutineDto, user.id);
  }

  @Get()
  async findAll(@Query() filters: RoutineFiltersDto) {
    return this.routinesService.findAll(filters, filters);
  }

  @Get('favorites')
  async getFavorites(
    @CurrentUser() user: User,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.routinesService.findUserFavorites(user.id, paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    const routine = await this.routinesService.findOne(id);
    const isFavorite = await this.routinesService.isFavorite(id, user.id);

    return {
      ...routine,
      isFavorite,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.ENTRENADOR)
  async update(
    @Param('id') id: string,
    @Body() updateRoutineDto: UpdateRoutineDto,
  ) {
    return this.routinesService.update(id, updateRoutineDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.ENTRENADOR)
  async remove(@Param('id') id: string) {
    await this.routinesService.remove(id);
    return { message: 'Rutina eliminada exitosamente' };
  }

  @Post(':id/favorite')
  async toggleFavorite(@Param('id') id: string, @CurrentUser() user: User) {
    const favorited = await this.routinesService.toggleFavorite(id, user.id);
    return {
      favorited,
      message: favorited
        ? 'Rutina agregada a favoritos'
        : 'Rutina quitada de favoritos',
    };
  }
}
