import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CVRepository } from '../cv.repository';

export class GetCVSkillsQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetCVSkillsQuery)
export class GetCVSkillsHandler implements IQueryHandler<GetCVSkillsQuery> {
  constructor(private readonly cvRepository: CVRepository) {}

  async execute(query: GetCVSkillsQuery) {
    const cvSkills = await this.cvRepository.findSkillsByUserId(query.id);

    if (!cvSkills) {
      throw new NotFoundException(`CV with ID ${query.id} not found`);
    }

    return cvSkills.skills;
  }
}
