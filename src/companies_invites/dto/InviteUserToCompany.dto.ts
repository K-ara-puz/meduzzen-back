import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class InviteUserToCompany {
  @IsNotEmpty()
  @ApiProperty()
  companyId: string;

  @IsNotEmpty()
  @ApiProperty()
  targetUserId: string;

  @ApiProperty()
  userFromId?: string;
}