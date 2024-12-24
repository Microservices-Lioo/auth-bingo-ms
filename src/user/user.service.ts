import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService extends PrismaClient implements OnModuleInit {

  async onModuleInit() {
    await this.$connect();
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.user.create({
      data: createUserDto
    });
    return user;
  }

  async findOne(id: number) {
    const user = await this.user.findFirst({
      where: {
        id
      }
    });

    if (!user) throw new RpcException({
      status: HttpStatus.NOT_FOUND,
      message: `User with id #${id} not found`
    });

    return user;
  }

  async findOneUserEmail(email: string) {
    const user = await this.user.findUnique({
      where: {
        email: email
      }      
    });

    if ( !user ) throw new RpcException({
      status: HttpStatus.NOT_FOUND,
      message: `This user with id #${user.id} not found`
    });

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { id: userId , ...data } =  updateUserDto;
    const user = await this.user.update({
      data: data,
      where: {
        id: id
      }
    });

    return user;
  }

  async remove(id: number) {
    await this.findOne(id);

    const user = await this.user.delete({
      where: {
        id
      }
    });
    return user;
  }
}
