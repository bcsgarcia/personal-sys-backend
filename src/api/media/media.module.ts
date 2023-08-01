import { Module } from '@nestjs/common';

import { DatabaseService } from 'src/database/database.service';
import { MediaRepository } from './repository/media.repository';
import { MediaController } from './controller/media.controller';
import { MediaService } from './service/media.service';
import { FtpService } from '../../common-services/ftp-service.service';

@Module({
  controllers: [MediaController],
  providers: [
    MediaService,
    DatabaseService,
    FtpService,
    {
      provide: MediaRepository,
      useFactory: (databaseService: DatabaseService) =>
        new MediaRepository(databaseService),
      inject: [DatabaseService],
    },
  ],
})
export class MediaModule {}
