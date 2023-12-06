import { User } from "../entities/user.entity";

export interface PaginatedUsers {
  users: User[],
  totalItemsCount: number
}