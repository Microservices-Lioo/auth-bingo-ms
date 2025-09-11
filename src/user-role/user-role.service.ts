import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserRoleDto, RemoveUserRoleDto } from './dts';

@Injectable()
export class UserRoleService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger("USER-ROLE-SERVICE");

    async onModuleInit() {
        await this.$connect();
        this.logger.log("Database connected")
    }

    //* Crear un rol para un usuario
    async create(create: CreateUserRoleDto) {
        return await this.userRole.create({
            data: create
        });
    }

    //* Obtener los roles de un usuario
    async findUserRoles(userId: string) {
        const roles = await this.userRole.findMany({
            where: {userId},
            include: {
                role: {
                    select: {
                        name: true
                    }
                }
            }
        });
        return roles.map( roles => roles.role.name)
    }

    //* Eliminar un rol de un usuario
    async removeUserRole(removeDto: RemoveUserRoleDto) {
        const { userId, roleId } = removeDto;
        return await this.userRole.delete({
            where: { 
                userId_roleId: { userId, roleId }
             }
        });
    }
}
