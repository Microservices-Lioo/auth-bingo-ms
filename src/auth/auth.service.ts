import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RegisterAuthDto, LoginAuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { envs } from 'src/config';
import { ISignJwt } from './interfaces';
import { UserDto } from 'src/common/dto';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger("AUTH-SERVICE");

  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log("Database connected");
  }

  //* Registrar usuario
  async register(registerAuthDto: RegisterAuthDto) {
    const { password, ...data } = registerAuthDto;

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    let user = await this.user.findUnique({
      where: {
        email: data.email
      }
    });

    if (user) throw new RpcException({
      status: HttpStatus.BAD_REQUEST,
      message: `El usuario ya existe`,
      code: 'ALREADY_USER',
    });

    user = await this.userService.create({
      password: hash,
      ...data,
      roles: ['hola']
    });

    const payload = {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email
    };

    return {
      user: payload,
      access_token: await this.signJwt(payload),
      refresh_token: await this.generateRefreshTkn(user)
    };
  }

  //* Iniciar session
  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;
    let user = await this.user.findUnique({
      where: {
        email: email
      }
    });

    if (!user) throw new RpcException({
      status: HttpStatus.NOT_FOUND,
      message: `Usuario no encontrado`,
      code: 'USER_NOT_FOUND',
    });
    
    if (!user.isActive) throw new RpcException({
      status: HttpStatus.UNAUTHORIZED,
      message: `Cuenta eliminada`,
      code: 'UNAUTHORIZED',
    });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new RpcException({
      status: HttpStatus.UNAUTHORIZED,
      message: `Usuario/contraseña incorrecta`,
      code: 'INVALID_CREDENTIALS',
    });

    const payload = {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email
    };

    return {
      user: payload,
      access_token: await this.signJwt(payload),
      refresh_token: await this.generateRefreshTkn(payload)
    };
  }

  //* Generar un nuevo token
  async signJwt(data: ISignJwt) {
    return this.jwtService.sign(data, {
      secret: envs.JWT_SECRET,
      expiresIn: envs.JWT_EXPIRATION
    });
  }

  //* Generar un nuevo refresh token
  async signJwtRefresh(data: ISignJwt) {
    return this.jwtService.sign(data, {
      secret: envs.JWT_REFRESH_SECRET,
      expiresIn: envs.JWT_REFRESH_EXPIRATION
    });
  }

  //* Renovar un token
  async refreshTkn(refresh_token: string) {
    const token = await this.jwtService.verify(refresh_token, {
      secret: envs.JWT_REFRESH_SECRET,
    });

    const r_token = await this.refreshToken.findUnique({
      where: {
        token: refresh_token
      },
      include: { user: true }
    });

    if (!r_token || r_token.expiresAt < new Date()) throw new RpcException({
      status: HttpStatus.UNAUTHORIZED,
      message: `Refresh token caducado`,
      code: 'TOKEN_EXPIRED'
    });

    const payload = {
      id: token.id,
      name: token.name,
      lastname: token.lastname,
      email: token.email
    };

    return {
      access_token: await this.signJwt(payload),
      refresh_token: refresh_token
    };
  }

  //* Obtener el refresh token
  async generateRefreshTkn(user: ISignJwt) {
    const refreshTkn = await this.signJwtRefresh(user);

    await this.createRefreshTkn(refreshTkn, user);

    return refreshTkn;
  }

  //* Crea un nuevo registro de refresh token
  async createRefreshTkn(refreshTkn: string, user: ISignJwt) {
    await this.refreshToken.create({
      data: {
        token: refreshTkn,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
      }
    });
  }

  //* Verifica el token
  async verifyTokenAuth(access_token: string) {
    try {
      const { sub, iat, exp, ...user } = await this.jwtService.verify(
        access_token,
        {
          secret: envs.JWT_SECRET
        }
      );
      return user;
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.FORBIDDEN,
        message: `Token invalido`,
        code: 'INVALID_TOKEN',
      });
    }
  }

  //* Actualizar token
  async updateTokenInfo(user: UserDto) {
    const payload = {...user}
    return {
      access_token: await this.signJwt(payload),
      refresh_token: await this.generateRefreshTkn(payload)
    };
  }

}
