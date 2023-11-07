import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @Length(3, 20)
  firstName: string;

  @Length(3, 20)
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}