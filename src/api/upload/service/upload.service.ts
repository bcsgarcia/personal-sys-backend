import { Injectable, UploadedFile } from '@nestjs/common';
import { FtpService } from '../../../common-services/ftp-service.service';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor(private readonly ftpService: FtpService) {}

  async uploadFile(@UploadedFile() file, mediaType: string, idMedia: string): Promise<void> {
    try {
      const fileBuffer = file.buffer;
      const fileName = `${idMedia}.${this.getExtension(file.originalname)}`;

      await this.ftpService.uploadFile(fileBuffer, fileName, mediaType);
    } catch (error) {
      throw error;
    }
  }

  getExtension(fileName: string): string {
    const filename = fileName;
    const ext = path.extname(filename).slice(1);
    return ext.toLowerCase();
  }

  validateFile(@UploadedFile() file): boolean {
    const imageMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];

    const videoMimeTypes = ['video/mp4', 'video/mpeg'];

    if (imageMimeTypes.includes(file.mimetype)) {
      return true;
    } else if (videoMimeTypes.includes(file.mimetype)) {
      return true;
    } else {
      return false;
    }
  }
}

export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
  THUMBNAIL = 'thumbnail',
  UNKNOWN = 'unknown',
}
