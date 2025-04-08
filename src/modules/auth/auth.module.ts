import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { ENVIRONMENT } from "src/common/config";

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: ENVIRONMENT.JWT.ACCESS_SECRET,
      signOptions: { expiresIn: ENVIRONMENT.JWT.ACCESS_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
