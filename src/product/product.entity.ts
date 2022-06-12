import { Company } from '@/company/company.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {
  ProductCategory,
  ProductRateChargeType,
  ProductCurrency,
} from './types';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column()
  productName: string;

  @Column()
  productDescription: string;

  @Column()
  productCategory: ProductCategory;

  @Column()
  productRateChargeType: ProductRateChargeType;

  @Column()
  productCurrency: ProductCurrency;

  @Column()
  productPrice: number;

  @Column({ type: 'timestamp', default: () => 'now()' })
  productCreatedAt: Date;

  @Column({ type: 'timestamp', default: () => 'now()' })
  productUpdatedAt: Date;

  @Column()
  companyId: number;

  @ManyToOne(() => Company, (company) => company.products)
  @JoinColumn({ name: 'company_id', referencedColumnName: 'companyId' })
  company: Company;
}
