import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileType, UploadService } from '../service/upload.service';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Body('idMedia') idMedia: string) {
    try {
      const fileType = this.uploadService.validateFile(file);

      if (fileType === FileType.UNKNOWN) {
        return { status: 'error', message: 'Invalid file type' };
      }

      console.log(file);
      await this.uploadService.uploadFile(file, fileType, idMedia);
      // Retorne uma resposta ou faça algo com o arquivo aqui
      console.log('success');
      return { status: 'success' };
    } catch (e) {
      console.error('Upload failed', e);
      return { status: 'error' };
    }
  }
}
