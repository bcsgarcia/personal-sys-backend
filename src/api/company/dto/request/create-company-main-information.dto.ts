import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCompanyMainInformationDto {
  @ApiProperty({
    description: 'The title of the Company Main Informtation',
    example: 'Forma de Execução',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The description of the Company Main Informtation',
    example: 'Independente do exercicio, sempre devemos manter o padrao postural: ...',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Order of the information',
    example: '1',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  infoOrder: number;

  @ApiHideProperty()
  idCompany: string;

  constructor(title: string, description: string, idCompany: string) {
    this.title = title;
    this.description = description;
    this.idCompany = idCompany;
  }
}
