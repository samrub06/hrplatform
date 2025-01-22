import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CVRepository } from '../cv.repository';

export class GetCVEducationQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetCVEducationQuery)
export class GetCVEducationHandler
  implements IQueryHandler<GetCVEducationQuery>
{
  constructor(private readonly cvRepository: CVRepository) {}

  async execute(query: GetCVEducationQuery) {
    const cv = await this.cvRepository.findByUserId(query.id);

    if (!cv) {
      throw new NotFoundException(`CV with ID ${query.id} not found`);
    }

    return {
      education: cv.education || [],
    };
  }
}
