import { genSalt, hash } from 'bcrypt';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleEnum } from 'types/common';

@Entity()
export class User extends BaseEntity {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({
    type: 'varchar',
    length: 40,
    unique: true,
    // transformer: {
    //   to(value: string) {
    //     value.toLowerCase();
    //   },
    // },
  })
  email: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({ type: 'varchar', select: false })
  salt: string;

  @Column({
    type: 'enum',
    enum: [RoleEnum.ADMIN, RoleEnum.USER],
    default: RoleEnum.USER,
  })
  role: string;

  @OneToMany(() => Product, (product) => product.user, { eager: false })
  products: Product[];

  @OneToMany(() => Order, (order) => order.user, { eager: false })
  orders: Order[];

  constructor(email: string, pwd: string) {
    super();
    this.email = email;
    this.password = pwd;
  }

  @BeforeInsert()
  async hashPwdAndGenSalt() {
    this.salt = await genSalt();
    this.password = await hash(this.password, this.salt);
  }

  @BeforeUpdate()
  async hashPwd() {
    if (this.password) {
      this.password = await hash(this.password, this.salt);
    }
  }

  async validatePassword(password: string) {
    const comparedHash = await hash(password, this.salt);
    return comparedHash === this.password;
  }
}
