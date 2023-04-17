import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

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

    @ApiHideProperty()
    idCompany: string;

    constructor(
        title: string,
        description: string,
        idCompany: string
    ) {
        this.title = title;
        this.description = description;
        this.idCompany = idCompany;
    }
}
