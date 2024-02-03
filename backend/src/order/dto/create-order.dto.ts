import { Type } from 'class-transformer';
import { IsNotEmpty, IsPositive, ValidateNested } from 'class-validator';

export class CreateOrderDto {
  @ValidateNested({ each: true })
  @Type(() => SingleOrderItem)
  items: Array<SingleOrderItem>;
}
class SingleOrderItem {
  @Type(() => Number)
  @IsPositive()
  @IsNotEmpty()
  productId: number;

  @Type(() => Number)
  @IsPositive()
  @IsNotEmpty()
  productQuantity: number;
}
