import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, User } from '../users/entities/user.entity';

@Controller('trainers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ENTRENADOR, UserRole.ADMIN)
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  // Obtener mis clientes
  @Get('my-clients')
  async getMyClients(@CurrentUser() user: User) {
    return this.trainersService.getMyClients(user.id);
  }

  // Obtener detalle de un cliente
  @Get('clients/:clientId')
  async getClientDetails(@CurrentUser() user: User, @Param('clientId') clientId: string) {
    return this.trainersService.getClientDetails(user.id, clientId);
  }

  // Obtener mis clases
  @Get('my-classes')
  async getMyClasses(@CurrentUser() user: User) {
    return this.trainersService.getMyClasses(user.id);
  }

  // Obtener mis estadísticas
  @Get('my-stats')
  async getMyStats(@CurrentUser() user: User) {
    return this.trainersService.getMyStats(user.id);
  }

  // === NUEVOS ENDPOINTS PARA WORKOUT ROUTINES ===

  // Obtener clientes con workout routines
  @Get('workout-clients')
  async getWorkoutClients(@CurrentUser() user: User) {
    return this.trainersService.getWorkoutClients(user.id);
  }

  // Obtener progreso de un cliente
  @Get('workout-clients/:clientId/progress')
  async getClientProgress(@CurrentUser() user: User, @Param('clientId') clientId: string) {
    return this.trainersService.getClientProgress(user.id, clientId);
  }

  // Obtener todos los miembros para asignar rutinas
  @Get('all-members')
  async getAllMembers(@CurrentUser() user: User) {
    return this.trainersService.getAllMembers(user.id);
  }
}
