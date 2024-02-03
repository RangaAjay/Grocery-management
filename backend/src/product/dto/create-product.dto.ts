import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(30)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(200)
  description: string;

  @IsUrl()
  @IsOptional()
  image: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  unitsAvailable: number;
}
