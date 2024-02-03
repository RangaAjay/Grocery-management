import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  title: string;

  @Column({ type: 'varchar', length: 200 })
  description: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  image: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'integer', default: 0 })
  unitsAvailable: number;

  @ManyToOne(() => User, (user) => user.products, { eager: false })
  user: User;

  @Column()
  userId: number;
}
