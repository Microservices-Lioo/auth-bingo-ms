import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('createUser')
  create(@Payload() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @MessagePattern('findOneUser')
  findOne(@Payload('id') id: number) {
    return this.userService.findOne(id);
  }

  @MessagePattern('findOneUserEmail')
  findOneEmail(@Payload('email') email: string) {
    return this.userService.findOneUserEmail(email);
  }

  @MessagePattern('updateUser')
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto.id, updateUserDto);
  }

  @MessagePattern('removeUser')
  remove(@Payload('id') id: number) {
    return this.userService.remove(id);
  }
}
