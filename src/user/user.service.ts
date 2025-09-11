import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger("USER-SERVICE");

  async onModuleInit() {
    await this.$connect();
    this.logger.log("Database connected");
  }

  //* Crear un nuevo usuario
  async create(createUserDto: CreateUserDto) {
    const user = await this.user.create({
      data: createUserDto
    });
    return user;
  }

  //* Obtener un usuario por Id
  async findOne(id: string) {
    const user = await this.user.findFirst({
      where: {
        id
      }
    });

    if (!user) throw new RpcException({
      status: HttpStatus.NOT_FOUND,
      message: `Usuario con id #${id} no encontrado`,
      code: 'USER_NOT_FOUND'
    });

    return user;
  }

  //* Obtener un usuario por email
  async findOneUserEmail(email: string) {
    const user = await this.user.findUnique({
      where: {
        email: email
      }
    });

    if (!user) throw new RpcException({
      status: HttpStatus.NOT_FOUND,
      message: `Usuario con email ${email} no encontrado`,
      code: 'USER_NOT_FOUND'
    });

    return user;
  }

  //* Actualizar un usuario
  async update(id: string, updateUserDto: UpdateUserDto) {

    const userData = await this.findOne(id);

    if (updateUserDto.email != userData.email) throw new RpcException({
      status: HttpStatus.BAD_REQUEST,
      message: `Los datos no coinciden`,
      code: 'INVALID_DATA'
    });

    const isMatch = await bcrypt.compare(updateUserDto.password, userData.password);

    if (!isMatch) throw new RpcException({
      status: HttpStatus.UNAUTHORIZED,
      message: `Contraseña es incorrecta`,
      code: 'INVALID_PASSWORD'
    });

    if (updateUserDto.new_password && updateUserDto.repit_new_password) {
      if (updateUserDto.new_password != updateUserDto.repit_new_password) {
        throw new RpcException({
          status: HttpStatus.UNAUTHORIZED,
          message: `La nueva contraseña no coincide con su repetición`,
          code: 'INVALID_PASSWORD'
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
      },
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true
      }
    });

    return user;
  }

  //* Eliminar un usuario (deshabilitar)
  async remove(id: string) {

    await this.findOne(id);

    const user = await this.user.update({
      where: { id },
      data: {
        isActive: false
      }
    });
    return user;
  }

  //* Obtener todos los usuarios mediante sus id
  async findAllIds(ids: string[]) {
    return await this.user.findMany({
      where: {
        id: {
          in: ids
        }
      }
    })
  }
}
