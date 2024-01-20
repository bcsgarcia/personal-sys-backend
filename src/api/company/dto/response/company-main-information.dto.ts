import { ApiProperty } from '@nestjs/swagger';

export class CompanyMainInformationDto {
  @ApiProperty({
    description: 'The unique identifier of the company main information.',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Indicates if the company main information is active.',
    example: true,
    type: Boolean,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'The date and time of the last update to the company main information.',
    example: '2023-04-17T00:00:00.000Z',
    type: String,
  })
  lastUpdate: Date;

  @ApiProperty({
    description: 'The title of the company main information.',
    example: 'Company ABC',
    type: String,
  })
  title: string;

  @ApiProperty({
    description: 'The description of the company main information.',
    example: 'Company ABC is a leading provider of software solutions.',
    type: String,
  })
  description: string;

  @ApiProperty({
    description: 'Order of information',
    example: '1',
    type: Number,
  })
  infoOrder: number;

  @ApiProperty({
    description: 'The unique identifier of the associated company.',
    example: '987e6543-e21a-98b7-c654-547896325000',
    type: String,
  })
  idCompany: string;

  constructor(data: any) {
    this.id = data.id;
    this.isActive = data.isActive;
    this.lastUpdate = data.lastUpdate;
    this.title = data.title;
    this.description = data.description;
    this.idCompany = data.idCompany;
    this.infoOrder = data.infoOrder;
  }
}
