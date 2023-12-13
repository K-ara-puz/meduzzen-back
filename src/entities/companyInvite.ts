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
    onDelete: 'SET NULL',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  userFrom: User;

  @ManyToOne(() => User)
  @JoinColumn()
  targetUser: User;

  @ManyToOne(() => Company, { eager: true })
  @JoinColumn()
  company: Company;

  @Column({ default: () => 'NOW()' })
  createdAt: Date;

  @Column()
  status: string;

  @Column()
  type: string;
}
