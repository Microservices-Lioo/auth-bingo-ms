import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateUserRoleDto {
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    userId: string;
    
    @IsOptional()
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    roleId?: string;
}