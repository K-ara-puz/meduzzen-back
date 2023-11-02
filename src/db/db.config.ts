import { DataSource } from "typeorm"
import { ConfigService } from "@nestjs/config";
// for unknown reasons ConfigService stopped see vars from .env without next line
import 'dotenv/config';

let configService = new ConfigService();

export const dataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('TYPEORM_HOST'),
  port: +configService.get<number>('TYPEORM_PORT'),
  username: configService.get<string>('TYPEORM_USERNAME'),
  password: configService.get<string>('TYPEORM_PASSWORD'),
  database: configService.get<string>('TYPEORM_DATABASE'),
  synchronize: false,
  entities:['dist/entities/*.js'],
  migrations: ['dist/migrations/*.js'],
})