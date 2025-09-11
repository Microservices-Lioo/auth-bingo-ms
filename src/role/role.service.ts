import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RoleService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger("ROLE-SERVICE");

  async onModuleInit() {
    await this.$connect();
    this.logger.log("Database connected");
  }  

  //* Crear un nuevo rol
  async create(createRoleDto: CreateRoleDto) {
    return await this.role.create({
      data: createRoleDto
    });
  }

  //* Obtengo todos los roles
  async findAll() {
    return await this.role.findMany();
  }

  //* Obtengo un rol por ID
  async findOne(id: string) {
    const role = await this.role.findFirst({
      where: { id }
    });

    if (!role) throw new RpcException({
      status: HttpStatus.NOT_FOUND,
      message: `El rol con id ${id} no existe`
    });

    return role;
  }

  async update(updateRoleDto: UpdateRoleDto) {
    const { id, ...data } = updateRoleDto;

    return await this.role.update({
      where: { id },
      data: data
    });
  }

  async remove(id: string) {
    return await this.role.delete({
      where: { id }
    });
  }
}
