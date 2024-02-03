import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { IOrderPayload } from 'types/common';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order.items.entity';

class OrderRepository extends Repository<Order> {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {
    super(
      orderRepository.target,
      orderRepository.manager,
      orderRepository.queryRunner,
    );
  }

  async createOrder(parsedCreateOrder: IOrderPayload[], user: User) {
    const createdAt = new Date();
    const productIds = [];
    for (const productItm of parsedCreateOrder) {
      productIds.push(productItm.productId);
    }
    const allProducts = await this.productRepository.find({
      where: {
        id: In(productIds),
      },
    });
    // eslint-disable-next-line prefer-const
    let { totalPrice, orderItems } = this.validateOrderQuantityAndGetPrice(
      allProducts,
      parsedCreateOrder,
    );

    const order = new Order();
    order.totalPrice = totalPrice;
    order.createdAt = createdAt;
    order.user = user;
    const orderRes = await order.save();
    const orderId = orderRes.id;
    orderItems = orderItems.map((itm) => ({ ...itm, orderId }));
    const res1 = await this.orderItemRepository.insert(orderItems);
    return res1;
  }

  getOrders(
    where: FindOptionsWhere<Order> | FindOptionsWhere<Order>[],
  ): Promise<Order[]> {
    return this.orderRepository.findBy(where);
  }

  getOrderById(
    where: FindOptionsWhere<Order> | FindOptionsWhere<Order>[],
  ): Promise<Order | null> {
    return this.orderRepository.findOneBy(where);
  }

  validateOrderQuantityAndGetPrice(
    allProducts: Product[],
    orderDetails: IOrderPayload[],
  ) {
    let totalPrice = 0;
    const orderItems: any[] = [];
    allProducts.forEach((prod) => {
      const productInPayload = orderDetails.find(
        (itm) => itm.productId === prod.id,
      );
      if (productInPayload) {
        if (productInPayload.productQuantity > prod.unitsAvailable) {
          throw new BadRequestException(
            `Insufficient quantity of product with id ${prod.id}`,
          );
        } else {
          totalPrice += prod.price * productInPayload.productQuantity;
          orderItems.push({
            quantity: productInPayload.productQuantity,
            totalPrice: prod.price * productInPayload.productQuantity,
            productId: prod.id,
          });
        }
      }
    });
    return { totalPrice, orderItems };
  }
}
export default OrderRepository;
