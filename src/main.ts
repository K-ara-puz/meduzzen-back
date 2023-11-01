import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyLogger } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors();
  app.useLogger(await app.resolve(MyLogger));
  await app.listen(process.env.DEV_PORT);
}
bootstrap();
