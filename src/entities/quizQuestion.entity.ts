import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Quiz } from './quiz.entity';

@Entity()
export class QuizQuestion {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.id, { 
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
   })
  @JoinColumn()
  quiz: Partial<Quiz>;
}