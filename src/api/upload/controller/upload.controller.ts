import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadService } from '../service/upload.service';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Body('idMedia') idMedia: string, @Body('mediaType') mediaType: string) {
    try {
      if (!this.uploadService.validateFile(file)) {
        return { status: 'error', message: 'Invalid file type' };
      }

      console.log(file);
      await this.uploadService.uploadFile(file, mediaType, idMedia);
      console.log('success');
      return { status: 'success' };
    } catch (e) {
      console.error('Upload failed', e);
      return { status: 'error' };
    }
  }
}
