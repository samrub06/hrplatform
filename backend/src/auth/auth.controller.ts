import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginCommand } from './commands/login.command';
import { RegisterCommand } from './commands/register.command';
import { LoginRequestDto } from './dto/login.request.dto';
import { LoginResponseDto } from './dto/login.response.dto';
import { RegisterRequestDto } from './dto/register.request.dto';
import { RegisterResponseDto } from './dto/register.response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

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
}
