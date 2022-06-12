import { Company } from '@/company/company.entity';
import { Profile } from '@/profile/profile.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UserRole } from './types';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  userName: string;

  @Column()
  userEmail: string;

  @Column()
  userRole: UserRole;

  @Index({ unique: true })
  @Column()
  userCognitoId: string;

  @Column()
  userCreatedBy?: number;

  @Column()
  userModifiedBy?: number;

  @Column({ type: 'timestamp', default: () => 'now()' })
  userCreatedAt: Date;

  @Column({ type: 'timestamp', default: () => 'now()' })
  userUpdatedAt: Date;

  @Column({ type: 'boolean', default: true })
  userActive: boolean;

  @Column({ type: 'int', nullable: true })
  companyId?: number;

  @ManyToOne(() => Company, (company) => company.users, { nullable: true })
  @JoinColumn({ name: 'company_id', referencedColumnName: 'companyId' })
  company?: Company;

  @OneToOne(() => Profile, (profile) => profile.user, { nullable: true })
  profile?: Profile;
}
