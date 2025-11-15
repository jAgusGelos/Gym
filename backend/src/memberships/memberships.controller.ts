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
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { MembershipStatus } from './entities/membership.entity';

@Controller('memberships')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() createMembershipDto: CreateMembershipDto) {
    return this.membershipsService.create(createMembershipDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('estado') estado?: MembershipStatus,
    @Query('userId') userId?: string,
  ) {
    return this.membershipsService.findAll(paginationDto, { estado, userId });
  }

  @Get('expiring')
  @Roles(UserRole.ADMIN)
  async getExpiringMemberships(@Query('days') days?: number) {
    return this.membershipsService.getExpiringMemberships(
      days ? parseInt(days.toString()) : 7,
    );
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async findOne(@Param('id') id: string) {
    const membership = await this.membershipsService.findOne(id);
    return {
      ...membership,
      diasRestantes: this.membershipsService.getDaysRemaining(membership),
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateMembershipDto: UpdateMembershipDto,
  ) {
    return this.membershipsService.update(id, updateMembershipDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.membershipsService.remove(id);
    return { message: 'Membresía eliminada exitosamente' };
  }
}
