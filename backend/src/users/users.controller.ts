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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, User } from './entities/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.usersService.sanitizeUser(user);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA, UserRole.ENTRENADOR)
  async findAll(@Query() query: UserFiltersDto) {
    const result = await this.usersService.findAll(query, query);
    return {
      ...result,
      data: result.data.map((user) => this.usersService.sanitizeUser(user)),
    };
  }

  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return this.usersService.sanitizeUser(user);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.update(user.id, updateUserDto);
    return this.usersService.sanitizeUser(updatedUser);
  }

  @Get('qr-code')
  async getQRCode(@CurrentUser() user: User) {
    return this.usersService.getQRCode(user.id);
  }

  @Get('attendance-history')
  async getAttendanceHistory(
    @CurrentUser() user: User,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.usersService.getAttendanceHistory(user.id, paginationDto);
  }

  @Get('membership')
  async getMembership(@CurrentUser() user: User) {
    return this.usersService.getUserMembership(user.id);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async getStats() {
    return this.usersService.getStats();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return this.usersService.sanitizeUser(user);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    return this.usersService.sanitizeUser(user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { message: 'Usuario eliminado exitosamente' };
  }
}
