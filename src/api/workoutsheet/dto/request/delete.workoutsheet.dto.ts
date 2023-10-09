import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteWorkoutsheetDto {
  @ApiProperty({
    description: 'ID',
    example: ['123', '456'],
    type: [String],
  })
  @IsNotEmpty()
  @IsString({ each: true })
  idList: string[];

  @ApiHideProperty()
  idCompany: string;

  @ApiProperty({
    description: 'IDClient',
    example: '1',
    type: String,
  })
  @IsString()
  idClient: string;

  constructor(idList: string[], idCompany: string, idClient: string) {
    this.idList = idList;
    this.idCompany = idCompany;
    this.idClient = idClient;
  }
}
