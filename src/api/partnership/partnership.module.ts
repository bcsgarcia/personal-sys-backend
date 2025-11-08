import { Module } from '@nestjs/common';
import { PartnershipService } from './service/partnership.service';
import { PartnershipController } from './controller/partnership.controller';
import { PartnershipRepository } from './repository/parnership.repository';
import { DatabaseService } from 'src/database/database.service';
import { FtpService } from 'src/common-services/ftp-service.service';
import { ImageService } from 'src/common-services/image-service.service';
import { SupabaseClient } from '@supabase/supabase-js';

@Module({
  controllers: [PartnershipController],
  exports: [PartnershipRepository],
  providers: [
    PartnershipService,
    DatabaseService,
    FtpService,
    ImageService,
    {
      provide: PartnershipRepository,
      useFactory: (
        databaseService: DatabaseService,
        supabase: SupabaseClient,
      ) => new PartnershipRepository(databaseService, supabase),
      inject: [DatabaseService, 'SUPABASE_CLIENT'],
    },
  ],
})
export class PartnershipModule {}
