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
        this.clientId = data.clientId;
        this.clientEmail = data.clientEmail;
        this.clientIdAuth = data.clientIdAuth;
        this.clientIdCompany = data.clientIdCompany;
        this.clientName = data.clientName;
    }
}
