export class CreateUserDto {
  readonly id?: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly login: string;
  readonly password: string;
}
