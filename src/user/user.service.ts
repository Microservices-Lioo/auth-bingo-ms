import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';

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
      message: `User not found`
    });

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {

    const userData = await this.findOne(id);

    if ( updateUserDto.email != userData.email) throw new RpcException({
      status: HttpStatus.NOT_FOUND,
      message: `User with email: ${updateUserDto.email} not found`
    });

    const isMatch = await bcrypt.compare(updateUserDto.password, userData.password);

    if ( !isMatch ) throw new RpcException({
      status: HttpStatus.UNAUTHORIZED,
      message: `Password is incorrect`
    });

    if ( updateUserDto.new_password && updateUserDto.repit_new_password ) {
      if ( updateUserDto.new_password != updateUserDto.repit_new_password ) {
        throw new RpcException({
          status: HttpStatus.UNAUTHORIZED,
          message: `Passwords do not match`
        });
      } else {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(updateUserDto.new_password, salt);
        updateUserDto.password = hash;
        delete updateUserDto.new_password;
        delete updateUserDto.repit_new_password;
      }     
    } else {
      delete updateUserDto.password
    }

    if (updateUserDto.new_email) {
      updateUserDto.email = updateUserDto.new_email;
      delete updateUserDto.new_email;
    }

    const user = await this.user.update({
      data: updateUserDto,
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
