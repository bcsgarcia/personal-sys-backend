import { Injectable, UploadedFile } from '@nestjs/common';
import { FtpService } from '../../../common-services/ftp-service.service';
import * as path from 'path';
import { ThumbnailService } from '../../../common-services/thumbnail-service.service';

@Injectable()
export class UploadService {
  constructor(
    private readonly ftpService: FtpService,
    private readonly thumbnailService: ThumbnailService,
  ) {}

  async uploadFile(
    @UploadedFile() file,
    fileType: FileType,
    idMedia: string,
  ): Promise<void> {
    try {
      const fileBuffer = file.buffer;
      const fileName = `${idMedia}.${this.getExtension(file.originalname)}`;

      if (fileType == FileType.VIDEO) {
        // generate thumbnail
        const thumbnailBuffer = await this.thumbnailService.createThumbnail(
          file.buffer,
          file.mimetype,
        );

        // save thumbnail to ftp
        await this.ftpService.uploadFile(
          thumbnailBuffer,
          `${idMedia}.jpg`,
          'thumbnail',
        );
      }

      // save file to ftp
      await this.ftpService.uploadFile(
        fileBuffer,
        fileName,
        fileType.toString(),
      );
    } catch (error) {
      throw error;
    }
  }

  getExtension(fileName: string): string {
    const filename = fileName;
    const ext = path.extname(filename).slice(1);
    return ext; // 'mp3'
  }

  validateFile(@UploadedFile() file): FileType {
    const imageMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
    ];

    const videoMimeTypes = ['video/mp4', 'video/mpeg'];

    if (imageMimeTypes.includes(file.mimetype)) {
      return FileType.IMAGE;
    } else if (videoMimeTypes.includes(file.mimetype)) {
      return FileType.VIDEO;
    } else {
      return FileType.UNKNOWN;
    }
  }
}

export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
  UNKNOWN = 'unknown',
}
