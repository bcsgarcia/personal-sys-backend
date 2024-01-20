import { ApiProperty } from '@nestjs/swagger';

export class CreateClientEvaluationDto {
  @ApiProperty({
    description: 'Id do cliente',
    example: '123456789',
    type: String,
  })
  idClient: string;

  @ApiProperty({
    description: 'Id da company',
    example: '123456789',
    type: String,
  })
  idCompany: string;
}
