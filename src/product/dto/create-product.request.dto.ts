import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  ProductCategory,
  ProductRateChargeType,
  ProductCurrency,
} from '../types';

export class CreateProductRequestDto {
  @IsString()
  productName: string;

  @IsOptional()
  @IsString()
  productDescription: string;

  @IsEnum(ProductCategory)
  productCategory: ProductCategory;

  @IsEnum(ProductRateChargeType)
  productRateChargeType: ProductRateChargeType;

  @IsEnum(ProductCurrency)
  productCurrency: ProductCurrency;

  @IsNumber()
  productPrice: number;
}
