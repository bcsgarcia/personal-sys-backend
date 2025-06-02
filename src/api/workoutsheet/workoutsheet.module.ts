import { Module } from '@nestjs/common';
import { WorkoutsheetController } from './controller/workoutsheet.controller';
import { DatabaseService } from 'src/database/database.service';
import { WorkoutsheetRepository } from './respository/workoutsheet.repository';
import { WorkoutModule } from '../workout/workout.module';
import { WorkoutsheetService } from './service/workoutsheet.service';
import { SupabaseClient } from '@supabase/supabase-js';

@Module({
  controllers: [WorkoutsheetController],
  imports: [WorkoutModule],
  providers: [
    DatabaseService,
    WorkoutsheetService,
    {
      provide: WorkoutsheetRepository,
      useFactory: (db: DatabaseService, supabase: SupabaseClient) => new WorkoutsheetRepository(db, supabase),
      inject: [DatabaseService, 'SUPABASE_CLIENT'],
    },
  ],
})
export class WorkoutsheetModule {}
