import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MyLogger } from './logger/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db/db.config';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { CompaniesModule } from './companies/companies.module';
import { CompaniesMembersModule } from './companies-members/companies-members.module';
import { CompaniesInvitesModule } from './companies_invites/companies_invites.module';
import { CompaniesRolesModule } from './companies_roles/companies_roles.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { RedisService } from './redis/redis.service';
import { AnaliticsModule } from './companies/analitics/analitics.module';
import { SocketsModule } from './sockets/sockets.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SheduleTasksModule } from './shedule_tasks/shedule_tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    AuthModule,
    UploadModule,
    CompaniesModule,
    CompaniesMembersModule,
    CompaniesInvitesModule,
    CompaniesRolesModule,
    QuizzesModule,
    ScheduleModule.forRoot(),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<RedisModuleOptions> => {
        return {
          config: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
            password: configService.get('REDIS_PASS'),
          },
        };
      },
    }),
    AnaliticsModule,
    SocketsModule,
    NotificationsModule,
    SheduleTasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, MyLogger, RedisService],
})
export class AppModule {}
