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
export class CompanyInvite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  userFrom: User;

  @ManyToOne(() => User, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  targetUser: User;

  @ManyToOne(() => Company, { 
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
   })
  @JoinColumn()
  company: Company;

  @Column({ default: () => 'NOW()' })
  createdAt: Date;

  @Column()
  status: string;

  @Column()
  type: string;
}
