import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  ProductCategory,
  ProductRateChargeType,
  ProductCurrency,
} from '../types';

export class UpdateProductRequestDto {
  @IsOptional()
  @IsString()
  productName: string;

  @IsOptional()
  @IsString()
  productDescription: string;

  @IsOptional()
  @IsEnum(ProductCategory)
  productCategory: ProductCategory;

  @IsOptional()
  @IsEnum(ProductRateChargeType)
  productRateChargeType: ProductRateChargeType;

  @IsOptional()
  @IsEnum(ProductCurrency)
  productCurrency: ProductCurrency;

  @IsOptional()
  @IsNumber()
  productPrice: number;
}
