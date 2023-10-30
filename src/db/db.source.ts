import { ConfigService } from "@nestjs/config";
import { User } from "src/users/user.entity";
import { DataSource } from "typeorm";

export const dbConnection = [
  {
    provide: 'DataSource',
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get<string>('TYPEORM_HOST'),
        port: +configService.get<number>('TYPEORM_PORT'),
        username: configService.get<string>('TYPEORM_USERNAME'),
        password: configService.get<string>('TYPEORM_PASSWORD'),
        database: configService.get<string>('TYPEORM_DATABASE'),
        synchronize: false,
        entities:[User]
      })

      return await dataSource.initialize()
    },
    inject:[ConfigService]
  }
]