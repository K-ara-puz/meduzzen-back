import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Company } from './company';

@Entity()
export class CompanyMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  userId: string;

  @OneToOne(() => Company, {
    eager: true,
    cascade: true,
    onDelete: 'SET NULL',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  companyId: string;

  @Column()
  role: string;
}
