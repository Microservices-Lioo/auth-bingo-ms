import { Controller } from '@nestjs/common';
import { UserRoleService } from './user-role.service';

@Controller()
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}
}
