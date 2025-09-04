import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginAuthDto, RegisterAuthDto } from './dto';
import { IUser } from 'src/common/interfaces';
import { UserDto } from 'src/common/dto';

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

  @MessagePattern('refreshTokenAuth')
  refreshTkn(@Payload() refresh_token: string) {
    return this.authService.refreshTkn(refresh_token);
  }

  @MessagePattern('verifyTokenAuth')
  verifyTokenAuth(@Payload() access_token: string) {
    return this.authService.verifyTokenAuth(access_token);
  }

  @MessagePattern('updateTokenInfo')
  updateTokenInfo(@Payload() user: UserDto) {
    return this.authService.updateTokenInfo(user);
  }
}
