import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/user/Get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { RoleGuard } from 'src/user/role/role.guard';
import { Roles } from 'src/user/roles/roles.decorator';
import { RoleEnum } from 'types/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiTags('Order User')
  @ApiBadRequestResponse({ description: 'Admin Cannot make an order' })
  @Post()
  @Roles(RoleEnum.USER)
  @UseGuards(AuthGuard(), RoleGuard)
  @ApiBearerAuth()
  create(
    @Body(ValidationPipe)
    createOrderDto: CreateOrderDto,
    @GetUser() user: User,
  ) {
    return this.orderService.create(createOrderDto, user);
  }

  @ApiTags('Order User')
  @Get()
  @Roles(RoleEnum.USER)
  @UseGuards(AuthGuard(), RoleGuard)
  @ApiBearerAuth()
  findAll(@GetUser() user: User) {
    return this.orderService.findAll(user);
  }

  @ApiTags('Order Admin')
  @Get('/admin')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthGuard(), RoleGuard)
  @ApiBearerAuth()
  findAllByAdmin(@GetUser() user: User) {
    return this.orderService.findAll(user, true);
  }

  @ApiTags('Order User')
  @Get(':id')
  @Roles(RoleEnum.USER)
  @UseGuards(AuthGuard(), RoleGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.orderService.findOne(+id, user);
  }

  @ApiTags('Order Admin')
  @Get(':id/admin')
  findOneAdmin(@Param('id') id: string, @GetUser() user: User) {
    return this.orderService.findOne(+id, user, true);
  }
}
