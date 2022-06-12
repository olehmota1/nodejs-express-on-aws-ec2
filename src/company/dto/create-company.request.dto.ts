import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateCompanyRequestDto {
  @IsString()
  companyName: string;

  @IsString()
  @IsOptional()
  companyAddress?: string;

  @IsString()
  @IsOptional()
  companyBillingAddress?: string;

  @IsString()
  ownerName: string;

  @IsEmail()
  ownerEmail: string;
}
