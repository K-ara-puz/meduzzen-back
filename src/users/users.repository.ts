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

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: CreateUserDto) {
    return this.userRepository.save(user);
  }

  async update(id: string, user: UpdateUserDto) {
    return this.userRepository.save({id: id, ...user});
  }

  async delete(id: string) {
    return this.userRepository.delete(id);
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: {email: email} })
  }
}