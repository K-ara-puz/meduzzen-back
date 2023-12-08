import { PartialType } from '@nestjs/swagger';
import { CreateCompaniesMemberDto } from './create-companies-member.dto';

export class UpdateCompaniesMemberDto extends PartialType(CreateCompaniesMemberDto) {}
