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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiTags('Product Admin')
  @ApiOkResponse({
    description: 'Created New Product',
  })
  @ApiBearerAuth()
  @Post()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthGuard(), RoleGuard)
  create(
    @Body()
    createProductDto: CreateProductDto,
    @GetUser() user: User,
  ) {
    return this.productService.create(createProductDto, user);
  }

  @ApiTags('Product User')
  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  getAllUserProduct(@GetUser() user: User) {
    return this.productService.findAll(user);
  }

  @ApiTags('Product Admin')
  @Get('/admin')
  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @UseGuards(AuthGuard(), RoleGuard)
  getAllAdminProduct(@GetUser() user: User) {
    return this.productService.findAll(user, true);
  }

  @ApiTags('Product User')
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.productService.findOne(id, user);
  }

  @ApiTags('Product Admin')
  @Get(':id/admin')
  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @UseGuards(AuthGuard(), RoleGuard)
  findOneAdmin(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.productService.findOne(id, user, true);
  }

  @ApiTags('Product Admin')
  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @UseGuards(AuthGuard(), RoleGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(+id, updateProductDto);
  }

  @ApiTags('Product Admin')
  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @UseGuards(AuthGuard(), RoleGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
