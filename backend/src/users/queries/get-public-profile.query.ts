import { UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../user.repository';

interface PublicProfileResponse {
  id: string;
  first_name: string;
  last_name: string;
  skills: any[];
  desired_position?: string;
  profilePicture?: string;
  cv?: string;
  phone_number?: string;
  github_link?: string;
  linkedin_link?: string;
  salary_expectation?: string;
}

export class GetPublicProfileQuery {
  constructor(public readonly code: string) {}
}

@QueryHandler(GetPublicProfileQuery)
export class GetPublicProfileHandler
  implements IQueryHandler<GetPublicProfileQuery>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetPublicProfileQuery): Promise<PublicProfileResponse> {
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
      cv: user.cv,
      phone_number: user.phone_number,
      github_link: user.github_link,
      linkedin_link: user.linkedin_link,
      salary_expectation: user.salary_expectation,
    };
  }
}
