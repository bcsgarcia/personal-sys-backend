import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateWorkoutsheetDefaultDto {
  @ApiProperty({ description: 'The id of the workoutSheetDefault to update' })
  @IsUUID()
  @IsNotEmpty()
  idWorkoutSheetDefault: string;

  @ApiHideProperty()
  idCompany: string;

  @ApiProperty({
    description: 'An array of workout UUIDs related to the worktouSheetDefault',
    type: 'array',
    items: { type: 'string', format: 'uuid' },
  })
  @IsNotEmpty()
  @IsUUID()
  workouts: string[];
}
