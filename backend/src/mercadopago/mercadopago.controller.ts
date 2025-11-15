import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, User } from '../users/entities/user.entity';

@Controller('mercadopago')
export class MercadopagoController {
  constructor(private readonly mercadopagoService: MercadopagoService) {}

  // ==================== PLANS (Admin only) ====================

  @Post('plans')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createPlan(@Body() createPlanDto: CreatePlanDto) {
    return this.mercadopagoService.createPlan(createPlanDto);
  }

  @Get('plans')
  async getAllPlans() {
    return this.mercadopagoService.getAllPlans();
  }

  @Get('plans/:id')
  async getPlan(@Param('id') id: string) {
    return this.mercadopagoService.getPlanById(id);
  }

  @Patch('plans/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updatePlan(
    @Param('id') id: string,
    @Body() updatePlanDto: UpdatePlanDto,
  ) {
    return this.mercadopagoService.updatePlan(id, updatePlanDto);
  }

  @Delete('plans/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deletePlan(@Param('id') id: string) {
    await this.mercadopagoService.deletePlan(id);
    return { message: 'Plan eliminado exitosamente' };
  }

  // ==================== PAYMENTS ====================

  @Post('create-preference')
  @UseGuards(JwtAuthGuard)
  async createPreference(
    @CurrentUser() user: User,
    @Body() createPreferenceDto: CreatePreferenceDto,
  ) {
    return this.mercadopagoService.createPreference(
      user.id,
      createPreferenceDto.planId,
    );
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(@Body() data: any, @Query() query: any) {
    console.log('MercadoPago Webhook received:', { data, query });
    return this.mercadopagoService.handleWebhook(data);
  }

  @Get('my-payments')
  @UseGuards(JwtAuthGuard)
  async getMyPayments(@CurrentUser() user: User) {
    return this.mercadopagoService.getUserPayments(user.id);
  }

  @Get('payments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllPayments() {
    return this.mercadopagoService.getAllPayments();
  }

  // For manually marking payment as approved (testing purposes)
  @Post('approve-payment')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async approvePayment(
    @Body()
    data: {
      preferenceId: string;
      paymentId: string;
      paymentData?: any;
    },
  ) {
    return this.mercadopagoService.approvePayment(
      data.preferenceId,
      data.paymentId,
      data.paymentData || {},
    );
  }
}
