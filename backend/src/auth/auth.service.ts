import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { ConfigService } from '@nestjs/config';
import { Role } from 'src/models/role.model';
import { UserRepository } from '../users/user.repository';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
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
    const user = await this.userRepository.findByEmail(username);
    if (user && user.password === pass) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async register(registerDto: RegisterDto) {
    const { password, password_confirmation, email, first_name, last_name } =
      registerDto;

    // Vérifier si le mot de passe et la confirmation du mot de passe sont identiques
    if (password !== password_confirmation) {
      throw new UnauthorizedException('Passwords do not match');
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    // Hasher le mot de passe
    const hashedPassword = await this.hashPassword(password);

    // Créer le nouvel utilisateur
    const newUser = await this.userRepository.create({
      email,
      password: hashedPassword,
      first_name,
      last_name,
    });

    // Générer le token
    const payload = {
      email: newUser.email,
      sub: newUser.id,
      role_id: newUser.role_id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Trouver l'utilisateur
    const user = await this.userRepository.findByEmail(email);
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
    const payload = { email: user.email, sub: user.id, role_id: user.role_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateGoogleUser(profile: any) {
    const { email, given_name, family_name } = profile?._json;
    let user = await this.userRepository.findByEmail(email);

    if (!user) {
      const roleType = await Role.findOne({ where: { name: 'candidate' } });
      if (!roleType) {
        throw new Error('Role candidate not found');
      }

      user = await this.userRepository.create({
        email,
        first_name: given_name,
        last_name: family_name || '',
        role_id: roleType.id,
      });
    }

    const payload = {
      email: user.email,
      sub: user.id,
      role_id: user.role_id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
