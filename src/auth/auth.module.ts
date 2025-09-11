import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config';
import { UserModule } from 'src/user/user.module';
import { NatsModule } from 'src/transport/nats.module';
import { UserRoleModule } from 'src/user-role/user-role.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: envs.JWT_SECRET,
      signOptions: { expiresIn: envs.JWT_EXPIRATION }
    }),
    UserModule,
    NatsModule,
    UserRoleModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
