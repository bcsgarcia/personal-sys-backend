import { ApiProperty } from '@nestjs/swagger';
import { WorkoutResponseDto } from './workout-response.dto';

export class WorkoutSheetResponseDto {
  @ApiProperty({ description: 'The ID of the workout sheet' })
  id: number;

  @ApiProperty({ description: 'The date that was finished the workout sheet' })
  date: Date | null;

  @ApiProperty({ description: 'The name of the workout sheet' })
  name: string;

  @ApiProperty({ description: 'The order of the workoutsheet' })
  workoutsheetOrder: number;

  @ApiProperty({
    description:
      'An array of workout objects associated with the workout sheet',
    type: [WorkoutResponseDto],
  })
  workouts: WorkoutResponseDto[];

  constructor(data: any) {
    this.id = data.id;
    this.date = data.date === undefined ? null : new Date(data.date);
    this.name = data.name;
    this.workoutsheetOrder = data.workoutsheetOrder;
    this.workouts = data.workouts
      ? data.workouts.map((item: any) => new WorkoutResponseDto(item))
      : [];
  }
}
