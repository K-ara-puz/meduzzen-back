import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ApproveInviteToCompany {
  @IsNotEmpty()
  @ApiProperty()
  companyId: string;

  @IsNotEmpty()
  @ApiProperty()
  userFromId: string;
}