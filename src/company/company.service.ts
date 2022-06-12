import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { CreateCompanyRequestDto } from './dto/create-company.request.dto';
import { UpdateCompanyRequestDto } from './dto/update-company.request.dto';
import { CompanyResponseDto } from './dto/company.response.dto';
import { UserRole } from '@/user/types';
import { UserService } from '@/user/user.service';
import isEmpty from 'lodash.isempty';
import { cleanObject } from '@/common/utils';
import { CompanyRepository } from './company.repository';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { companyNormalizer } from './normalizers/company.normalizer';
import { AuthService } from '@/auth/auth.service';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Transactional()
  async create(data: CreateCompanyRequestDto): Promise<CompanyResponseDto> {
    const { ownerName, ownerEmail, ...companyData } = data;

    const user = await this.userService.create({
      userName: ownerName,
      userEmail: ownerEmail,
      userRole: UserRole.ADMIN,
      workPhoneNumber: '',
    });

    const company = this.companyRepository.create({
      ...companyData,
      ownerId: user.userId,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const savedCo = await this.companyRepository.save(company);

    await this.userService.update(user.userId, {
      companyId: savedCo.companyId,
    });

    return companyNormalizer.getCompanyResponseDto({
      ...savedCo,
      owner: { ...user, userCognitoId: '' },
    });
  }

  async findOne(id: number): Promise<CompanyResponseDto> {
    const company = await this.companyRepository.findOne(id, {
      relations: ['owner'],
    });
    return companyNormalizer.getCompanyResponseDto(company);
  }

  async findAll(): Promise<CompanyResponseDto[]> {
    const companies = await this.companyRepository.find({
      relations: ['owner'],
    });

    return companies.map(companyNormalizer.getCompanyResponseDto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.companyRepository.delete(id);
  }

  @Transactional()
  async update(id: number, data: UpdateCompanyRequestDto): Promise<void> {
    const { ownerName, ownerEmail, ...companyData } = data;

    const company = await this.findOne(id);

    if (!company) {
      throw new NotFoundException('Company not found!');
    }

    if (!isEmpty(companyData)) {
      await this.companyRepository.save({
        ...company,
        ...cleanObject(companyData),
      });
    }

    if (data.ownerName || data.ownerEmail) {
      await this.userService.update(company.ownerId, {
        userName: ownerName,
        userEmail: ownerEmail,
      });
    }
  }

  async delete(id: number): Promise<void> {
    const company = await this.companyRepository.findOne(id, {
      relations: ['users'],
    });

    if (!company) {
      throw new NotFoundException('Company not found!');
    }

    await this.companyRepository.remove([company]);

    await Promise.all(
      company.users.map((user) =>
        this.authService.deleteUser(user.userCognitoId),
      ),
    );
  }
}
