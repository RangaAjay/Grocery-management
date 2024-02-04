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

  async createOrder(
    parsedCreateOrder: IOrderPayload[],
    parsedOrderMap: Map<number, number>,
    user: User,
  ) {
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
    await this.changeQuantityInProductTable(parsedOrderMap, allProducts);
    const orderId = orderRes.id;
    orderItems = orderItems.map((itm) => ({ ...itm, orderId }));
    try {
      const res1 = await this.orderItemRepository.insert(orderItems);
      return res1;
    } catch (error) {
      return error;
    }
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
    const orderItems: {
      quantity: number;
      totalPrice: number;
      productId: number;
    }[] = [];
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

  async changeQuantityInProductTable(
    parsedOrderMap: Map<number, number>,
    productsInTable: Product[],
  ) {
    for (const product of productsInTable) {
      if (parsedOrderMap.has(product.id) && parsedOrderMap.get(product.id)) {
        await product.reduceQuantity(parsedOrderMap.get(product.id)!);
      }
    }
  }
}
export default OrderRepository;
