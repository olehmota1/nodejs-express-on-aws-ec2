import { UserRole } from '@/user/types';
export class UserResponseDto {
  userId: number;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  userActive: boolean;
  companyId?: number;
  userCreatedAt: Date;
  userUpdatedAt: Date;
  profile?: {
    profileId: number;
    workPhoneNumber: string;
    additionalPhoneNumber?: string;
    profileJobRole?: string;
  };
}
