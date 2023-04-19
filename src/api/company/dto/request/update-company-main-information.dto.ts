import { ApiProperty } from '@nestjs/swagger';

export class UpdateCompanyMainInformationDto {
    @ApiProperty({
        description: 'The unique identifier of the company main information to update.',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    idCompanyMainInformation: string;

    @ApiProperty({
        description: 'The updated title of the company main information.',
        example: 'Updated Company ABC',
        type: String,
    })
    title: string;

    @ApiProperty({
        description: 'The updated description of the company main information.',
        example: 'Updated Company ABC is a leading provider of software solutions.',
        type: String,
    })
    description: string;

    constructor(
        data: any
    ) {
        this.idCompanyMainInformation = data.idCompanyMainInformation;
        this.title = data.title;
        this.description = data.description;
    }
}
