import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateWorkoutsheetDefaultDto {
  @ApiProperty({ description: 'The title of the WorkoutSheetDefault' })
  @IsNotEmpty()
  title: string;

  @ApiHideProperty()
  idCompany: string;

  @ApiProperty({
    description: 'An array of workout UUIDs related to the worktouSheetDefault',
    type: 'array',
    items: { type: 'CreateWorkoutsheetDefaultWorkoutDto', format: 'String' },
  })
  @IsNotEmpty()
  workoutList: CreateWorkoutsheetDefaultWorkoutDto[];
}

export class CreateWorkoutsheetDefaultWorkoutDto {
  @ApiProperty({ description: 'Workout ID' })
  @IsNotEmpty()
  idWorkout: string;

  @ApiProperty({ description: 'Workout order' })
  @IsNotEmpty()
  workoutOrder: string;
}
