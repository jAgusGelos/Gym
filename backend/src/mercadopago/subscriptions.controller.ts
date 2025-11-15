import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // Crear nueva suscripción
  @Post()
  async createSubscription(
    @CurrentUser() user: User,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.createSubscription(
      user.id,
      createSubscriptionDto,
    );
  }

  // Obtener mis suscripciones
  @Get('my-subscriptions')
  async getMySubscriptions(@CurrentUser() user: User) {
    return this.subscriptionsService.getUserSubscriptions(user.id);
  }

  // Obtener suscripción activa
  @Get('active')
  async getActiveSubscription(@CurrentUser() user: User) {
    return this.subscriptionsService.getActiveSubscription(user.id);
  }

  // Obtener detalle de suscripción
  @Get(':id')
  async getSubscription(@Param('id') id: string) {
    return this.subscriptionsService.getSubscriptionById(id);
  }

  // Cancelar suscripción
  @Patch(':id/cancel')
  async cancelSubscription(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body('cancelReason') cancelReason?: string,
  ) {
    return this.subscriptionsService.cancelSubscription(
      id,
      user.id,
      cancelReason,
    );
  }

  // Pausar suscripción
  @Patch(':id/pause')
  async pauseSubscription(@CurrentUser() user: User, @Param('id') id: string) {
    return this.subscriptionsService.pauseSubscription(id, user.id);
  }

  // Reanudar suscripción
  @Patch(':id/resume')
  async resumeSubscription(@CurrentUser() user: User, @Param('id') id: string) {
    return this.subscriptionsService.resumeSubscription(id, user.id);
  }
}
