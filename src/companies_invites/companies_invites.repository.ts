import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CompanyInvite } from '../entities/companyInvite';
import { InviteUserToCompany } from './dto/InviteUserToCompany.dto';
import { RequestInviteToCompany } from './dto/RequestInviteToCompany.dto';

export default class CompanyInviteRepo {
  constructor(
    @InjectRepository(CompanyInvite)
    private inviteRepository: Repository<CompanyInvite>,
  ) {}

  async findOneByCompanyIdAndUsersId(
    companyId: string,
    userFromId: string,
    targetUserId?: string,
  ): Promise<CompanyInvite> {
    const query = this.inviteRepository.createQueryBuilder('company_invite');
    if (targetUserId) {
      return await query
        .leftJoinAndSelect('company_invite.userFrom', 'user')
        .leftJoinAndSelect('company_invite.targetUser', 'targetUser')
        .leftJoinAndSelect('company_invite.company', 'company')
        .where('company_invite.company = :company', { company: companyId })
        .andWhere('company_invite.userFrom = :user', { user: userFromId })
        .andWhere('company_invite.targetUser = :targetUser', {
          targetUser: targetUserId,
        })
        .getOne();
    }
    return await query
      .leftJoinAndSelect('company_invite.userFrom', 'user')
      .leftJoinAndSelect('company_invite.company', 'company')
      .where('company_invite.company = :company', { company: companyId })
      .andWhere('company_invite.userFrom = :user', { user: userFromId })
      .getOne();
  }

  async createRequestToUser(inviteData): Promise<CompanyInvite> {
    return this.inviteRepository.save({ ...inviteData, type: 'invite' });
  }

  async createRequestToCompany(inviteData): Promise<CompanyInvite> {
    return this.inviteRepository.save({ ...inviteData, type: 'request' });
  }

  async abort(inviteId: string): Promise<CompanyInvite> {
    return this.inviteRepository.save({ id: inviteId, status: 'aborted' });
  }

  async approve(inviteId: string): Promise<CompanyInvite> {
    return this.inviteRepository.save({ id: inviteId, status: 'approved' });
  }

  async decline(inviteId: string): Promise<CompanyInvite> {
    return this.inviteRepository.save({ id: inviteId, status: 'declined' });
  }

  async findAllUserRequests(userId: string): Promise<CompanyInvite[]> {
    const queryBuilder =
      this.inviteRepository.createQueryBuilder('company_invite');

    return await queryBuilder
      .leftJoinAndSelect('company_invite.userFrom', 'user')
      .leftJoinAndSelect('company_invite.targetUser', 'targetUser')
      .leftJoinAndSelect('company_invite.company', 'company')
      .select(['user.id', 'targetUser.id', 'company_invite.type', 'company'])
      .where({ userFrom: { id: userId } })
      .andWhere({ type: 'request' }, { type: 'Request' })
      .getMany();
  }

  async findAllUserInvites(userId: string): Promise<CompanyInvite[]> {
    const queryBuilder =
      this.inviteRepository.createQueryBuilder('company_invite');

    return await queryBuilder
      .leftJoinAndSelect('company_invite.userFrom', 'user')
      .leftJoinAndSelect('company_invite.targetUser', 'targetUser')
      .leftJoinAndSelect('company_invite.company', 'company')
      .select(['user.id', 'targetUser.id', 'company_invite.type', 'company'])
      .where({ userFrom: { id: userId } })
      .andWhere({ type: 'invite' }, { type: 'Invite' })
      .getMany();
  }

  async findAllCompanyInvites(companyId: string): Promise<CompanyInvite[]> {
    const queryBuilder =
      this.inviteRepository.createQueryBuilder('company_invite');

    return await queryBuilder
      .leftJoinAndSelect('company_invite.userFrom', 'user')
      .leftJoinAndSelect('company_invite.targetUser', 'targetUser')
      .select(['user.id', 'targetUser.id', 'company_invite.type'])
      .where({ company: { id: companyId } })
      .andWhere({ type: 'invite' }, { type: 'Invite' })
      .getMany();
  }

  async findAllCompanyRequests(companyId: string): Promise<CompanyInvite[]> {
    const queryBuilder =
      this.inviteRepository.createQueryBuilder('company_invite');

    return await queryBuilder
      .leftJoinAndSelect('company_invite.userFrom', 'user')
      .leftJoinAndSelect('company_invite.targetUser', 'targetUser')
      .select(['user.id', 'targetUser.id', 'company_invite.type'])
      .where({ company: { id: companyId } })
      .andWhere({ type: 'request' }, { type: 'Request' })
      .getMany();
  }
}
