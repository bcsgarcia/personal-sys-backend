import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { CompanyModel } from 'src/models/company.model';

export class CompanyDTO {
  @ApiHideProperty()
  id: string;

  @ApiProperty({
    description: 'The name of the company',
    example: 'Acme Inc.',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'A description of the company',
    example: 'We are a software development company',
    type: String,
  })
  about: string;

  @ApiProperty({
    description: 'A image or logo of the company',
    example: 'https://www.example.com/company-logo.png',
    type: String,
  })
  photoMediaId?: string;

  @ApiProperty({
    description: 'A demo video of the company',
    example: 'UUID',
    type: String,
  })
  firstVideoMediaId?: string;

  @ApiProperty({
    description: 'A demo video of the company',
    example: 'UUID',
    type: String,
  })
  secondVideoMediaId?: string;

  @ApiProperty({
    description: 'Whatsapp number contact of the company',
    example: '99999999999',
    type: String,
  })
  whatsapp?: string;

  @ApiProperty({
    description: 'Instagram profile name of company',
    example: '@instagram',
    type: String,
  })
  instagram?: string;

  constructor(company: CompanyModel) {
    this.id = company.id;
    this.name = company.name;
    this.about = company.about;
    this.photoMediaId = company.photoMediaId;
    this.firstVideoMediaId = company.firstVideoMediaId;
    this.secondVideoMediaId = company.secondVideoMediaId;
    this.whatsapp = company.whatsapp;
    this.instagram = company.instagram;
  }
}
