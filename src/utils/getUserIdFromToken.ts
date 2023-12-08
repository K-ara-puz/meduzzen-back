import { jwtDecode } from "jwt-decode";
import { User } from "../entities/user.entity";
import { ITokens } from "../interfaces/Tokens.interface";

export const getUserFromToken = (rawToken: string | Partial<ITokens>): Partial<User> => {
  const token = rawToken.toString().split(' ');
  return jwtDecode(token[1]);
}