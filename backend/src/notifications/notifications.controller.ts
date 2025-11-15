import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Obtener notificaciones del usuario (paginadas)
  @Get()
  async getMyNotifications(
    @CurrentUser() user: User,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.notificationsService.findUserNotifications(
      user.id,
      paginationDto,
    );
  }

  // Obtener notificaciones no leídas
  @Get('unread')
  async getUnreadNotifications(@CurrentUser() user: User) {
    return this.notificationsService.findUnreadNotifications(user.id);
  }

  // Contar notificaciones no leídas
  @Get('unread-count')
  async getUnreadCount(@CurrentUser() user: User) {
    const count = await this.notificationsService.countUnread(user.id);
    return { count };
  }

  // Marcar notificación como leída
  @Patch(':id/read')
  async markAsRead(@CurrentUser() user: User, @Param('id') id: string) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  // Marcar todas como leídas
  @Patch('mark-all-read')
  async markAllAsRead(@CurrentUser() user: User) {
    await this.notificationsService.markAllAsRead(user.id);
    return { message: 'Todas las notificaciones marcadas como leídas' };
  }

  // Eliminar notificación
  @Delete(':id')
  async deleteNotification(@CurrentUser() user: User, @Param('id') id: string) {
    await this.notificationsService.remove(id, user.id);
    return { message: 'Notificación eliminada' };
  }

  // Eliminar todas las notificaciones leídas
  @Delete('read/all')
  async deleteAllRead(@CurrentUser() user: User) {
    await this.notificationsService.removeAllRead(user.id);
    return { message: 'Notificaciones leídas eliminadas' };
  }
}
