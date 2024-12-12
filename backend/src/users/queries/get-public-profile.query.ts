import { UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../user.repository';

export class GetPublicProfileQuery {
  constructor(public readonly code: string) {}
}

@QueryHandler(GetPublicProfileQuery)
export class GetPublicProfileHandler
  implements IQueryHandler<GetPublicProfileQuery>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetPublicProfileQuery) {
    const user = await this.userRepository.findByPublicToken(query.code);

    if (!user) {
      throw new UnauthorizedException('Invalid public profile code');
    }

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      skills: user.skills,
      desired_position: user.desired_position,
      profilePicture: user.profilePicture,
    };
  }
}
