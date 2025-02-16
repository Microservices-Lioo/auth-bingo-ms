import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginAuthDto, RegisterAuthDto } from './dto';

@Controller()
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @MessagePattern('registerAuth')
  register(@Payload() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @MessagePattern('loginAuth')
  login(@Payload() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @MessagePattern('updateInfoTokenAuth')
  updateInfoToken(@Payload() userId: number) {
    return this.authService.updateInfoToken(userId);
  }

  @MessagePattern('refreshAuth')
  refreshTkn(@Payload() refresh_token: string) {
    return this.authService.refreshTkn(refresh_token);
  }

  @MessagePattern('verifyTokenAuth')
  verifyTokenAuth(@Payload() access_token: string) {
    return this.authService.verifyTokenAuth(access_token);
  }
}
