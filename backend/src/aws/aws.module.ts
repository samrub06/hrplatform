import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';

@Module({
  providers: [AwsService],
  exports: [AwsService], // Important pour rendre le service disponible aux autres modules
})
export class AwsModule {}
