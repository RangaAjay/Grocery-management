import { genSalt, hash } from 'bcrypt';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'varchar', length: 40, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  salt: string;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: string;

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
