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

  @ManyToOne(() => User, (user) => user, {
    eager: true,
    cascade: true,
    onDelete: 'SET NULL',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  user: Partial<User>;

  @ManyToOne(() => Company, { 
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
   })
  @JoinColumn()
  company: Partial<Company>;

  @Column()
  role: string;
}
