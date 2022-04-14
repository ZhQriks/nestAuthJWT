import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('surname') surname: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('phone') phone: string,
    @Body('role') role: string,
    @Body('username') username: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.appService.create({
      name,
      email,
      password: hashedPassword,
      surname,
      phone,
      role,
      username,
    });

    user.password = undefined;
    return user;
  }
  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.appService.findOne({ username });

    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Wrong password');
    }

    const jwt = await this.jwtService.signAsync({
      id: user.id,
    });

    response.cookie('jwt', jwt, { httpOnly: true });
    return { massage: 'Logged in' };
  }
  @Get('user')
  async user(@Req() reqest: Request) {
    try {
      const cookie = reqest.cookies['jwt'];

      const data = await this.jwtService.verifyAsync(cookie);
      if (!data) {
        throw new UnauthorizedException('Unauthorized');
      }
      const user = await this.appService.findOne({ id: data.id });

      user.password = undefined;
      return user;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return { massage: 'Logged out' };
  }
}
