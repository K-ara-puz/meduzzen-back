import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import AuthRepo from "./auth.repository";
import { Auth } from "../entities/auth.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ParseTokenMiddleware } from "../utils/userFromToken.middleware";
import { UsersService } from "../users/users.service";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Auth]), UsersModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepo, UsersService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ParseTokenMiddleware)
      .forRoutes('*');
  }
}