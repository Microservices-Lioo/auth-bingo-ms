import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNumber()
  @IsNotEmpty()
  id: number;

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
