import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('achievements')
@UseGuards(JwtAuthGuard)
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  // Admin: Crear logro
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createAchievementDto: CreateAchievementDto) {
    return this.achievementsService.create(createAchievementDto);
  }

  // Obtener todos los logros disponibles
  @Get()
  findAll() {
    return this.achievementsService.findAll();
  }

  // Obtener logros del usuario con progreso
  @Get('my-achievements')
  getUserAchievements(@Request() req) {
    return this.achievementsService.getUserAchievements(req.user.userId);
  }

  // Obtener estadísticas del usuario
  @Get('stats')
  getUserStats(@Request() req) {
    return this.achievementsService.getUserStats(req.user.userId);
  }

  // Verificar y actualizar logros del usuario (trigger manual)
  @Post('check')
  checkAndUpdate(@Request() req) {
    return this.achievementsService.checkAndUpdateAchievements(req.user.userId);
  }

  // Obtener un logro específico
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.achievementsService.findOne(id);
  }

  // Admin: Eliminar logro
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.achievementsService.remove(id);
  }
}
