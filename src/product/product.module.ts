import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import ProductRepository from './repository/product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), UserModule],
  controllers: [ProductController],
  providers: [ProductRepository, ProductService],
})
export class ProductModule {}
