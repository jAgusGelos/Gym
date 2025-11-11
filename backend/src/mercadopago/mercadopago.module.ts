import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MercadopagoService } from './mercadopago.service';
import { MercadopagoController } from './mercadopago.controller';
import { MembershipPlan } from './entities/membership-plan.entity';
import { OnlinePayment } from './entities/online-payment.entity';
import { Membership } from '../memberships/entities/membership.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MembershipPlan, OnlinePayment, Membership]),
    ConfigModule,
  ],
  controllers: [MercadopagoController],
  providers: [MercadopagoService],
  exports: [MercadopagoService],
})
export class MercadopagoModule {}
