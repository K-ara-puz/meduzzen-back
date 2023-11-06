import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

export default class UserRepo {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: CreateUserDto) {
    return this.userRepository.save(user);
  }

  async update(id: number, user: UpdateUserDto) {
    await this.userRepository.update(id, user);
    return this.findOne(id);
  }

  async delete(id: number) {
    return this.userRepository.delete(id);
  }
}