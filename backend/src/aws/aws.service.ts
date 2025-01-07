import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  AnalyzeDocumentCommand,
  TextractClient,
} from '@aws-sdk/client-textract';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { CVExtractedData } from '../cv/interfaces/cv-extracted-data.interface';

export enum FileType {
  CV = 'cv',
  PROFILE_PICTURE = 'profile-picture',
}

@Injectable()
export class AwsService {
  private s3Client: S3Client;
  private textractClient: TextractClient;
  private readonly bucketName = process.env.AWS_S3_BUCKET_NAME;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION_S3,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    this.textractClient = new TextractClient({
      region: process.env.AWS_REGION_S3,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  private getFilePath(
    userId: string,
    fileType: FileType,
    fileName: string,
  ): string {
    return `${userId}/${fileType}/${fileName}`;
  }

  /**
   * Génère une URL présignée pour l'upload d'un fichier.
   * @param fileName Nom du fichier.
   * @param userId ID de l'utilisateur.
   * @param fileType Type de fichier.
   * @param contentType Type MIME du fichier.
   * @returns URL présignée valide pour 1 heure (3600 secondes).
   */
  async generatePresignedUrl(
    fileName: string,
    userId: string,
    fileType: FileType,
    contentType: string,
  ): Promise<string> {
    const filePath = this.getFilePath(userId, fileType, fileName);

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: filePath,
      ContentType: contentType,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  /**
   * Génère une URL présignée pour le téléchargement d'un fichier.
   * @param fileName Nom du fichier.
   * @param userId ID de l'utilisateur.
   * @param fileType Type de fichier.
   * @returns URL présignée valide pour 1 heure (3600 secondes).
   */
  async generateDownloadUrl(
    fileName: string,
    userId: string,
    fileType: FileType,
  ): Promise<string> {
    const filePath = this.getFilePath(userId, fileType, fileName);

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: filePath,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  async extractCVData(
    userId: string,
    fileName: string,
  ): Promise<CVExtractedData> {
    // Récupérer le fichier depuis S3
    const filePath = this.getFilePath(userId, FileType.CV, fileName);
    const getObjectCommand = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: filePath,
    });

    const response = await this.s3Client.send(getObjectCommand);
    const fileBuffer = await this.streamToBuffer(response.Body);

    // Analyser le document avec Textract
    const analyzeCommand = new AnalyzeDocumentCommand({
      Document: {
        Bytes: fileBuffer,
      },
      FeatureTypes: ['FORMS', 'TABLES'],
    });

    const textractResponse = await this.textractClient.send(analyzeCommand);

    // Extraire et formater les données
    return this.parseTextractResponse(textractResponse);
  }

  private async streamToBuffer(stream: any): Promise<Buffer> {
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  private parseTextractResponse(response: any): CVExtractedData {
    const extractedData: CVExtractedData = {
      personalInfo: {},
      education: [],
      skills: [],
    };

    let currentSection = '';
    let educationEntry = null;

    // Parcourir les blocs pour extraire les informations
    for (const block of response.Blocks) {
      if (block.BlockType !== 'LINE' || !block.Text) continue;

      const text = block.Text.trim();

      // Détection des sections principales
      if (text === 'SKILLS') {
        currentSection = 'skills';
        continue;
      } else if (text === 'EDUCATION') {
        currentSection = 'education';
        continue;
      } else if (text === 'PROFESSIONAL EXPERIENCE') {
        currentSection = 'experience';
        continue;
      }

      // Extraction des informations personnelles
      if (!currentSection) {
        if (this.isEmail(text)) {
          extractedData.personalInfo.email = text;
        } else if (this.isPhoneNumber(text)) {
          extractedData.personalInfo.phone = text;
        } else if (this.isLocation(text)) {
          extractedData.personalInfo.location = text;
        } else if (!extractedData.personalInfo.name && this.isName(text)) {
          extractedData.personalInfo.name = text;
        }
        continue;
      }

      // Traitement selon la section
      switch (currentSection) {
        case 'skills':
          if (this.isSkill(text)) {
            extractedData.skills.push({
              name: text,
              /*               yearsOfExperience: 0, // À définir selon vos besoins
               */
            });
          }
          break;

        case 'education':
          if (this.isYear(text)) {
            if (educationEntry) {
              extractedData.education.push(educationEntry);
            }
            educationEntry = {
              institution: '',
              degree: '',
              fieldOfStudy: '',
              startDate: new Date(),
              endDate: new Date(),
              description: '',
            };
            const [startYear, endYear] = this.extractYears(text);
            educationEntry.startDate = new Date(startYear, 0);
            educationEntry.endDate = new Date(endYear, 0);
          } else if (educationEntry) {
            if (!educationEntry.degree) {
              educationEntry.degree = text;
            } else if (!educationEntry.institution) {
              educationEntry.institution = text;
            }
          }
          break;
      }
    }

    // Ajouter le dernier élément d'éducation s'il existe
    if (educationEntry) {
      extractedData.education.push(educationEntry);
    }

    return extractedData;
  }

  private isName(text: string): boolean {
    return /^[A-Z][a-z]+ [A-Z][a-z]+$/.test(text);
  }

  private isLocation(text: string): boolean {
    return /^[A-Za-z\s]+,\s[A-Za-z\s]+$/.test(text);
  }

  private isSkill(text: string): boolean {
    return (
      !this.isYear(text) && !this.isEmail(text) && !this.isPhoneNumber(text)
    );
  }

  private isYear(text: string): boolean {
    return /^\d{4}\s*-\s*(\d{4}|Present)$/.test(text);
  }

  private extractYears(text: string): [number, number] {
    const matches = text.match(/(\d{4})\s*-\s*(\d{4}|Present)/);
    if (!matches) return [0, 0];

    const startYear = parseInt(matches[1]);
    const endYear =
      matches[2] === 'Present'
        ? new Date().getFullYear()
        : parseInt(matches[2]);

    return [startYear, endYear];
  }

  private isEmail(text: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  }

  private isPhoneNumber(text: string): boolean {
    const phoneRegex =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(text);
  }
}
