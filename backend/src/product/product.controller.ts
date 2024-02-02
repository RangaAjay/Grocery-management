import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { GetUser } from 'src/user/Get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { RoleGuard } from 'src/user/role/role.guard';
import { Roles } from 'src/user/roles/roles.decorator';
import { RoleEnum } from 'types/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthGuard(), RoleGuard)
  create(
    @Body(ValidationPipe)
    createProductDto: CreateProductDto,
    @GetUser() user: User,
  ) {
    return this.productService.create(createProductDto, user);
  }

  @Get()
  @UseGuards(AuthGuard())
  getAllUserProduct(@GetUser() user: User) {
    return this.productService.findAll(user);
  }

  @Get('/admin')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthGuard(), RoleGuard)
  getAllAdminProduct(@GetUser() user: User) {
    return this.productService.findAll(user, true);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.productService.findOne(id, user);
  }

  @Get(':id/admin')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthGuard(), RoleGuard)
  findOneAdmin(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.productService.findOne(id, user, true);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthGuard(), RoleGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthGuard(), RoleGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
