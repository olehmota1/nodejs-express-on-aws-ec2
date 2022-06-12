import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../types';

export class UpdateUserRequestDto {
  @IsString()
  @IsOptional()
  userName?: string;

  @IsEmail()
  @IsOptional()
  userEmail?: string;

  @IsEnum(UserRole)
  @IsOptional()
  userRole?: UserRole;

  @IsString()
  @IsOptional()
  workPhoneNumber?: string;

  @IsString()
  @IsOptional()
  additionalPhoneNumber?: string;

  @IsString()
  @IsOptional()
  profileJobRole?: string;
}
