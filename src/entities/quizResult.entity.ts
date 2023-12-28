import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CompanyMember } from './companyMember';
import { Company } from './company';
import { Quiz } from './quiz.entity';
import { User } from './user.entity';

@Entity()
export class QuizResult {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  allQuestionsCount: number;

  @Column('decimal', { precision: 3, scale: 1 })
  rightQuestionsCount: number;

  @ManyToOne(() => CompanyMember, (companyMember) => companyMember.id, { 
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
   })
  @JoinColumn()
  companyMember: Partial<CompanyMember>;

  @ManyToOne(() => User, (user) => user.id, { 
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
   })
  @JoinColumn()
  user: Partial<User>;

  @ManyToOne(() => Company, (company) => company.id, { 
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
   })
  @JoinColumn()
  company: Partial<Company>;

  @ManyToOne(() => Quiz, (quiz) => quiz.id, { 
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
   })
  @JoinColumn()
  quiz: Partial<Quiz>;

  @Column({ default: () => "NOW()" })
  lastTryDate: Date;
}