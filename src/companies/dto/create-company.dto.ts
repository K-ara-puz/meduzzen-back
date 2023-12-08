import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Length } from 'class-validator';

export class CreateCompanyDto {
  @Length(3, 20)
  @ApiProperty()
  name: string;

  @IsOptional()
  @Length(10, 100)
  @ApiProperty()
  description: string;
}