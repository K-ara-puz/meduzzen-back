import {
  Body,
  Controller,
  Post,
  Request,
  Req,
  UseGuards,
  Put,
  Get,
  Param,
} from '@nestjs/common';
import { CompaniesInvitesService } from './companies_invites.service';
import { generalResponse } from '../interfaces/generalResponse.interface';
import { MyAuthGuard } from '../auth/auth.guard';
import { Roles } from '../companies/decorators/companyRoles.decorator';
import { CompanyRolesGuard } from '../companies/guards/companyRoles.guard';
import { UserFromToken } from '../users/decorators/userFromToken.decorator';
import { InviteUserToCompany } from './dto/InviteUserToCompany.dto';
import { RequestInviteToCompany } from './dto/RequestInviteToCompany.dto';
import { ApproveInviteToCompany } from './dto/ApproveInviteToCompany.dto';
import { ApproveInvitationUserToCompany } from './dto/ApproveInvitationUserToCompany.dto';
import { User } from '../entities/user.entity';
import { CompanyInvite } from '../entities/companyInvite';

@Controller('companies-invites')
@UseGuards(MyAuthGuard)
export class CompaniesInvitesController {
  constructor(
    private readonly companiesInvitesService: CompaniesInvitesService,
  ) {}


  @Get('/get-user-requests-to-company')
  async getAllUsersRequestsByUserId(
    @UserFromToken() user: User,
  ): Promise<generalResponse<CompanyInvite[]>> {
    return this.companiesInvitesService.getAllUsersRequestsOrInvitesByUserId(user.id, 'request');
  }

  @Get('/get-user-invites-to-company')
  async getAllUsersInvitesByUserId(
    @UserFromToken() user: User,
  ): Promise<generalResponse<CompanyInvite[]>> {
    return this.companiesInvitesService.getAllUsersRequestsOrInvitesByUserId(user.id, 'invite');
  }

  @Get('/get-company-invites/:id')
  @Roles(['admin', 'owner'])
  @UseGuards(CompanyRolesGuard)
  async getAllCompanyInvites(
    @Param('id') companyId: string,
  ): Promise<generalResponse<CompanyInvite[]>> {
    return this.companiesInvitesService.getAllCompanyInvitesOrRequest(companyId, 'invite');
  }
  @Get('/get-company-requests/:id')
  @Roles(['admin', 'owner'])
  @UseGuards(CompanyRolesGuard)
  async getAllCompanyRequests(
    @Param('id') companyId: string,
  ): Promise<generalResponse<CompanyInvite[]>> {
    return this.companiesInvitesService.getAllCompanyInvitesOrRequest(companyId, 'request');
  }

  @Post('/invite-user-to-company')
  @Roles(['admin', 'owner'])
  @UseGuards(CompanyRolesGuard)
  async inviteUserToCompany(
    @Body() inviteData: InviteUserToCompany,
    @UserFromToken() user: User,
  ): Promise<generalResponse<CompanyInvite>> {
    return this.companiesInvitesService.inviteUserToCompany({
      ...inviteData,
      userFromId: user.id,
    });
  }

  @Post('/invite-request-to-company')
  async inviteRequestToCompany(
    @Body() inviteData: RequestInviteToCompany,
    @UserFromToken() user: User,
  ): Promise<generalResponse<CompanyInvite>> {
    return this.companiesInvitesService.inviteRequestToCompany({
      ...inviteData,
      userFromId: user.id,
    });
  }

  @Put('/abort-invitation-user-to-company')
  @Roles(['admin', 'owner'])
  @UseGuards(CompanyRolesGuard)
  async abortInvitationUserToCompany(
    @Body() inviteData: ApproveInvitationUserToCompany,
    @UserFromToken() user: User,
  ): Promise<generalResponse<string>> {
    return this.companiesInvitesService.abortInvitationUserToCompany({
      ...inviteData,
      userFromId: user.id,
    });
  }

  @Put('/abort-invite-request-to-company')
  async abortInviteRequestToCompany(
    @Body() inviteData: RequestInviteToCompany,
    @UserFromToken() user: User,
  ): Promise<generalResponse<string>> {
    return this.companiesInvitesService.abortInviteRequestToCompany({
      ...inviteData,
      userFromId: user.id,
    });
  }

  @Put('/approve-invitation-user-to-company')
  @Roles(['admin', 'owner'])
  @UseGuards(CompanyRolesGuard)
  async approveInvitationUserToCompany(
    @Body() inviteData: ApproveInviteToCompany,
    @UserFromToken() user: User,
  ): Promise<generalResponse<CompanyInvite>> {
    return this.companiesInvitesService.approveInviteRequestToCompany({
      ...inviteData,
      targetUserId: user.id,
    });
  }

  @Put('/approve-invite-request-to-company')
  async approveInviteRequestToCompany(
    @Body() inviteData: ApproveInviteToCompany,
    @UserFromToken() user: User,
  ): Promise<generalResponse<CompanyInvite>> {
    return this.companiesInvitesService.approveInviteRequestToCompany({
      ...inviteData,
      targetUserId: user.id,
    });
  }

  @Put('/decline-invite-request-to-company')
  async declineInviteRequestToCompany(
    @Body() inviteData: ApproveInviteToCompany,
    @UserFromToken() user: User,
  ): Promise<generalResponse<CompanyInvite>> {
    return this.companiesInvitesService.declineInviteRequestToCompany({
      ...inviteData,
      targetUserId: user.id,
    });
  }

  @Put('/decline-user-request-to-company')
  @Roles(['admin', 'owner'])
  @UseGuards(CompanyRolesGuard)
  async declineUserRequestToCompany(
    @Body() inviteData: ApproveInviteToCompany,
    @UserFromToken() user: User,
  ): Promise<generalResponse<CompanyInvite>> {
    return this.companiesInvitesService.declineInviteRequestToCompany({
      ...inviteData,
      targetUserId: user.id,
    });
  }
}
