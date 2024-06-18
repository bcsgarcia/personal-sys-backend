import { ApiProperty } from '@nestjs/swagger';

export class CreatePartnershipDto {
  @ApiProperty({
    description: 'The name of the partner',
    example: 'Nintendo',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'The contact number of the partner',
    example: '13999999999',
    type: String,
  })
  contact: string;

  @ApiProperty({
    description: 'The email of the partner',
    example: 'email@email.com',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'The Instagram of the partner',
    example: '@Nintendo',
    type: String,
  })
  instagram: string;

  @ApiProperty({
    description: 'The email of the partner',
    example: 'www.site.com.br',
    type: String,
  })
  website: string;

  @ApiProperty({
    description: 'The logo image url of the partner',
    example: 'https://www.site.com.br/image.jpg',
    type: String,
  })
  imageUrl: string;

  @ApiProperty({
    description: 'The description of the partner',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    type: String,
  })
  description: string;

  @ApiProperty({
    description: 'The fisical address of the partner',
    example: 'Rua dos Bobos, 0 - São Paulo - SP - 00000-000',
    type: String,
  })
  address: string;

  @ApiProperty({
    description: 'The id of the partnership category or if its new the category name',
    example: 'rfdsafadf-afdsafds-afdsafds-afdsafds',
    type: String,
  })
  idPartnershipCategory: string;

  idCompany: string;

  constructor(partner: any) {
    this.name = partner.name;
    this.contact = partner.contact ?? null;
    this.email = partner.email ?? null;
    this.instagram = partner.instagram ?? null;
    this.website = partner.website ?? null;
    this.imageUrl = partner.imageUrl ?? null;
    this.description = partner.description ?? null;
    this.address = partner.address ?? null;
    this.idPartnershipCategory = partner.idPartnershipCategory;
    this.idCompany = partner.idCompany ?? null;
  }
}
