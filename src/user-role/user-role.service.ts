import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserRoleDto, RemoveUserRoleDto } from './dts';
import { RoleService } from 'src/role/role.service';
import { ERoles } from 'src/role/enums';
import { IRole } from 'src/common/interfaces';

@Injectable()
export class UserRoleService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger("USER-ROLE-SERVICE");

    async onModuleInit() {
        await this.$connect();
        this.logger.log("Database connected")
    }

    constructor(private readonly roleServ: RoleService) {super();}

    //* Crear un rol para un usuario
    async create(create: CreateUserRoleDto) {
        let { userId, roleId } = create;
        if (!roleId) {
            const roles = await this.roleServ.findAll();
            const defaultRole = roles.find( role => ERoles.USER === role.name);
            roleId = defaultRole.id;
        }

        await this.userRole.create({
            data: {
                userId, roleId
            }
        });
        return [ERoles.USER];
    }

    //* Obtener los roles de un usuario
    async findUserRoles(userId: string): Promise<ERoles[]> {
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
        return roles.map( roles => roles.role.name) as ERoles[]
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
