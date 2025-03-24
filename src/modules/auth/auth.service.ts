
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@modules/users/users.service';
import { MailService } from '@modules/mail/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Omit<User, 'password'>): Promise<Tokens> {
    const payload: JwtPayload = { email: user.email, sub: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('app.jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('app.jwt.refreshExpiresIn'),
      }),
    };
  }

  async register(createUserDto: any) {
    const user = await this.usersService.create(createUserDto);
    await this.mailService.sendWelcomeEmail(user.email);
    return this.login(user);
  }

  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      await this.usersService.markEmailAsVerified(payload.sub);
      return { message: 'Email verified successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const token = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '15m' },
    );
    await this.mailService.sendPasswordResetEmail(email, token);
    return { message: 'Password reset email sent' };
  }
}
