import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenModel {
  @ApiProperty({ description: 'The unique client ID' })
  clientId: string;

  @ApiProperty({ description: 'The client email address' })
  clientEmail: string;

  @ApiProperty({ description: 'The client authentication ID' })
  clientIdAuth: string;

  @ApiProperty({ description: 'The client company ID' })
  clientIdCompany: string;

  @ApiProperty({ description: 'The client name' })
  clientName: string;

  constructor(data: any) {
    this.clientId = data.user_metadata?.clientId;
    this.clientEmail = data.email;
    this.clientIdAuth = data.user_metadata?.clientIdAuth;
    this.clientIdCompany = data.user_metadata?.idCompany;
    this.clientName = data.user_metadata?.clientName;
  }
}
