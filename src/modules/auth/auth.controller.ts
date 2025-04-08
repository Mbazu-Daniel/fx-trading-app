import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto, VerifyEmailDto } from "./dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto.email, registerDto.password);
  }

  @Post("verify")
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    const success = await this.authService.verifyEmail(
      verifyEmailDto.email,
      verifyEmailDto.otp
    );

    return { success };
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
