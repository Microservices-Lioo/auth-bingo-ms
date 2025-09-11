import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  //* Crear nuevo role
  @MessagePattern('createRole')
  create(@Payload() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  //* Obtener todos los roles
  @MessagePattern('findAllRole')
  findAll() {
    return this.roleService.findAll();
  }

  //* Obtener un rol por ID
  @MessagePattern('findOneRole')
  findOne(@Payload() id: string) {
    return this.roleService.findOne(id);
  }

  //* Actualizar un role por ID
  @MessagePattern('updateRole')
  update(@Payload() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(updateRoleDto);
  }

  //* Eliminar un rol por ID
  @MessagePattern('removeRole')
  remove(@Payload() id: string) {
    return this.roleService.remove(id);
  }
}
