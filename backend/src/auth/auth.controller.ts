import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAdminCommand } from './commands/login-admin.command';
import { LoginCommand } from './commands/login.command';
import { RegisterAdminCommand } from './commands/register-admin.command';
import { RegisterCommand } from './commands/register.command';
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
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register User' })
  @ApiResponse({
    status: 201,
    description: 'Register Sucess',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 409, description: 'Email Already Used' })
  async register(
    @Body() registerDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return this.commandBus.execute(new RegisterCommand(registerDto));
  }

  @Post('login')
  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({
    status: 200,
    description: 'Login Success',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Information Invalid' })
  async login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.commandBus.execute(new LoginCommand(loginDto));
  }

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

  @Post('admin/register')
  @ApiOperation({ summary: 'Create Admin' })
  @ApiResponse({
    status: 201,
    description: 'Administrateur créé avec succès',
  })
  @ApiResponse({ status: 401, description: 'Code secret invalide' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  async RegisterAdmin(@Body() registerAdminDto: RegisterAdminRequestDto) {
    return this.commandBus.execute(new RegisterAdminCommand(registerAdminDto));
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google Authentication' })
  googleAuth() {
    // The redirection is handled by Passport
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google Auth Callback' })
  async googleAuthCallback(@Req() req, @Res() res) {
    try {
      const { access_token } = await this.authService.validateGoogleUser(
        req.user,
      );
      const redirectUrl = `${process.env.FRONTEND_URL}/auth/google/callback?token=${access_token}`;
      return res.redirect(redirectUrl);
    } catch (error) {
      console.error('Erreur Google Auth:', error);
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=auth_failed`,
      );
    }
  }
}
