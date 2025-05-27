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

export enum FileKey {
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
    fileKey: FileKey,
    fileName: string,
  ): string {
    return `${userId}/${fileKey}/${fileName}`;
  }

  /**
   * Génère une URL présignée pour l'upload d'un fichier.
   * @param fileName Nom du fichier.
   * @param userId ID de l'utilisateur.
   * @param fileKey Type de fichier.
   * @param contentType Type MIME du fichier.
   * @returns URL présignée valide pour 1 heure (3600 secondes).
   */
  async generatePresignedUrl(
    fileName: string,
    userId: string,
    fileKey: FileKey,
    contentType: string,
  ): Promise<string> {
    const filePath = this.getFilePath(userId, fileKey, fileName);

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
    fileKey: FileKey,
  ): Promise<string> {
    const filePath = this.getFilePath(userId, fileKey, fileName);

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: filePath,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  private parseTextractResponse(response: any): string {
    // On ne garde que les blocs de type LINE avec du texte
    const textBlocks = response.Blocks.filter(
      (block) => block.BlockType === 'LINE' && block.Text,
    ).map((block) => block.Text.trim());

    // On joint tous les textes avec des sauts de ligne
    return textBlocks.join('\n');
  }

  async extractCVData(userId: string, fileName: string): Promise<string> {
    // Récupérer le fichier depuis S3
    const filePath = this.getFilePath(userId, FileKey.CV, fileName);
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
}
