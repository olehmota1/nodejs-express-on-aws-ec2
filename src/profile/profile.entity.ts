import { User } from '@/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  profileId: number;

  @Column()
  workPhoneNumber: string;

  @Column()
  additionalPhoneNumber?: string;

  @Column()
  profileJobRole?: string;

  @Column({ type: 'timestamp', default: () => 'now()' })
  profileCreatedAt: Date;

  @Column({ type: 'timestamp', default: () => 'now()' })
  profileUpdatedAt: Date;

  @Column()
  userId: number;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user: User;
}
