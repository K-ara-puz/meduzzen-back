import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RequestInviteToCompany {
  @IsNotEmpty()
  @ApiProperty()
  companyId: string;

  @ApiProperty()
  userFromId: string;
}