import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AwsService } from '../../aws/aws.service';
import { OpenAIService } from '../../openai/openai.service';
import {
  RABBITMQ_EXCHANGES,
  RABBITMQ_ROUTING_KEYS,
} from '../../rabbitmq/rabbitmq.config';
import { RabbitMQService } from '../../rabbitmq/rabbitmq.service';
import { CVRepository } from '../cv.repository';

/* const EXCHANGES = {
  CV_EVENTS: 'cv.events',
};

const ROUTING_KEYS = {
  CV_UPLOADED: 'cv.upload.event',
  CV_EXTRACTED: 'cv.extracted.event',
  CV_PROCESSED: 'cv.processed.event',
  CV_COMPLETED: 'cv.completed.event',
}; */

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
  private readonly logger = new Logger(ExtractCVDataHandler.name);

  constructor(
    private readonly awsService: AwsService,
    private readonly cvRepository: CVRepository,
    private readonly rabbitMQService: RabbitMQService,
    private readonly openAIService: OpenAIService,
  ) {}

  async execute(command: ExtractCVDataCommand) {
    const { userId, fileName } = command;
    //let textractResponse;
    let cvData;

    try {
      /*  textractResponse = await this.awsService.extractCVData(userId, fileName); */
      //cvData = await this.openAIService.convertCVData(textractResponse);
      cvData = {
        personalInfo: {
          name: 'SAMUEL CHARBIT',
          email: 'charbit.samuel@gmail.com',
          phone: '0584046422',
          location: 'ISRAEL',
        },
        education: [
          {
            institution: 'ITC',
            degree: 'Full-stack Coding Bootcamp',
            fieldOfStudy:
              'HTML, CSS, JavaScript, React, Node.js, MongoDB, Express, Git, REST APIs',
            startDate: '2021-01-01',
            endDate: '2021-12-31',
            description: null,
          },
          {
            institution: 'NEOMA',
            degree: 'Master in Business Management',
            fieldOfStudy: null,
            startDate: '2019-01-01',
            endDate: '2021-01-01',
            description: null,
          },
          {
            institution: "Dumont D'urville, Toulon (FRA)",
            degree: 'Bachelor of Science in Mathematics',
            fieldOfStudy: null,
            startDate: '2017-01-01',
            endDate: '2019-01-01',
            description:
              'Preparation for national competitive entrance exams to leading French Grandes Écoles.',
          },
        ],
        skills: [
          {
            name: 'React',
            yearsOfExperience: 4,
          },
          {
            name: 'Node.js',
            yearsOfExperience: 4,
          },
          {
            name: 'SQL',
            yearsOfExperience: 0,
          },
          {
            name: 'PostgreSQL',
            yearsOfExperience: 0,
          },
          {
            name: 'AWS',
            yearsOfExperience: 0,
          },
          {
            name: 'MongoDB',
            yearsOfExperience: 0,
          },
          {
            name: 'Redux',
            yearsOfExperience: 0,
          },
          {
            name: 'Typescript',
            yearsOfExperience: 0,
          },
          {
            name: 'Jest',
            yearsOfExperience: 0,
          },
          {
            name: 'Docker',
            yearsOfExperience: 0,
          },
          {
            name: 'Swagger',
            yearsOfExperience: 0,
          },
          {
            name: 'Rest APIs',
            yearsOfExperience: 0,
          },
          {
            name: 'Git',
            yearsOfExperience: 0,
          },
        ],
      };
    } catch (error) {
      this.logger.error("Erreur lors de l'extraction:", error);
    }

    // Update CV with personal data 
    const cv = await this.cvRepository.updateByUserId(userId, {
      name: cvData.personalInfo?.name ?? 'John Smith',
      email: cvData.personalInfo?.email ?? 'john.smith@example.com',
      phone: cvData.personalInfo?.phone ?? '1234567890',
      location: cvData.personalInfo?.location ?? 'Paris, France',
    });

    // Create skills
    const skillPromises = cvData.skills?.map((skill) =>
      this.cvRepository.createSkill({
        cv_id: cv.id,
        name: skill.name,
        yearsOfExperience: skill.yearsOfExperience ?? 0,
      }),
    );

    // Create education
    const educationPromises = cvData.education?.map((edu) =>
      this.cvRepository.createEducation({
        cv_id: cv.id,
        institution: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        description: edu.description,
        startDate: edu.startDate,
        endDate: edu.endDate,
      }),
    );

    await Promise.all([...(skillPromises || []), ...(educationPromises || [])]);

    // Publish extracted data
    await this.rabbitMQService.publishToExchange(
      RABBITMQ_EXCHANGES.CV_EVENTS,
      RABBITMQ_ROUTING_KEYS.CV_EXTRACTED,
      {
        userId,
        cvId: cv.id,
        skills: cvData.skills,
        education: cvData.education,
        event: 'CV_DATA_EXTRACTED',
        timestamp: new Date().toISOString(),
      },
    );

    return {
      id: cv.id,
      ...cvData,
    };
  }
}
