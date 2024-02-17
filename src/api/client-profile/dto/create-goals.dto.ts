import { ApiProperty } from '@nestjs/swagger';

export class CreateGoalsDto {
  @ApiProperty({
    description: 'Id da client',
    example: '123456789',
    type: String,
  })
  idClient: string;

  @ApiProperty({
    description: 'goal list',
    example: '123456789',
    type: [String],
  })
  goalList: string[];

  @ApiProperty({
    description: 'Id do company',
    example: '123456789',
    type: String,
  })
  idCompany: string;
}
