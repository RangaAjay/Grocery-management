import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from 'src/user/entities/user.entity';
import ProductRepository from './repository/product.repository';

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  create(createProductDto: CreateProductDto, user: User) {
    return this.productRepository.createNewProduct(createProductDto, user);
  }

  findAll(user: User, fromAdmin?: boolean) {
    return this.productRepository.getAllUserProduct(fromAdmin);
  }

  findOne(id: number, user: User, fromAdmin?: boolean) {
    return this.productRepository.findOneProduct(
      fromAdmin ? { id } : { id, userId: user.id },
    );
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.productRepository.updateProduct(id, updateProductDto);
  }

  remove(id: number) {
    return this.productRepository.deleteProduct(id);
  }
}
