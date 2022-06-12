export class CompanyResponseDto {
  companyId: number;
  companyName: string;
  companyAddress?: string;
  companyBillingAddress?: string;
  companyIndustry?: string;
  companyEmployees?: string;
  companyWebsite?: string;
  companyCcDomain?: string;
  companyEmail?: string;
  companyCreatedAt: Date;
  companyUpdatedAt: Date;
  ownerId: number;
  ownerName: string;
  ownerEmail: string;
}
