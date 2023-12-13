import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Company } from './company';

@Entity()
export class CompanyMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user, { eager: true })
  @JoinColumn()
  user: Partial<User>;

  @ManyToOne(() => Company, { eager: true })
  @JoinColumn()
  company: Partial<Company>;

  @Column()
  role: string;
}
