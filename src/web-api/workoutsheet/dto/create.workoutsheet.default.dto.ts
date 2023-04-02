import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateWorkoutsheetDefaultDto {
  @ApiProperty({ description: 'The title of the WorkoutSheetDefault' })
  @IsNotEmpty()
  title: string;

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
