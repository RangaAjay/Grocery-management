import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'Some Title', required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(30)
  title: string;

  @ApiProperty({ example: 'Some Description', required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(200)
  description: string;

  @ApiProperty({
    example: 'https://avatars.githubusercontent.com/u/117063355?v=4',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  image: string;

  @ApiProperty({
    example: 50,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    example: 500,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  unitsAvailable: number;
}
