
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePasswordHelper, hashPasswordHelper } from '@/helper/util';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private JwtService: JwtService,
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    const isValidPassword = await comparePasswordHelper(password, user.password);
    if (!isValidPassword || !user) return null;
    return user;
  }

  async login(user: any){
    const payload = {
      username: user.email,
      sub: user._id,
    };
    return {
      access_token: this.JwtService.sign(payload),
    };
  }

  async handRegister(registerDto: CreateAuthDto) {
      return await this.usersService.handleRegister(registerDto);
  }
}
