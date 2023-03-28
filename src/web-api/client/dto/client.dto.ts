import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class ClientDto {
  @ApiProperty({
    description: 'The name of the client',
    example: 'Bob Esponja',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Client`s birthday date',
    example: '05/08/1985',
    type: String,
  })
  birthday: Date;

  @ApiProperty({
    description: 'Client`s gender',
    example: 'm',
    type: String,
  })
  gender: string;
  @ApiProperty({
    description: 'Client`s email',
    example: 'bobesponja@siricascudo.com',
    type: String,
  })
  email: string;
  @ApiProperty({
    description: 'Client`s phone',
    example: '99999999999',
    type: String,
  })
  phone: string;

  @ApiProperty({
    description: 'Client`s temporary password',
    example: 'hamburgerDeSiri*',
    type: String,
  })
  pass: string;

  @ApiHideProperty()
  id: string;

  @ApiHideProperty()
  idCompany: string;
}
