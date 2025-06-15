import { Module } from '@nestjs/common';

import { DatabaseService } from 'src/database/database.service';
import { MediaRepository } from './repository/media.repository';
import { MediaController } from './controller/media.controller';
import { MediaService } from './service/media.service';
import { FtpService } from '../../common-services/ftp-service.service';
import { SupabaseClient } from '@supabase/supabase-js';

@Module({
  controllers: [MediaController],
  providers: [
    MediaService,
    DatabaseService,
    FtpService,
    {
      provide: MediaRepository,
      useFactory: (
        databaseService: DatabaseService,
        supabase: SupabaseClient,
      ) => new MediaRepository(databaseService, supabase),

      inject: [DatabaseService, 'SUPABASE_CLIENT'],
    },
  ],
})
export class MediaModule {}
