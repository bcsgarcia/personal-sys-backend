import { Module } from '@nestjs/common';
import { WorkoutsheetService } from './workoutsheet.service';
import { WorkoutsheetController } from './workoutsheet.controller';

@Module({
  controllers: [WorkoutsheetController],
  providers: [WorkoutsheetService]
})
export class WorkoutsheetModule {}
