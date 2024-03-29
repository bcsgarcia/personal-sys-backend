import { ApiProperty } from '@nestjs/swagger';
import { WorkoutModel } from 'src/models/workout.model';

export class GetAllWorkoutSheetDefaultDto {
  @ApiProperty({
    description: 'The ID of the workout sheet default.',
    example: '12345678-1234-1234-1234-123456789abc',
  })
  idWorkoutSheetDefault: string;

  @ApiProperty({
    description: 'The title of the workout sheet default.',
    example: 'Full Body Workout Sheet Default',
  })
  titleWorkoutSheetDefault: string;

  @ApiProperty({
    type: [WorkoutModel],
    description: 'The list of workouts for this workout sheet default.',
  })
  workouts: WorkoutModel[];

  constructor(data: any) {
    this.idWorkoutSheetDefault = data.idWorkoutSheetDefault;
    this.titleWorkoutSheetDefault = data.titleWorkoutSheetDefault;
    this.workouts = data.workouts;
  }
}
