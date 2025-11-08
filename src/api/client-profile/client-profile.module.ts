import { Module } from '@nestjs/common';
import { ClientProfileService } from './service/client-profile.service';
import { ClientProfileController } from './controller/client-profile.controller';
import { DatabaseService } from 'src/database/database.service';
import { ClientRepository } from '../client/repository/client.repository';
import { ClientProfileRepository } from './repository/client-profile.repository';
import { SupabaseClient } from '@supabase/supabase-js';

@Module({
  controllers: [ClientProfileController],
  providers: [
    ClientProfileService,
    DatabaseService,
    {
      provide: ClientProfileRepository,
      useFactory: (
        databaseService: DatabaseService,
        supabase: SupabaseClient,
      ) => new ClientProfileRepository(databaseService, supabase),
      inject: [DatabaseService, 'SUPABASE_CLIENT'],
    },
    {
      provide: ClientRepository,
      useFactory: (
        databaseService: DatabaseService,
        supabase: SupabaseClient,
      ) => new ClientRepository(databaseService, supabase),
      inject: [DatabaseService, 'SUPABASE_CLIENT'],
    },
  ],
})
export class ClientProfileModule {}
