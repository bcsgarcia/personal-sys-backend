import { Module } from '@nestjs/common';
import { WorkoutService } from './service/workout.service';
import { WorkoutController } from './controller/workout.controller';
import { DatabaseService } from 'src/database/database.service';
import { WorkoutRepository } from './repository/workout.repository';
import { MediaRepository } from '../media/repository/media.repository';
import { SupabaseClient } from '@supabase/supabase-js';

@Module({
  controllers: [WorkoutController],
  providers: [
    WorkoutService,
    DatabaseService,
    {
      provide: WorkoutRepository,
      useFactory: (
        databaseService: DatabaseService,
        supabase: SupabaseClient,
      ) => new WorkoutRepository(databaseService, supabase),
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
  exports: [WorkoutService, WorkoutRepository],
})
export class WorkoutModule {}
