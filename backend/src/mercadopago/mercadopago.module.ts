import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MercadopagoService } from './mercadopago.service';
import { MercadopagoController } from './mercadopago.controller';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { MembershipPlan } from './entities/membership-plan.entity';
import { OnlinePayment } from './entities/online-payment.entity';
import { Subscription } from './entities/subscription.entity';
import { Membership } from '../memberships/entities/membership.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MembershipPlan, OnlinePayment, Subscription, Membership]),
    ConfigModule,
    forwardRef(() => NotificationsModule),
  ],
  controllers: [MercadopagoController, SubscriptionsController],
  providers: [MercadopagoService, SubscriptionsService],
  exports: [MercadopagoService, SubscriptionsService],
})
export class MercadopagoModule {}
