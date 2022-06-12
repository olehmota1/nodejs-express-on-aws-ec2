import { Company } from '@/company/company.entity';
import { CompanyResponseDto } from '../dto/company.response.dto';

export const companyNormalizer = {
  getCompanyResponseDto(company: Company): CompanyResponseDto {
    return {
      companyId: company.companyId,
      companyName: company.companyName,
      companyAddress: company.companyAddress,
      companyBillingAddress: company.companyBillingAddress,
      companyIndustry: company.companyIndustry,
      companyEmployees: company.companyEmployees,
      companyWebsite: company.companyWebsite,
      companyCcDomain: company.companyCcDomain,
      companyEmail: company.companyEmail,
      companyCreatedAt: company.companyCreatedAt,
      companyUpdatedAt: company.companyUpdatedAt,
      ownerId: company.owner.userId,
      ownerName: company.owner.userName,
      ownerEmail: company.owner.userEmail,
    };
  },
};
