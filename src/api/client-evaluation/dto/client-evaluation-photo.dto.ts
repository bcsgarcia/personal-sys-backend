import { ApiProperty } from '@nestjs/swagger';

export class ClientEvaluationPhotoDto {
  @ApiProperty({
    description: 'Id do cliente',
    example: '123456789',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Id do clientEvaluation',
    example: '123456789',
    type: String,
  })
  idClientEvaluation: string;

  @ApiProperty({
    description: 'Url da photo',
    example: 'http://photo.com',
    type: String,
  })
  url: string;

  @ApiProperty({
    description: 'Id da company',
    example: '123456789',
    type: String,
  })
  idCompany: string;

  constructor(data: any) {
    this.id = data.idClientEvaluationPhoto ?? '';
    this.url = data.url;
  }
}
