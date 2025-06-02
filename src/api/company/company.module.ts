import { Module } from '@nestjs/common';
import { CompanyService } from './service/company.service';
import { CompanyController } from './controllers/company.controller';
import { DatabaseService } from 'src/database/database.service';
import { CompanyRepository } from './respository/company.repository';
import { MediaRepository } from '../media/repository/media.repository';
import { SupabaseClient } from '@supabase/supabase-js';

@Module({
  controllers: [CompanyController],
  providers: [
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
export class CompanyModule {}
