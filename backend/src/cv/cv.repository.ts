import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CVEducation } from 'src/models/cv-education.model';
import { CVSkill } from 'src/models/cv-skill.model';
import { CV } from 'src/models/cv.model';
import { User } from 'src/models/user.model';
import { UpdateCVEducationRequestDto } from './commands/update-cv-education.request.command.dto';
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

  async create(data: PersonalInfo & { fileName: string }): Promise<CV> {
    return this.cvModel.create({
      ...data,
    });
  }

  async findSkillsByUserId(userId: string): Promise<CV> {
    return this.cvModel.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CVSkill,
          as: 'skills',
        },
      ],
    });
  }

  async findEducationByUserId(userId: string): Promise<CV> {
    return this.cvModel.findOne({
      where: { user_id: userId },
      include: [
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

  async updateSkills(cvId: string, skills: Partial<CVSkill>[]): Promise<void> {
    await this.cvSkillModel.destroy({ where: { cv_id: cvId } });
    await Promise.all(
      skills.map((skill) =>
        this.cvSkillModel.create({
          ...skill,
          cv_id: cvId,
        }),
      ),
    );
  }

  async updateEducation(
    cvId: string,
    education: UpdateCVEducationRequestDto[],
  ): Promise<void> {
    await this.cvEducationModel.destroy({ where: { cv_id: cvId } });
    await Promise.all(
      education.map((edu) =>
        this.cvEducationModel.create({
          ...edu,
          cv_id: cvId,
        }),
      ),
    );
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.cvModel.destroy({ where: { id } });
    return result > 0;
  }

  async createSkill(data: {
    cv_id: string;
    name: string;
    yearsOfExperience: number;
  }): Promise<CVSkill> {
    return this.cvSkillModel.create(data);
  }

  async createEducation(data: {
    cv_id: string;
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate?: Date;
    endDate?: Date;
    description?: string;
  }): Promise<CVEducation> {
    return this.cvEducationModel.create(data);
  }

  async findUsersBySkill(skillName: string): Promise<CV[]> {
    return this.cvModel.findAll({
      include: [
        {
          model: CVSkill,
          as: 'skills',
          where: {
            name: skillName,
          },
        },
        {
          model: User,
          as: 'user',
        },
      ],
    });
  }
}
