import { ApiProperty } from '@nestjs/swagger';

export class ClientEvaluationPhotoDto {
  @ApiProperty({
    description: 'Id da media',
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
    description: 'Id do Cliente',
    example: '123456789',
    type: String,
  })
  idClient: string;

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

  @ApiProperty({
    description: 'Nome do arquivo',
    example: 'test.png',
    type: String,
  })
  fileName: string;

  constructor(data: any) {
    this.id = data.idClientEvaluationPhoto ?? '';
    this.url = data.url ?? '';
    this.idCompany = data.idCompany ?? '';
    this.idClient = data.idClient ?? '';
    this.idClientEvaluation = data.idClientEvaluation ?? '';
    this.fileName = data.fileName ?? '';
  }
}
