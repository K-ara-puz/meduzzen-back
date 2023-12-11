import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CompanyInvite } from '../entities/companyInvite';

export default class CompanyInviteRepo {
  constructor(
    @InjectRepository(CompanyInvite)
    private inviteRepository: Repository<CompanyInvite>,
  ) {}

  async findOne(id: string) {
    return this.inviteRepository.findOne({ where: { id } });
  }

  async create(inviteData) {
    console.log(inviteData, "RR");
    // let t = await this.inviteRepository.save(inviteData);
    // console.log(t, "PPPPPSSSSSSSS")
    return this.inviteRepository.save(inviteData);
  }

}