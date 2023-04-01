import { Module } from '@nestjs/common';
import { WorkoutsheetService } from './service/workoutsheet.service';
import { WorkoutsheetController } from './controller/workoutsheet.controller';
import { DatabaseService } from 'src/database/database.service';
import { WorkoutsheetRepository } from './respository/workoutsheet.repository';

@Module({
  controllers: [WorkoutsheetController],
  providers: [
    WorkoutsheetService,
    DatabaseService,
    {
      provide: WorkoutsheetRepository,
      useFactory: (db: DatabaseService) => new WorkoutsheetRepository(db),
      inject: [DatabaseService],
    },
  ],
})
export class WorkoutsheetModule {}
