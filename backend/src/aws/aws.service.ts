import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';

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

  /**
   * Génère une URL présignée pour l'upload d'un fichier.
   * @param fileName Nom du fichier.
   * @param fileType Type MIME du fichier.
   * @returns URL présignée valide pour 1 heure (3600 secondes).
   */
  async generatePresignedUrl(
    fileName: string,
    folderUserId: string,
    fileType: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: `${folderUserId}/${fileName}`,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });

    return presignedUrl;
  }

  /**
   * Génère une URL présignée pour le téléchargement d'un fichier.
   * @param fileName Nom du fichier.
   * @param folderUserId ID du dossier utilisateur.
   * @returns URL présignée valide pour 1 heure (3600 secondes).
   */
  async generateDownloadPresignedUrl(
    fileName: string,
    folderUserId: string,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: `${folderUserId}/${fileName}`,
    });

    const presignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });

    return presignedUrl;
  }
}