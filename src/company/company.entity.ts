import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '@/user/user.entity';
import { Product } from '@/product/product.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  companyId: number;

  @Column()
  companyName: string;

  @Column()
  companyAddress?: string;

  @Column()
  companyBillingAddress?: string;

  @Column()
  companyIndustry?: string;

  @Column()
  companyEmployees?: string;

  @Column()
  companyWebsite?: string;

  @Column()
  companyCcDomain?: string;

  @Column()
  companyEmail?: string;

  @Column({ type: 'timestamp', default: () => 'now()' })
  companyCreatedAt: Date;

  @Column({ type: 'timestamp', default: () => 'now()' })
  companyUpdatedAt: Date;

  @Column()
  ownerId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'owner_id', referencedColumnName: 'userId' })
  owner: User;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Product, (product) => product.company)
  products: Product[];
}
