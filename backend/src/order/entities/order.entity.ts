import { User } from 'src/user/entities/user.entity';
import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './order-items.entity';

export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal' })
  totalPrice: number;

  @Column({ type: 'datetime', default: new Date() })
  createdAt: Date;

  // @OneToMany(() => OrderItem, (orderItem) => orderItem.orderId, { eager: true })
  // orderItems: OrderItem[];

  // @ManyToOne(() => User, (user) => user.orders, { eager: false })
  // user: User;

  @Column()
  userId: number;
}
