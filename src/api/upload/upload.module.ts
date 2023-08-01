import { Module } from '@nestjs/common';
import { UploadService } from './service/upload.service';
import { UploadController } from './controller/upload.controller';
import { FtpService } from '../../common-services/ftp-service.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, FtpService],
})
export class UploadModule {}
