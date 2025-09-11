import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class RemoveUserRoleDto {
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    userId: string;
    
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    roleId: string;
}