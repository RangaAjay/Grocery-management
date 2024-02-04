import configuration from 'config/configuration';
import { Product } from 'src/product/entities/product.entity';
import {
  BaseEntity,
  Column,
  DataSource,
  Entity,
  EntityManager,
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

  // @AfterInsert()
  async reduceQuantityInProductTable() {
    const myDataSource = new DataSource({
      type: configuration().database.databaseType,
      host: configuration().database.dbHostname,
      port: configuration().database.databasePort,
      database: configuration().database.databaseName,
      password: configuration().database.databasePassword,
      username: configuration().database.databaseUsername,
      synchronize: true,
      logging: true,
    });

    const entityManager = new EntityManager(myDataSource);
    const productRepository = entityManager.getRepository(Product);
    productRepository
      .createQueryBuilder()
      .andWhere('id = :id', { id: this.id })
      .update('set unitsAvailable = unitsAvailable - :quantity', {
        quantity: this.quantity,
      })
      .execute();
  }
}
