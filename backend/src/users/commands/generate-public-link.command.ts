import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as crypto from 'crypto';
import { UserRepository } from '../user.repository';

export class GeneratePublicLinkCommand {
  constructor(public readonly userId: string) {}
}

@CommandHandler(GeneratePublicLinkCommand)
export class GeneratePublicLinkHandler
  implements ICommandHandler<GeneratePublicLinkCommand>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: GeneratePublicLinkCommand): Promise<string> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Générer un nouveau code si l'utilisateur n'en a pas
    if (!user.public_link_code) {
      const code = crypto.randomBytes(3).toString('hex');
      await this.userRepository.update(command.userId, {
        public_link_code: code,
      });
      return `${process.env.FRONTEND_URL}/user/profile/public/${code}`;
    }

    return `${process.env.FRONTEND_URL}/user/profile/public/${user.public_link_code}`;
  }
}
