import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const)
) {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
  
  @IsOptional()
  @IsString()
  @IsEmail()
  new_email: string;
  
  @IsOptional()
  @IsString()
  @MinLength(8)
  new_password: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  repit_new_password: string;
}
