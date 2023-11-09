import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MyLogger } from './logger/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db/db.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, MyLogger],
})
export class AppModule {}