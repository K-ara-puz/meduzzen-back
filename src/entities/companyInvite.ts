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
export class CompanyInvite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  userFromId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  targetUserId: string;

  @ManyToOne(() => Company, {
    eager: true,
    // cascade: true,
    // onDelete: 'SET NULL',
    // orphanedRowAction: 'delete',
  })
  @JoinColumn()
  companyId: string;

  @Column({ default: () => "NOW()" })
  createdAt: Date;

  @Column()
  status: string;
}
