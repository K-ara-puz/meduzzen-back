import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

export class IStartQuizAnswer {
  @IsNotEmpty()
  questionId: string;

  @IsNotEmpty()
  answersId: String[];
}

export class StartQuizDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(2)
  @Type(() => IStartQuizAnswer)
  @ValidateNested({ each: true })
  answers: IStartQuizAnswer[];
}
