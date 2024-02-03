import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import {
  DeleteResult,
  FindOptionsWhere,
  MoreThan,
  ObjectId,
  Repository,
  UpdateResult,
} from 'typeorm';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../entities/product.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

class ProductRepository extends Repository<Product> {
  constructor(
    @InjectRepository(Product)
    private productRepository: ProductRepository,
  ) {
    super(
      productRepository.target,
      productRepository.manager,
      productRepository.queryRunner,
    );
  }

  async createNewProduct(createProductDto: CreateProductDto, user: User) {
    const { title, description, image, price, unitsAvailable } =
      createProductDto;
    const product = new Product();
    product.title = title;
    product.description = description;
    product.image = image;
    product.price = price;
    product.unitsAvailable = unitsAvailable;
    product.user = user;
    await product.save();
    return product;
  }

  getAllUserProduct(fromAdmin?: boolean): Promise<Product[]> {
    if (fromAdmin) {
      return this.find();
    } else {
      return this.findBy({ unitsAvailable: MoreThan(0) });
    }
  }

  findOneProduct(
    where: FindOptionsWhere<Product> | FindOptionsWhere<Product>[],
  ): Promise<Product> {
    return this.findOneByOrFail(where);
  }

  updateProduct(
    criteria:
      | string
      | number
      | Date
      | number[]
      | string[]
      | ObjectId
      | Date[]
      | ObjectId[]
      | FindOptionsWhere<Product>,
    partialEntity: QueryDeepPartialEntity<Product>,
  ): Promise<UpdateResult> {
    return this.update(criteria, partialEntity);
  }

  deleteProduct(
    criteria:
      | string
      | number
      | Date
      | number[]
      | string[]
      | ObjectId
      | Date[]
      | ObjectId[]
      | FindOptionsWhere<Product>,
  ): Promise<DeleteResult> {
    return this.delete(criteria);
  }
}

export default ProductRepository;
