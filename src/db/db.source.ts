import { ConfigService } from "@nestjs/config";
import { User } from "src/users/user.entity";
import { DataSource } from "typeorm";

export const dbConnection = [
  {
    provide: 'DataSource',
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.TYPEORM_HOST,
        port: +process.env.TYPEORM_PORT,
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        database: process.env.TYPEORM_DATABASE,
        synchronize: true,
        entities:[User]
      })

      return await dataSource.initialize()
    },
    inject:[ConfigService]
  }
]