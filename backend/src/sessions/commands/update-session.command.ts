import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { SessionUser } from '../../models/sessionUser.model';
import { SessionsRepository } from '../sessions.repository';

export class UpdateSessionCommand {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  token?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@CommandHandler(UpdateSessionCommand)
export class UpdateSessionHandler
  implements ICommandHandler<UpdateSessionCommand>
{
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async execute(
    command: UpdateSessionCommand,
  ): Promise<[number, SessionUser[]]> {
    const { id, ...updateData } = command;
    return this.sessionsRepository.update(id, {
      ...updateData,
      lastAccess: new Date(),
    });
  }
}
