import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Public } from '../casl/public.decorator';
import { CreateSessionCommand } from '../sessions/commands/create-session.command';
import { GoogleLoginCommand } from './commands/google-login.command';
import { LinkedInLoginCommand } from './commands/linkedin-login.command';
import { LoginAdminCommand } from './commands/login-admin.command';
import { LoginCommand } from './commands/login.command';
import { RefreshTokenCommand } from './commands/refresh-token.command';
import { RegisterAdminCommand } from './commands/register-admin.command';
import { RegisterCommand } from './commands/register.command';
import { RevokeUserTokensCommand } from './commands/revoke-token.command';
import { LoginAdminRequestDto } from './dto/login-admin.request.dto';
import { LoginRequestDto } from './dto/login.request.dto';
import { LoginResponseDto } from './dto/login.response.dto';
import { RegisterAdminRequestDto } from './dto/register-admin.request.dto';
import { RegisterRequestDto } from './dto/register.request.dto';
import { RegisterResponseDto } from './dto/register.response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiResponse({
    status: 200,
    description: 'Access Token refreshed successfully',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  async refreshToken(@Req() request: Request) {
    const refreshToken = request.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    return this.commandBus.execute(new RefreshTokenCommand(refreshToken));
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register User' })
  @ApiResponse({
    status: 201,
    description: 'Register Success',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 409, description: 'Email Already Used' })
  async register(
    @Body() registerDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return this.commandBus.execute(new RegisterCommand(registerDto));
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({
    status: 200,
    description: 'Login Success',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Information Invalid' })
  async login(
    @Body() loginRequestDto: LoginRequestDto,
    @Req() request: Request,
  ) {
    // Login
    const credentials = await this.commandBus.execute(
      new LoginCommand(loginRequestDto),
    );

    // Creation of the session
    const addSession = await this.commandBus.execute(
      new CreateSessionCommand({
        userId: credentials.userId,
        token: credentials.refreshToken,
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
      }),
    );

    if (!addSession) {
      throw new UnauthorizedException('Session not created');
    }

    return {
      accessToken: credentials.accessToken,
      refreshToken: credentials.refreshToken,
    };
  }

  @Public()
  @Post('admin/login')
  @ApiOperation({ summary: 'Login Admin' })
  @ApiResponse({
    status: 200,
    description: 'Login Success',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Information Invalid' })
  async loginAdmin(
    @Body() loginDto: LoginAdminRequestDto,
  ): Promise<LoginResponseDto> {
    return this.commandBus.execute(new LoginAdminCommand(loginDto));
  }

  @Public()
  @Post('admin/register')
  @ApiOperation({ summary: 'Create Admin' })
  @ApiResponse({
    status: 201,
    description: 'Administrator created successfully',
  })
  @ApiResponse({ status: 401, description: 'Invalid secret code' })
  @ApiResponse({ status: 409, description: 'Email already used' })
  async RegisterAdmin(@Body() registerAdminDto: RegisterAdminRequestDto) {
    return this.commandBus.execute(new RegisterAdminCommand(registerAdminDto));
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google Authentication' })
  googleAuth() {
    // The redirection is handled by Passport
  }

  @Public()
  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  @ApiOperation({ summary: 'LinkedIn Auth' })
  linkedinAuth() {
    // The redirection is managed by Passport
  }

  @Public()
  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  @ApiOperation({ summary: 'LinkedIn Auth Callback' })
  async linkedinAuthCallback(@Req() req: any, @Res() res: Response) {
    try {
      const { accessToken, refreshToken } = await this.commandBus.execute(
        new LinkedInLoginCommand({
          email: req.user.email,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          picture: req.user.picture,
          linkedinId: req.user.linkedinId,
        }),
      );

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/api/auth/refresh-token',
      });

      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/linkedin/callback?token=${accessToken}`,
      );
    } catch (error) {
      console.error('LinkedIn Auth Error:', error);
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=auth_failed`,
      );
    }
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google Auth Callback' })
  // req.user.email, req.user.first_name, req.user.last_name, req.user.picture, req.user.googleId
  async googleAuthCallback(@Req() req: any, @Res() res: any) {
    const user = req.user as any;
    try {
      const { accessToken, refreshToken } = await this.commandBus.execute(
        new GoogleLoginCommand({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          picture: user.picture,
          googleId: user?.id,
        
        }),
      );

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/api/auth/refresh-token',
      });
      const redirectUrl = `${process.env.FRONTEND_URL}/auth/google/callback?token=${accessToken}`;
      return res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google Auth Error:', error);
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=auth_failed`,
      );
    }
  }

  @Post('revoke-user-tokens/:userId')
  @ApiOperation({
    summary: 'Revoke all refresh tokens of a user',
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens revoked successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async revokeUserTokens(@Param('userId') userId: string) {
    await this.commandBus.execute(new RevokeUserTokensCommand(userId));
    return { message: 'All user tokens have been revoked' };
  }
}
