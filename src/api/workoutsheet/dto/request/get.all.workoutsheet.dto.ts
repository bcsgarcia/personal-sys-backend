import { ApiProperty } from '@nestjs/swagger';

export class GetAllWorkoutSheetDto {
  @ApiProperty({
    description: 'The ID of the workout sheet.',
    example: '12345678-1234-1234-1234-123456789abc',
  })
  id: string;

  @ApiProperty({
    description: 'The title of the workout sheet default.',
    example: 'Full Body Workout Sheet Default',
  })
  title: string;

  @ApiProperty({
    description: 'Order of workoutsheet',
    example: '1',
  })
  workoutsheetOrder: number;

  // @ApiProperty({
  //   type: [Workout],
  //   description: 'The list of workouts for this workout sheet default.',
  // })
  // workouts: Workout[];

  constructor(data: any) {
    this.id = data.id;
    this.title = data.name;
    this.workoutsheetOrder = data.workoutsheetOrder;
  }
}
