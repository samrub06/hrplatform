import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AwsService } from 'src/aws/aws.service';
import {
  RABBITMQ_EXCHANGES,
  RABBITMQ_ROUTING_KEYS,
} from '../../rabbitmq/rabbitmq.config';
import { RabbitMQService } from '../../rabbitmq/rabbitmq.service';
import { CVRepository } from '../cv.repository';

export class ExtractCVDataCommand {
  constructor(
    public readonly userId: string,
    public readonly fileName: string,
  ) {}
}

@CommandHandler(ExtractCVDataCommand)
export class ExtractCVDataHandler
  implements ICommandHandler<ExtractCVDataCommand>
{
  constructor(
    private readonly awsService: AwsService,
    private readonly cvRepository: CVRepository,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async execute(command: ExtractCVDataCommand) {
    const { userId, fileName } = command;
    const textractResponse = await this.awsService.extractCVData(
      userId,
      fileName,
    );

    const cv = await this.cvRepository.create({
      userId,
      fileName,
      name: textractResponse.personalInfo.name,
      email: textractResponse.personalInfo.email,
      phone: textractResponse.personalInfo.phone,
      location: textractResponse.personalInfo.location,
    });

    const skillPromises = textractResponse.skills.map((skill) =>
      this.cvRepository.createSkill({
        cvId: cv.id,
        name: skill.name,
        level: this.calculateSkillLevel(skill.level),
        yearsOfExperience: this.extractYearsFromPeriod(skill.period),
      }),
    );

    const educationPromises = textractResponse.education.map((edu) =>
      this.cvRepository.createEducation({
        cvId: cv.id,
        institution: edu.institution,
        degree: edu.degree,
        fieldOfStudy: this.extractFieldOfStudy(edu.degree),
        startDate: this.extractStartDate(edu.period),
        endDate: this.extractEndDate(edu.period),
        description: edu.description,
      }),
    );

    await Promise.all([...skillPromises, ...educationPromises]);

    // Publier les données extraites pour le matching
    await this.rabbitMQService.publishToExchange(
      RABBITMQ_EXCHANGES.CV_EVENTS,
      RABBITMQ_ROUTING_KEYS.CV_EXTRACTED,
      {
        userId,
        cvId: cv.id,
        skills: textractResponse.skills,
        event: 'CV_DATA_EXTRACTED',
        timestamp: new Date().toISOString(),
      },
    );

    const fullCV = await this.cvRepository.findByUserId(userId);

    return {
      id: fullCV.id,
      ...textractResponse,
    };
  }

  private calculateSkillLevel(level: string): number {
    if (!level) return 0;
    const levelMap = {
      débutant: 1,
      intermédiaire: 3,
      avancé: 4,
      expert: 5,
    };
    return levelMap[level.toLowerCase()] || 0;
  }

  private extractYearsFromPeriod(period: string): number {
    if (!period) return 0;
    const matches = period.match(/(\d{4})\s*-\s*(\d{4}|Present)/i);
    if (!matches) return 0;

    const startYear = parseInt(matches[1]);
    const endYear =
      matches[2].toLowerCase() === 'present'
        ? new Date().getFullYear()
        : parseInt(matches[2]);

    return endYear - startYear;
  }

  private extractFieldOfStudy(degree: string): string {
    if (!degree) return '';
    const matches = degree.match(/in\s+(.+)$/i);
    return matches ? matches[1] : degree;
  }

  private extractStartDate(period: string): Date {
    if (!period) return null;
    const matches = period.match(/(\d{4})/);
    return matches ? new Date(parseInt(matches[1]), 0, 1) : null;
  }

  private extractEndDate(period: string): Date {
    if (!period) return null;
    const matches = period.match(/\d{4}\s*-\s*(\d{4}|Present)/i);
    if (!matches) return null;

    if (matches[1].toLowerCase() === 'present') {
      return new Date();
    }
    return new Date(parseInt(matches[1]), 11, 31);
  }
}
