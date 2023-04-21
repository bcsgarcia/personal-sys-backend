import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TestimonyDto {
    @ApiProperty({ description: 'URL of the testimony image' })
    @IsNotEmpty()
    @IsString()
    imageUrl: string;

    @ApiProperty({ description: 'Name of the person who gave the testimony' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'Description of the testimony' })
    @IsNotEmpty()
    @IsString()
    description: string;

    constructor(data: any) {
        this.name = data.name;
        this.imageUrl = data.imageUrl;
        this.description = data.description;
    }
}