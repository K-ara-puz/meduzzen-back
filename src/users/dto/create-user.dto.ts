import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @Length(3, 20)
  firstName: string;

  @Length(3, 20)
  lastName: string;

  @IsEmail()
  login: string;

  @IsNotEmpty()
  password: string;
}