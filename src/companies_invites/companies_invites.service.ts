import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import CompanyInviteRepo from './companies_invites.repository';
import CompanyMembersRepo from '../companies-members/company-members.repository';
import { generalResponse } from '../interfaces/generalResponse.interface';
import { CompanyInvite } from '../entities/companyInvite';
import { InviteUserToCompany } from './dto/InviteUserToCompany.dto';
import { RequestInviteToCompany } from './dto/RequestInviteToCompany.dto';
import {
  CompanyInviteTypes,
  CompanyInvitesStatuses,
  CompanyRoles,
} from '../utils/constants';

@Injectable()
export class CompaniesInvitesService {
  constructor(
    private inviteRepo: CompanyInviteRepo,
    private companyMembersRepo: CompanyMembersRepo,
  ) {}

  async getAllUsersRequestsOrInvitesByUserId(
    userId: string,
    type: string,
  ): Promise<generalResponse<CompanyInvite[]>> {
    try {
      let results: CompanyInvite[];
      if (type === CompanyInviteTypes.request) {
        results = await this.inviteRepo.findAllUserRequests(userId);
      }
      if (type === CompanyInviteTypes.invite) {
        results = await this.inviteRepo.findAllUserInvites(userId);
      }
      if (!results) throw new HttpException('not exist', HttpStatus.NOT_FOUND);
      return {
        status_code: HttpStatus.OK,
        detail: results,
        result: 'your invites',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllCompanyInvitesOrRequest(
    companyId: string,
    type: string,
  ): Promise<generalResponse<CompanyInvite[]>> {
    try {
      let results: CompanyInvite[];
      if (type === CompanyInviteTypes.request) {
        results = await this.inviteRepo.findAllCompanyRequests(companyId);
      }
      if (type === CompanyInviteTypes.invite) {
        results = await this.inviteRepo.findAllCompanyInvites(companyId);
      }
      if (!results) throw new HttpException('not exist', HttpStatus.NOT_FOUND);
      return {
        status_code: HttpStatus.OK,
        detail: results,
        result: 'your invites',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async inviteUserToCompany(
    inviteData: InviteUserToCompany,
  ): Promise<generalResponse<CompanyInvite>> {
    try {
      const invite = await this.inviteRepo.findOneByCompanyIdAndUsersId(
        inviteData.companyId,
        inviteData.userFromId,
        inviteData.targetUserId,
      );
      if (invite)
        throw new HttpException(
          'invite is already exist',
          HttpStatus.BAD_REQUEST,
        );
      const createdInvite = await this.inviteRepo.createRequestToUser({
        company: inviteData.companyId,
        targetUser: inviteData.targetUserId,
        userFrom: inviteData.userFromId,
        status: 'pending',
      });

      return {
        status_code: HttpStatus.OK,
        detail: createdInvite,
        result: 'your invite was created',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async inviteRequestToCompany(
    inviteData: RequestInviteToCompany,
  ): Promise<generalResponse<CompanyInvite>> {
    try {
      const companyOwnerId = await this.companyMembersRepo.getCompanyOwner(
        inviteData.companyId,
      );
      const invite = await this.inviteRepo.findOneByCompanyIdAndUsersId(
        inviteData.companyId,
        inviteData.userFromId,
        companyOwnerId,
      );
      if (invite)
        throw new HttpException(
          'invite is already exist',
          HttpStatus.BAD_REQUEST,
        );
      const createdInvite = await this.inviteRepo.createRequestToCompany({
        company: inviteData.companyId,
        targetUser: companyOwnerId,
        userFrom: inviteData.userFromId,
        status: 'pending',
      });

      return {
        status_code: HttpStatus.OK,
        detail: createdInvite,
        result: 'your invite was created',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async abortInvitationUserToCompany(
    inviteData: InviteUserToCompany,
  ): Promise<generalResponse<string>> {
    try {
      const invite = await this.inviteRepo.findOneByCompanyIdAndUsersId(
        inviteData.companyId,
        inviteData.userFromId,
        inviteData.targetUserId,
      );
      if (!invite)
        throw new HttpException('invite is not exist', HttpStatus.NOT_FOUND);
      if (invite.userFrom.id != inviteData.userFromId)
        throw new HttpException('FORBIDDEN RESOURCE', HttpStatus.FORBIDDEN);
      if (invite.status === CompanyInvitesStatuses.aborted)
        throw new HttpException(
          'invite is already aborted',
          HttpStatus.BAD_REQUEST,
        );
      await this.inviteRepo.abort(invite.id);
      return {
        status_code: HttpStatus.OK,
        detail: 'ok',
        result: 'your invite was aborted',
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async abortInviteRequestToCompany(
    inviteData: RequestInviteToCompany,
  ): Promise<generalResponse<string>> {
    try {
      const invite = await this.inviteRepo.findOneByCompanyIdAndUsersId(
        inviteData.companyId,
        inviteData.userFromId,
      );
      if (!invite)
        throw new HttpException('invite is not exist', HttpStatus.NOT_FOUND);
      if (invite.status === CompanyInvitesStatuses.aborted)
        throw new HttpException(
          'invite is already aborted',
          HttpStatus.BAD_REQUEST,
        );
      await this.inviteRepo.abort(invite.id);
      return {
        status_code: HttpStatus.OK,
        detail: 'ok',
        result: 'your invite was aborted',
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async approveInviteRequestToCompany(
    inviteData: InviteUserToCompany,
    type: string
  ): Promise<generalResponse<CompanyInvite>> {
    try {
      const invite = await this.inviteRepo.findOneByCompanyIdAndUsersId(
        inviteData.companyId,
        inviteData.userFromId,
        inviteData.targetUserId,
      );

      if (!invite)
        throw new HttpException('invite is not exist', HttpStatus.NOT_FOUND);
      if (invite.status === CompanyInvitesStatuses.approved)
        throw new HttpException(
          'invite is already approved',
          HttpStatus.BAD_REQUEST,
        );
      const approvedInvite = await this.inviteRepo.approve(invite.id);
      let user;
      user = {
        companyId: inviteData.companyId,
        role: CompanyRoles.simpleUser,
        userId: inviteData.targetUserId,
      };
      if (type === CompanyInviteTypes.request) {
        user = {
          companyId: inviteData.companyId,
          role: CompanyRoles.simpleUser,
          userId: inviteData.userFromId,
        };
      }
      await this.companyMembersRepo.create(user);
      return {
        status_code: HttpStatus.OK,
        detail: approvedInvite,
        result: 'your invite was approved',
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async declineInviteRequestToCompany(
    inviteData: InviteUserToCompany,
  ): Promise<generalResponse<CompanyInvite>> {
    try {
      const invite = await this.inviteRepo.findOneByCompanyIdAndUsersId(
        inviteData.companyId,
        inviteData.userFromId,
        inviteData.targetUserId,
      );

      if (!invite)
        throw new HttpException('invite is not exist', HttpStatus.NOT_FOUND);
      if (invite.status === CompanyInvitesStatuses.declined)
        throw new HttpException(
          'invite is already declined',
          HttpStatus.BAD_REQUEST,
        );
      const declinedInvite = await this.inviteRepo.decline(invite.id);
      return {
        status_code: HttpStatus.OK,
        detail: declinedInvite,
        result: 'your invite was declined',
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
