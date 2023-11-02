import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { MyLogger } from './logger/logger.service';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true, envFilePath: '.env'}), DbModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, MyLogger],
})
export class AppModule {}
