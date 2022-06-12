import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CompanyService } from './company.service';
import { CreateCompanyRequestDto } from './dto/create-company.request.dto';
import { SuccessResponseObject } from '../common/http';
import { UpdateCompanyRequestDto } from './dto/update-company.request.dto';
import { PayloadExistsValidationPipe } from '@/common/pipes/payload-exists.pipe';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { CompanyResponseDto } from './dto/company.response.dto';

@ApiTags('Company')
@UseGuards(AuthGuard('jwt'))
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiOperation({ summary: 'Create company' })
  @ApiCreatedResponse({
    description: 'User created successfully!',
    type: CompanyResponseDto,
  })
  @Post()
  async createCompany(@Body() body: CreateCompanyRequestDto) {
    try {
      const company = await this.companyService.create(body);

      return new SuccessResponseObject(
        'Company created successfully!',
        company,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOperation({ summary: 'Get all companies' })
  @ApiOkResponse({
    description: 'Companies fetched successfully!',
    type: [CompanyResponseDto],
  })
  @Get()
  async getCompanies() {
    try {
      const companies = await this.companyService.findAll();

      return new SuccessResponseObject(
        'Companies fetched successfully!',
        companies,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOperation({ summary: 'Get company by id' })
  @ApiOkResponse({
    description: 'Company fetched successfully!',
    type: CompanyResponseDto,
  })
  @Get(':id')
  async getCompany(@Param('id') id: number) {
    try {
      const company = await this.companyService.findOne(id);

      return new SuccessResponseObject(
        'Company fetched successfully!',
        company,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOperation({ summary: 'Update company by id' })
  @ApiOkResponse({ description: 'Company updated successfully!' })
  @Put(':id')
  async updateCompany(
    @Param('id') id: number,
    @Body(PayloadExistsValidationPipe) body: UpdateCompanyRequestDto,
  ) {
    try {
      await this.companyService.update(id, body);

      return new SuccessResponseObject('Company updated successfully!');
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOperation({ summary: 'Delete company by id' })
  @ApiNoContentResponse({ description: 'Company successfully deleted!' })
  @Delete(':id')
  async deleteCompany(@Param('id') id: number) {
    try {
      await this.companyService.delete(id);

      return new SuccessResponseObject('Company successfully deleted!');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error);
      }

      throw new InternalServerErrorException();
    }
  }
}
