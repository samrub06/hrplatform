import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';

export enum FileType {
  CV = 'cv',
  PROFILE_PICTURE = 'profile-picture',
}

@Injectable()
export class AwsService {
  private s3Client: S3Client;
  private readonly bucketName = process.env.AWS_S3_BUCKET_NAME;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
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
}
