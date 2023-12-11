import { Body, Controller, Post } from '@nestjs/common';
import { CompaniesInvitesService } from './companies_invites.service';
import { generalResponse } from '../interfaces/generalResponse.interface';

@Controller('companies-invites')
export class CompaniesInvitesController {
  constructor(private readonly companiesInvitesService: CompaniesInvitesService) {}

  @Post()
  async create(@Body() inviteData): Promise<generalResponse<object>> {
    return this.companiesInvitesService.create(inviteData);
  }
}
