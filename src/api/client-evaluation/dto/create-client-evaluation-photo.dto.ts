import { ApiProperty } from '@nestjs/swagger';

export class CreateClientEvaluationPhotoDto {
  @ApiProperty({
    description: 'Id do cliente',
    example: '123456789',
    type: String,
  })
  idClient: string;

  @ApiProperty({
    description: 'Nome da imagem',
    example: 'photo.png',
    type: String,
  })
  fileName: string;

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
}
