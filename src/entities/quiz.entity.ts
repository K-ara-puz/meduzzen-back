import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './company';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({default: null})
  description: string;

  @Column()
  attemptsPerDay: number;

  @ManyToOne(() => Company, { 
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
   })
  @JoinColumn()
  company: Partial<Company>;
}