import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CVEducation } from 'src/models/cv-education.model';
import { CVSkill } from 'src/models/cv-skill.model';
import { CV } from 'src/models/cv.model';
import { PersonalInfo } from './interfaces/cv-extracted-data.interface';

@Injectable()
export class CVRepository {
  constructor(
    @InjectModel(CV)
    private cvModel: typeof CV,
    @InjectModel(CVSkill)
    private cvSkillModel: typeof CVSkill,
    @InjectModel(CVEducation)
    private cvEducationModel: typeof CVEducation,
  ) {}

  async create(
    data: PersonalInfo & { userId: string; fileName: string },
  ): Promise<CV> {
    return this.cvModel.create({
      ...data,
    });
  }

  async findByUserId(userId: string): Promise<CV> {
    return this.cvModel.findOne({
      where: { userId },
      include: [
        {
          model: CVSkill,
          as: 'skills',
        },
        {
          model: CVEducation,
          as: 'education',
        },
      ],
    });
  }

  async update(id: string, data: Partial<CV>): Promise<CV> {
    const cv = await this.cvModel.findByPk(id);
    if (!cv) return null;

    await cv.update(data);
    return cv.reload();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.cvModel.destroy({ where: { id } });
    return result > 0;
  }

  async createSkill(data: {
    cvId: string;
    name: string;
    level: number;
    yearsOfExperience: number;
  }): Promise<CVSkill> {
    return this.cvSkillModel.create(data);
  }

  async createEducation(data: {
    cvId: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date;
    endDate: Date;
    description: string;
  }): Promise<CVEducation> {
    return this.cvEducationModel.create(data);
  }
}
