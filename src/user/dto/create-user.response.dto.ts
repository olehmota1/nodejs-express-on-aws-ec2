import { UserRole } from '@/user/types';

export class CreateUserResponseDto {
  userId: number;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  userActive: boolean;
  companyId?: number;
  userCreatedAt: Date;
  userUpdatedAt: Date;
}
