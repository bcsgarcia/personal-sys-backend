import { Module } from '@nestjs/common';
import { ClientEvaluationService } from './service/client-evaluation.service';
import { ClientEvaluationController } from './controllers/client-evaluation.controller';
import { DatabaseService } from 'src/database/database.service';
import { ClientEvaluationRepository } from './repository/client-evaluation.repository';
import { FtpService } from 'src/common-services/ftp-service.service';
import { SupabaseClient } from '@supabase/supabase-js';

@Module({
  controllers: [ClientEvaluationController],
  providers: [
    ClientEvaluationService,
    DatabaseService,
    FtpService,
    {
      provide: ClientEvaluationRepository,
      useFactory: (databaseService: DatabaseService, supabase: SupabaseClient) =>
        new ClientEvaluationRepository(databaseService, supabase),
      inject: [DatabaseService, 'SUPABASE_CLIENT'],
    },
  ],
})
export class ClientEvaluationModule {}
