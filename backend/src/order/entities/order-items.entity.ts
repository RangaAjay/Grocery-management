import { Product } from 'src/product/entities/product.entity';
import { Column, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'number' })
  quantity: number;

  @Column({ type: 'number' })
  price: number;

  @ManyToOne(() => Order, (order) => order.id, { eager: false })
  orderId: number;

  @OneToOne(() => Product, (product) => product.id, { eager: true })
  product: Product;
}
