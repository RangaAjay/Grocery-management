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
import { RoleGuard } from 'src/user/role/role.guard';
import { Roles } from 'src/user/roles/roles.decorator';
import { RoleEnum } from 'types/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { GetUser } from 'src/user/Get-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(RoleEnum.USER)
  @UseGuards(AuthGuard(), RoleGuard)
  create(
    @Body(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    createOrderDto: CreateOrderDto,
    @GetUser() user: User,
  ) {
    return this.orderService.create(createOrderDto, user);
  }

  @Get()
  @Roles(RoleEnum.USER)
  @UseGuards(AuthGuard(), RoleGuard)
  findAll(@GetUser() user: User) {
    return this.orderService.findAll(user);
  }

  @Get('/admin')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthGuard(), RoleGuard)
  findAllByAdmin(@GetUser() user: User) {
    return this.orderService.findAll(user, true);
  }

  @Get(':id')
  @Roles(RoleEnum.USER)
  @UseGuards(AuthGuard(), RoleGuard)
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.orderService.findOne(+id, user);
  }

  @Get(':id/admin')
  findOneAdmin(@Param('id') id: string, @GetUser() user: User) {
    return this.orderService.findOne(+id, user, true);
  }
}
