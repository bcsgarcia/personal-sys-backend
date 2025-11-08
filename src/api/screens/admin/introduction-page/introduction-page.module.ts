import { Module } from '@nestjs/common';

import { IntroductionPageService } from './service/introduction-page.service';
import { IntroductionPageController } from './controller/introduction-page.controller';
import { CompanyService } from 'src/api/company/service/company.service';
import { DatabaseService } from 'src/database/database.service';
import { CompanyRepository } from 'src/api/company/respository/company.repository';

import { MediaRepository } from '../../../media/repository/media.repository';
import { SupabaseClient } from '@supabase/supabase-js';

@Module({
  controllers: [IntroductionPageController],
  providers: [
    IntroductionPageService,
    CompanyService,
    DatabaseService,
    {
      provide: CompanyRepository,
      useFactory: (
        databaseService: DatabaseService,
        supabase: SupabaseClient,
      ) => new CompanyRepository(databaseService, supabase),
      inject: [DatabaseService, 'SUPABASE_CLIENT'],
    },
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
export class IntroductionPageModule {}
