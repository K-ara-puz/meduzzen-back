import { Controller, Post, Body } from '@nestjs/common';
import { CompaniesMembersService } from './companies-members.service';
import { CreateCompaniesMemberDto } from './dto/create-companies-member.dto';
import { generalResponse } from '../interfaces/generalResponse.interface';
import { CompanyMember } from '../entities/companyMember';

@Controller('companies-members')
export class CompaniesMembersController {
  constructor(private readonly companiesMembersService: CompaniesMembersService) {}

  @Post()
  async create(@Body() createCompaniesMemberDto: CreateCompaniesMemberDto): Promise<generalResponse<Partial<CompanyMember>>> {
    return this.companiesMembersService.create(createCompaniesMemberDto);
  }
}
