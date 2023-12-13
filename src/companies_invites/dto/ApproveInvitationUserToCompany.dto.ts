import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ApproveInvitationUserToCompany {
  @IsNotEmpty()
  @ApiProperty()
  companyId: string;

  @IsNotEmpty()
  @ApiProperty()
  targetUserId: string;
}