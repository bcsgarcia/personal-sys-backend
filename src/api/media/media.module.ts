import { Module } from '@nestjs/common';

import { DatabaseService } from 'src/database/database.service';
import { MediaRepository } from './repository/media.repository';
import { MediaController } from './controller/media.controller';
import { MediaService } from './service/media.service';

@Module({
  controllers: [MediaController],
  providers: [
    MediaService,
    DatabaseService,
    {
      provide: MediaRepository,
      useFactory: (databaseService: DatabaseService) =>
        new MediaRepository(databaseService),
      inject: [DatabaseService],
    },
  ],
})
export class MediaModule {}
