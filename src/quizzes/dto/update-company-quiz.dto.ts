import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class IUpdateQuizAnswer {
  id?: string;

  value?: string;

  isRight?: boolean;
}

export class IUpdateQuizQuestion {
  id?: string;

  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  @Type(() => IUpdateQuizAnswer)
  @ValidateNested({ each: true })
  answers?: IUpdateQuizAnswer[];
}

export class UpdateQuizDto {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  attemptsPerDay?: number;

  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => IUpdateQuizQuestion)
  questions: IUpdateQuizQuestion[];
}
