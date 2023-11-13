import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { DeleteResult, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ITokens } from "../interfaces/Tokens.interface";

export default class UserRepo {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: {email: email} })
  }

  async create(user: CreateUserDto): Promise<User> {
    return this.userRepository.save(user);
  }

  async update(id: string, user: UpdateUserDto): Promise<User> {
    return this.userRepository.save({id: id, ...user});
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

}