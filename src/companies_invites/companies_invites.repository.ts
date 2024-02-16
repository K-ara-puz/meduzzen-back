import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyInvite } from '../entities/companyInvite';
import { CompanyInviteTypes, CompanyInvitesStatuses } from '../utils/constants';

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
    return this.inviteRepository.save({
      ...inviteData,
      type: CompanyInviteTypes.invite,
    });
  }

  async createRequestToCompany(inviteData): Promise<CompanyInvite> {
    return this.inviteRepository.save({
      ...inviteData,
      type: CompanyInviteTypes.request,
    });
  }

  async abort(inviteId: string): Promise<CompanyInvite> {
    return this.inviteRepository.save({
      id: inviteId,
      status: CompanyInvitesStatuses.aborted,
    });
  }

  async approve(inviteId: string): Promise<CompanyInvite> {
    return this.inviteRepository.save({
      id: inviteId,
      status: CompanyInvitesStatuses.approved,
    });
  }

  async decline(inviteId: string): Promise<CompanyInvite> {
    return this.inviteRepository.save({
      id: inviteId,
      status: CompanyInvitesStatuses.declined,
    });
  }

  async findAllUserRequests(userId: string): Promise<CompanyInvite[]> {
    const queryBuilder =
      this.inviteRepository.createQueryBuilder('company_invite');

    return await queryBuilder
      .leftJoinAndSelect('company_invite.userFrom', 'user')
      .leftJoinAndSelect('company_invite.targetUser', 'targetUser')
      .leftJoinAndSelect('company_invite.company', 'company')
      .select([
        'user.id',
        'targetUser.id',
        'company_invite.type',
        'company',
        'company_invite.status',
        'company_invite.id',
      ])
      .where({ userFrom: { id: userId } })
      .andWhere({ type: CompanyInviteTypes.request })
      .getMany();
  }

  async findAllUserInvites(userId: string): Promise<CompanyInvite[]> {
    const queryBuilder =
      this.inviteRepository.createQueryBuilder('company_invite');

    return await queryBuilder
      .leftJoinAndSelect('company_invite.userFrom', 'user')
      .leftJoinAndSelect('company_invite.targetUser', 'targetUser')
      .leftJoinAndSelect('company_invite.company', 'company')
      .select([
        'user.id',
        'targetUser.id',
        'company_invite.type',
        'company',
        'company_invite.status',
        'company_invite.id',
      ])
      .where({ targetUser: { id: userId } })
      .andWhere({ type: CompanyInviteTypes.invite })
      .getMany();
  }

  async findAllCompanyInvites(companyId: string): Promise<CompanyInvite[]> {
    const queryBuilder =
      this.inviteRepository.createQueryBuilder('company_invite');

    return await queryBuilder
      .leftJoinAndSelect('company_invite.userFrom', 'user')
      .leftJoinAndSelect('company_invite.targetUser', 'targetUser')
      .leftJoinAndSelect('company_invite.company', 'company')
      .select([
        'user',
        'targetUser',
        'company',
        'company_invite.type',
        'company_invite.status',
        'company_invite.id',
      ])
      .where({ company: { id: companyId } })
      .andWhere({ type: CompanyInviteTypes.invite })
      .getMany();
  }

  async findAllCompanyRequests(companyId: string): Promise<CompanyInvite[]> {
    const queryBuilder =
      this.inviteRepository.createQueryBuilder('company_invite');

    return await queryBuilder
      .leftJoinAndSelect('company_invite.userFrom', 'user')
      .leftJoinAndSelect('company_invite.targetUser', 'targetUser')
      .leftJoinAndSelect('company_invite.company', 'company')
      .select([
        'user',
        'targetUser',
        'company',
        'company_invite.type',
        'company_invite.status',
        'company_invite.id',
      ])
      .where({ company: { id: companyId } })
      .andWhere({ type: CompanyInviteTypes.request })
      .getMany();
  }
}
