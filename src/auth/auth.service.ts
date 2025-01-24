import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { RegisterAuthDto, LoginAuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, User } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { envs } from 'src/config';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ){
    super();
  }
  
  async onModuleInit() {
    await this.$connect();
  } 

  async register(registerAuthDto: RegisterAuthDto) {
    const { password, ...data } = registerAuthDto;

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    const user = await this.userService.create({
      password: hash,
      ...data
    });
    
    const payload = { 
      id: user.id, 
      name: user.name,
      lastname: user.lastname,
      email: user.email
    };

    return {
      user: payload,
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.generateRefreshTkn(user)
    };
  }

  async login(loginAuthDto: LoginAuthDto) {

    const user = await this.userService.findOneUserEmail(loginAuthDto.email);
    const isMatch = await bcrypt.compare(loginAuthDto.password, user.password);

    if ( !isMatch ) throw new RpcException({
      status: HttpStatus.UNAUTHORIZED,
      message: `Invalid credentials, incorrect password`
    });

    const payload = { 
      id: user.id, 
      name: user.name,
      lastname: user.lastname,
      email: user.email
    };

    return {
      user: payload,
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.generateRefreshTkn(user)
    };
  }

  async updateInfoToken(userId: number) {
    const user = await this.userService.findOne(userId);
    
    const payload = { 
      id: user.id, 
      name: user.name,
      lastname: user.lastname,
      email: user.email
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.generateRefreshTkn(user)
    };
  }

  async refreshTkn(refresh_token: string) {
    try {
      const token = await this.jwtService.verifyAsync(refresh_token, {
        secret: envs.JWT_REFRESH_SECRET,      
      });

      const r_token = await this.refreshToken.findUnique({
        where: {
          token: refresh_token
        },
        include: { user: true }
      });
  
      if ( !r_token || r_token.expiresAt < new Date() ) throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: `Refresh token expired`
      });
  
      const payload = { 
        id: token.id, 
        name: token.name,
        lastname: token.lastname,
        email: token.email
      };
  
      return {
        access_token: await this.jwtService.signAsync(payload),
        refresh_token
      };
    } catch (e) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: `Invalid refresh token`,
        error: `invalid_refresh_token`
      });
    }    
  }

  async generateRefreshTkn(user: User) {
    const payload = { 
      id: user.id, 
      name: user.name,
      lastname: user.lastname,
      email: user.email
    };

    const refreshTkn = await this.jwtService.signAsync(payload, { 
        secret: envs.JWT_REFRESH_SECRET,
        expiresIn: envs.JWT_REFRESH_EXPIRATION
    });

    await this.createRefreshTkn(refreshTkn, user);

    return refreshTkn;
  }

  async createRefreshTkn(refreshTkn: string, user: User) {
    await this.refreshToken.create({
      data: {
        token: refreshTkn,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
      }
    });
  }

  async verifyTokenAuth(access_token: string) {
    try {
      await this.jwtService.verifyAsync(
        access_token,
        {
          secret: envs.JWT_SECRET
        }
      );
      return true;
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: `Invalid token`,
        error: `invalid_token`
      });
    }
  }

}
