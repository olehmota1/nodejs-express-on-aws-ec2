import { Injectable, NotFoundException } from '@nestjs/common';
import { FindConditions, FindOneOptions, Not } from 'typeorm';
import { User } from './user.entity';
import { UserResponseDto } from './dto/user.response.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { CreateUserRequestDto } from './dto/create-user.request.dto';
import { AuthService } from '@/auth/auth.service';
import { ProfileService } from '@/profile/profile.service';
import { MailService } from '@/mail/mail.service';
import env from '@/config/env.config';
import { cleanObject } from '@/common/utils';
import isEmpty from 'lodash.isempty';
import { UserRepository } from './user.repository';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { v4 } from 'uuid';
import { CreateUserResponseDto } from './dto/create-user.response.dto';
import { userNormalizer } from './normalizers/user.normalizer';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
    private readonly mailService: MailService,
  ) {}

  @Transactional()
  async create(
    data: CreateUserRequestDto,
    creatorId?: number,
  ): Promise<CreateUserResponseDto> {
    const {
      userName,
      userEmail,
      userRole,
      workPhoneNumber,
      additionalPhoneNumber,
      profileJobRole,
    } = data;

    let companyId: number | undefined;

    if (creatorId) {
      const creator = await this.findOne({ userId: creatorId });
      companyId = creator.companyId;
    }

    const user = this.userRepository.create({
      userName,
      userEmail,
      userRole,
      companyId,
      userCreatedBy: creatorId,
      userCognitoId: v4(), // temporal
    });

    const savedUser = await this.userRepository.save(user);

    await this.profileService.create({
      userId: savedUser.userId,
      workPhoneNumber,
      additionalPhoneNumber,
      profileJobRole,
    });

    const cognitoUser = await this.authService.createUser(userEmail, userRole);

    // update with actual cognito user id
    await this.userRepository.save({
      ...savedUser,
      userCognitoId: cognitoUser.id,
    });

    await this.mailService.sendWelcomeEmail(userEmail, {
      password: cognitoUser.password,
      dashboardUrl: `${env().frontEndUrl}/auth/login?email=${encodeURIComponent(
        userEmail,
      )}`,
    });

    return userNormalizer.getCreateUserResponseDto(savedUser);
  }

  async findOne(
    where: FindConditions<User>,
    ownerId?: number,
  ): Promise<UserResponseDto> {
    const findOptions: FindOneOptions<User> = { where, relations: ['profile'] };

    if (ownerId) {
      findOptions.relations = ['company', 'profile'];
      findOptions.where = {
        ...where,
        company: { ownerId },
      };
    }

    const user = await this.userRepository.findOne(undefined, findOptions);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return userNormalizer.getUserResponseDto(user);
  }

  async findAll(companyId: number): Promise<UserResponseDto[]> {
    const userListResponse: UserResponseDto[] = await this.userRepository.find({
      where: { companyId },
      relations: ['profile'],
    });
    return userListResponse.map(userNormalizer.getUserResponseDto);
  }

  @Transactional()
  async update(
    id: number,
    data: UpdateUserRequestDto & { companyId?: number },
    ownerId?: number,
  ): Promise<void> {
    const findOptions: FindOneOptions<User> = {
      where: { userId: id },
      relations: ['profile'],
    };

    if (ownerId) {
      findOptions.relations = ['company', 'profile'];
      findOptions.where = {
        userId: id,
        company: { ownerId },
      };
    }

    const user = await this.userRepository.findOne(findOptions);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const { userName, userEmail, userRole, companyId, ...profileData } = data;

    if (userEmail) {
      await this.authService.updateUser(user.userCognitoId, userEmail);
    }

    if (userRole && userRole !== user.userRole) {
      await this.authService.updateUserGroup(
        user.userCognitoId,
        user.userRole,
        userRole,
      );
    }

    const userUpdate: Partial<User> = {
      userName,
      userEmail,
      userRole,
      companyId,
    };

    if (!isEmpty(userUpdate)) {
      await this.userRepository.save({
        ...user,
        ...cleanObject({
          ...userUpdate,
          userModifiedBy: ownerId,
        }),
      });
    }

    if (!isEmpty(profileData)) {
      await this.profileService.update(user.profile.profileId, profileData);
    }
  }

  @Transactional()
  async delete(id: number, ownerId?: number): Promise<void> {
    const findOptions: FindOneOptions<User> = { where: { userId: id } };

    if (ownerId) {
      findOptions.relations = ['company'];
      findOptions.where = {
        userId: id,
        company: { ownerId },
      };
    }

    const user = await this.userRepository.findOne(findOptions);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    await this.userRepository.remove([user]);

    await this.authService.deleteUser(user.userCognitoId);
  }

  async inactivate(
    id: number,
    userId: number,
    companyId: number,
  ): Promise<void> {
    const user = await this.userRepository.findOne(id, {
      where: { companyId, userId: Not(userId) },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    await this.authService.disableUser(user.userCognitoId);

    await this.userRepository.save({ ...user, userActive: false });
  }

  async reactivate(
    id: number,
    userId: number,
    companyId: number,
  ): Promise<void> {
    const user = await this.userRepository.findOne(id, {
      where: { companyId, userId: Not(userId) },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    await this.authService.enableUser(user.userCognitoId);

    await this.userRepository.save({ ...user, userActive: true });
  }
}
