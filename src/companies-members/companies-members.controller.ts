import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Delete,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { CompaniesMembersService } from './companies-members.service';
import { CreateCompaniesMemberDto } from './dto/create-companies-member.dto';
import { generalResponse } from '../interfaces/generalResponse.interface';
import { CompanyMember } from '../entities/companyMember';
import { Roles } from '../companies/decorators/companyRoles.decorator';
import { CompanyRolesGuard } from '../companies_roles/guards/companyRoles.guard';
import { UserFromToken } from '../users/decorators/userFromToken.decorator';
import { PaginatedItems } from '../interfaces/PaginatedItems.interface';
import { User } from '../entities/user.entity';
import { MyAuthGuard } from '../auth/auth.guard';
import { CompanyRoles } from '../utils/constants';

@Controller('companies-members')
@UseGuards(MyAuthGuard)
export class CompaniesMembersController {
  constructor(
    private readonly companiesMembersService: CompaniesMembersService,
  ) {}

  @Get('/all/:id')
  @Roles([CompanyRoles.admin, CompanyRoles.owner])
  @UseGuards(CompanyRolesGuard)
  async getCompanyMembers(
    @Param('id') companyId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<generalResponse<PaginatedItems<CompanyMember[]>>> {
    limit = limit > 100 ? 100 : limit;
    return this.companiesMembersService.getCompanyMembers(
      { page, limit },
      companyId,
    );
  }

  @Get(':id')
  async getMyCompanyMember(
    @Param('id') companyId: string,
    @UserFromToken() user: User,
  ): Promise<generalResponse<Partial<CompanyMember>>> {
    return this.companiesMembersService.findOne(user.id, companyId);
  }

  @Post()
  async create(
    @Body() createCompaniesMemberDto: CreateCompaniesMemberDto,
  ): Promise<generalResponse<Partial<CompanyMember>>> {
    return this.companiesMembersService.create(createCompaniesMemberDto);
  }

  @Delete('/delete/:id')
  @Roles([CompanyRoles.admin, CompanyRoles.owner])
  @UseGuards(CompanyRolesGuard)
  async deleteUserFromCompany(
    @Param('id') id: string,
    @Body() { companyId },
  ): Promise<generalResponse<string>> {
    return this.companiesMembersService.deleteUserFromCompany(id, companyId);
  }

  @Delete('/leave-company/:id')
  async leaveCompany(
    @Param('id') companyId: string,
    @UserFromToken() user: User,
  ): Promise<generalResponse<string>> {
    return this.companiesMembersService.deleteUserFromCompany(
      user.id,
      companyId,
    );
  }
}
