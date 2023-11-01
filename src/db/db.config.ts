import { DataSource } from "typeorm"
import { ConfigService } from "@nestjs/config";

let configService = new ConfigService();

export const dataSource = new DataSource({
  type: 'postgres',
  host: configService.get('TYPEORM_HOST'),
  port: +configService.get('TYPEORM_PORT'),
  username: configService.get('TYPEORM_USERNAME'),
  password: configService.get('TYPEORM_PASSWORD'),
  database: configService.get('TYPEORM_DATABASE'),
  synchronize: false,
  entities:['dist/entities/*.js'],
  migrations: ['dist/migrations/*.js'],
})