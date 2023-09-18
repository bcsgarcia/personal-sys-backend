import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateWorkoutsheetDefaultDto {
  @ApiProperty({ description: 'The id of the workoutSheetDefault to update' })
  @IsUUID()
  @IsNotEmpty()
  idWorkoutSheetDefault: string;

  @ApiProperty({ description: 'The title of the WorkoutSheetDefault' })
  @IsNotEmpty()
  title: string;

  @ApiHideProperty()
  idCompany: string;

  @ApiProperty({
    description: 'An array of workout UUIDs related to the worktouSheetDefault',
    type: 'array',
    items: {
      type: 'UpdateWorkoutsheetDefaultWorkoutDto',
      format: 'UpdateWorkoutsheetDefaultWorkoutDto',
    },
  })
  @IsNotEmpty()
  workoutList: UpdateWorkoutsheetDefaultWorkoutDto[];
}

export class UpdateWorkoutsheetDefaultWorkoutDto {
  @ApiProperty({ description: 'Workout ID' })
  @IsNotEmpty()
  idWorkout: string;

  @ApiProperty({ description: 'Workout order' })
  @IsNotEmpty()
  order: string;
}
