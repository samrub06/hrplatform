import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { ConfigService } from '@nestjs/config';
import { Role } from 'src/enums/role.enum';
import { UsersService } from '../users/users.service'; // Chemin relatif corrigé
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private get jwtSecret() {
    return this.configService.get<string>('JWT_SECRET');
  }

  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    if (
      !hashedPassword.startsWith('$2b$') &&
      !hashedPassword.startsWith('$2a$')
    ) {
      console.log(
        'WARNING: Stored hash does not appear to be a valid bcrypt hash',
      );
    }

    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    return isValid;
  }

  generateToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: this.jwtSecret,
    });
  }

  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        secret: this.jwtSecret,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByName(username);
    if (user && user.password === pass) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async register(registerDto: RegisterDto) {
    const {
      password,
      password_confirmation,
      email,
      role = Role.CANDIDATE,
    } = registerDto;

    // Vérifier si le mot de passe et la confirmation du mot de passe sont identiques
    if (password !== password_confirmation) {
      throw new UnauthorizedException('Passwords do not match');
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.usersService.findOneByName(email);
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    // Hasher le mot de passe
    const hashedPassword = await this.hashPassword(password);

    // Créer le nouvel utilisateur
    const newUser = await this.usersService.create({
      email,
      password: hashedPassword,
      role: role as Role,
    });

    // Générer le token
    const payload = {
      email: newUser.email,
      sub: newUser.id,
      roleId: newUser.roleId,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Trouver l'utilisateur
    const user = await this.usersService.findOneByName(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await this.comparePasswords(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password Invalid');
    }

    // Générer le token
    const payload = { email: user.email, sub: user.id, roleId: user.roleId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
