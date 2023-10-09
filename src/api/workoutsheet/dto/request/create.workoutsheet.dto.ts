import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWorkoutsheetDto {
  @ApiProperty({
    description: 'ID',
    example: ['123', '456'],
    type: [String],
  })
  @IsNotEmpty()
  @IsString({ each: true })
  workoutsheetDefaultIdList: string[];

  @ApiHideProperty()
  idCompany: string;

  @ApiProperty({
    description: 'IDClient',
    example: '1',
    type: String,
  })
  @IsString()
  idClient: string;

  constructor(
    workoutsheetDefaultIdList: string[],
    idCompany: string,
    idClient: string,
  ) {
    this.workoutsheetDefaultIdList = workoutsheetDefaultIdList;
    this.idCompany = idCompany;
    this.idClient = idClient;
  }
}
