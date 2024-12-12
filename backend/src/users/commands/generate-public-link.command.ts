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
    // Générer un code court de 6 caractères
    let publicLinkCode;
    const user = await this.userRepository.findById(command.userId);
    publicLinkCode = user?.public_link_code;
    if (!user) {
      const code = crypto.randomBytes(3).toString('hex');

      // Mettre à jour l'utilisateur avec le nouveau code
      await this.userRepository.update(command.userId, {
        public_link_code: code,
      });
      publicLinkCode = code;
    }

    return `${process.env.FRONTEND_URL}/user/profile/public/${publicLinkCode}`;
  }
}
