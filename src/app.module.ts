import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MyLogger } from './logger/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db/db.config';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { CompaniesModule } from './companies/companies.module';
import { CompaniesMembersModule } from './companies-members/companies-members.module';
import { CompaniesInvitesModule } from './companies_invites/companies_invites.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    AuthModule,
    UploadModule,
    CompaniesModule,
    CompaniesMembersModule,
    CompaniesInvitesModule
  ],
  controllers: [AppController],
  providers: [AppService, MyLogger],
})
export class AppModule {}