import { User } from '@/user/user.entity';
import { CreateUserResponseDto } from '../dto/create-user.response.dto';
import { UserResponseDto } from '../dto/user.response.dto';

export const userNormalizer = {
  getCreateUserResponseDto(user: User): CreateUserResponseDto {
    return {
      userId: user.userId,
      userName: user.userName,
      userEmail: user.userEmail,
      userRole: user.userRole,
      userActive: user.userActive,
      companyId: user.companyId,
      userCreatedAt: user.userCreatedAt,
      userUpdatedAt: user.userUpdatedAt,
    };
  },

  getUserResponseDto(user: User): UserResponseDto {
    return {
      userId: user.userId,
      userName: user.userName,
      userEmail: user.userEmail,
      userRole: user.userRole,
      userActive: user.userActive,
      companyId: user.companyId,
      userCreatedAt: user.userCreatedAt,
      userUpdatedAt: user.userUpdatedAt,
      profile: user.profile
        ? {
            profileId: user.profile.profileId,
            workPhoneNumber: user.profile.workPhoneNumber,
            additionalPhoneNumber: user.profile.additionalPhoneNumber,
            profileJobRole: user.profile.profileJobRole,
          }
        : undefined,
    };
  },
};
