import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateCompanyRequestDto {
  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  companyAddress?: string;

  @IsString()
  @IsOptional()
  companyBillingAddress?: string;

  @IsString()
  @IsOptional()
  ownerName?: string;

  @IsEmail()
  @IsOptional()
  ownerEmail?: string;

  @IsString()
  @IsOptional()
  companyIndustry?: string;

  @IsString()
  @IsOptional()
  companyEmployees?: string;

  @IsString()
  @IsOptional()
  companyWebsite?: string;

  @IsString()
  @IsOptional()
  companyCcDomain?: string;

  @IsString()
  @IsOptional()
  companyEmail?: string;
}
