import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { QuizQuestion } from './quizQuestion.entity';

@Entity()
export class QuizAnswer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  value: string;

  @ManyToOne(() => QuizQuestion, (question) => question.id, { 
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
   })
  @JoinColumn()
  question: Partial<QuizQuestion>;

  @Column()
  isRight: boolean;
}