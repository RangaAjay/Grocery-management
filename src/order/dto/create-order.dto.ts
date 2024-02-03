import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsPositive, ValidateNested } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: [
      { productId: 1, productQuantity: 2 },
      { productId: 2, productQuantity: 2 },
      { productId: 1, productQuantity: 2 },
    ],
    required: true,
  })
  @ValidateNested({ each: true })
  items: Array<SingleOrderItem>;
}
export class SingleOrderItem {
  @ApiProperty({ example: 1, required: true })
  @Type(() => Number)
  @IsPositive()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 1, required: true })
  @Type(() => Number)
  @IsPositive()
  @IsNotEmpty()
  productQuantity: number;
}
