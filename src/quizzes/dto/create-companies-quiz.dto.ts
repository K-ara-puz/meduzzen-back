import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

export class IQuizAnswer {
  @IsNotEmpty()
  value: string;

  @IsNotEmpty()
  isRight: boolean;
}

export class IQuizQuestion {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(2)
  @Type(() => IQuizAnswer)
  @ValidateNested({ each: true })
  answers: IQuizAnswer[];
}

export class CreateQuizDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsInt()
  attemptsPerDay: number;

  @IsNotEmpty()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => IQuizQuestion)
  questions: IQuizQuestion[];
}
