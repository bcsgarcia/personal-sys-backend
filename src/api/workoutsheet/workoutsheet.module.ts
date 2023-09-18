import { Module } from '@nestjs/common';
import { WorkoutsheetController } from './controller/workoutsheet.controller';
import { DatabaseService } from 'src/database/database.service';
import { WorkoutsheetRepository } from './respository/workoutsheet.repository';
import { WorkoutModule } from '../workout/workout.module';
import { WorkoutsheetService } from './service/workoutsheet.service';

@Module({
  controllers: [WorkoutsheetController],
  imports: [WorkoutModule],
  providers: [
    DatabaseService,
    WorkoutsheetService,
    {
      provide: WorkoutsheetRepository,
      useFactory: (db: DatabaseService) => new WorkoutsheetRepository(db),
      inject: [DatabaseService],
    },
  ],
})
export class WorkoutsheetModule {}
