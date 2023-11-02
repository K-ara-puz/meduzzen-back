import { Logger } from "@nestjs/common";
import { dataSource } from "./db.config";

export const dbConnection = [
  {
    provide: 'DataSource',
    useFactory: async () => {
      let logger = new Logger('dbConnection');
      return dataSource.initialize().then(() => logger.verbose('db was connected'))
    },
  }
]