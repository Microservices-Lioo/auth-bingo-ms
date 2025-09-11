import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { UserRoleModule } from './user-role/user-role.module';

@Module({
  imports: [AuthModule, UserModule, RoleModule, UserRoleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
