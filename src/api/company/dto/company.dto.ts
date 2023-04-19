import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Company } from 'src/models/company.model';

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
  photo: string;

  @ApiProperty({
    description: 'A demo video of the company',
    example: 'https://www.example.com/company-video.mp4',
    type: String,
  })
  video: string;

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

  constructor(company: Company) {
    this.id = company.id;
    this.name = company.name;
    this.about = company.about;
    this.photo = company.photo;
    this.video = company.video;
    this.whatsapp = company.whatsapp;
    this.instagram = company.instagram;
  }
}
