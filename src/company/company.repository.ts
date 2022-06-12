import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { Company } from './company.entity';

@EntityRepository(Company)
export class CompanyRepository extends BaseRepository<Company> {}
