import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Auth } from 'src/models/auth.model';

export class AuthDto {
  @ApiHideProperty()
  id: string;

  @ApiProperty({
    description: 'Identification of company',
    example: 'Acme Inc.',
    type: String,
  })
  idCompany: string;

  @ApiProperty({
    description: 'Login',
    example: '',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'Password',
    example: '',
    type: String,
  })
  pass: string;

  @ApiHideProperty()
  isAdmin: boolean;

  constructor(auth: Auth) {
    this.id = auth.id;
    this.idCompany = auth.idCompany;
    this.email = auth.email;
    this.pass = auth.pass;
    this.isAdmin = auth.isAdmin;
  }
}
