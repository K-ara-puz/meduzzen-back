import { IsNotEmpty } from 'class-validator';

export class DeleteQuizDto {
  @IsNotEmpty()
  quizId: string;

  @IsNotEmpty()
  companyId: string;
}
