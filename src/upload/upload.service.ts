import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly S3Client = new S3Client({
    region: this.configService.get('AWS_S3_REGION')
  })

  constructor(private readonly configService: ConfigService) {}

  async upload(filename: string, file: Buffer) {
    return this.S3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.get('AWS_IMG_BUCKET'),
        Key: filename,
        Body: file
      })
    )
  }
}
