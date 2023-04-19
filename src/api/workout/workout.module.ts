import { Module } from '@nestjs/common';
import { WorkoutService } from './service/workout.service';
import { WorkoutController } from './controller/workout.controller';
import { DatabaseService } from 'src/database/database.service';
import { WorkoutRepository } from './repository/workout.repository';

@Module({
  controllers: [WorkoutController],
  providers: [
    WorkoutService,
    DatabaseService,
    {
      provide: WorkoutRepository,
      useFactory: (databaseService: DatabaseService) =>
        new WorkoutRepository(databaseService),
      inject: [DatabaseService],
    },
  ],
})
export class WorkoutModule { }
