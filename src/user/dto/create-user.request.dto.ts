import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

import { UserRole } from '../types';

export class CreateUserRequestDto {
  @IsString()
  userName: string;

  @IsEmail()
  userEmail: string;

  @IsEnum(UserRole)
  userRole: UserRole;

  @IsString()
  workPhoneNumber: string;

  @IsString()
  @IsOptional()
  additionalPhoneNumber?: string;

  @IsString()
  @IsOptional()
  profileJobRole?: string;
}
