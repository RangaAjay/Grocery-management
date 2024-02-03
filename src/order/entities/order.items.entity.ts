import { Product } from 'src/product/entities/product.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'decimal' })
  totalPrice: number;

  @ManyToOne(() => Order, (order) => order.id, { eager: false })
  orderId: number;

  @ManyToOne(() => Product, (product) => product.id, { eager: true })
  @JoinColumn()
  product: Product;

  @Column()
  productId: number;
}
