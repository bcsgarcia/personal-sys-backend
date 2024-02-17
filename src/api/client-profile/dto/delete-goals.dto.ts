import { ApiProperty } from '@nestjs/swagger';

export class DeleteGoalsDto {
  @ApiProperty({
    description: 'Id da client',
    example: '123456789',
    type: String,
  })
  idClient: string;

  @ApiProperty({
    description: 'goal id list',
    example: '123456789',
    type: [String],
  })
  goalIdList: string[];

  @ApiProperty({
    description: 'Id do company',
    example: '123456789',
    type: String,
  })
  idCompany: string;
}
