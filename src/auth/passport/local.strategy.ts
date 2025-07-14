
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
        throw new UnauthorizedException("Username or password is incorrect");
    }
    if (!user.isActive) {
      throw new BadRequestException("Your account is not activated. Please check your email for the activation link.");
    }
    return user;
  }
}
