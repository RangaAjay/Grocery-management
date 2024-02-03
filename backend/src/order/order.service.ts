import { Injectable } from '@nestjs/common';
import { serializeProductPayload } from 'src/utils/helpers';
import { CreateOrderDto } from './dto/create-order.dto';
import OrderRepository from './repository/order.repository';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  create(createOrderDto: CreateOrderDto, user: User) {
    const parsedArrayData = serializeProductPayload(createOrderDto);
    return this.orderRepository.createOrder(parsedArrayData, user);
  }

  findAll(user: User, fromAdmin?: boolean) {
    return this.orderRepository.getOrders(fromAdmin ? {} : { userId: user.id });
  }

  findOne(id: number, user: User, fromAdmin?: boolean) {
    return this.orderRepository.getOrderById(
      fromAdmin ? { id } : { id, userId: user.id },
    );
  }
}
