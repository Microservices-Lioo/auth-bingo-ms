import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateUserRoleDto {
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    userId: string;
    
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    roleId: string;
}