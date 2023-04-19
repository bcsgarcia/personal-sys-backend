import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreatePosturalPatternDto {
    @ApiProperty({
        description: 'The title of the postural pattern.',
        example: 'Forward Head Posture',
        type: String,
    })
    title: string;

    @ApiProperty({
        description: 'The description of the postural pattern.',
        example: 'Forward Head Posture is a common postural imbalance where the head is positioned forward relative to the shoulders.',
        type: String,
    })
    description: string;

    @ApiProperty({
        description: 'The URL of the image representing the postural pattern.',
        example: 'https://example.com/images/forward-head-posture.jpg',
        type: String,
    })
    imageUrl: string;

    @ApiHideProperty()
    idCompany: string;

    constructor(
        data: any
    ) {
        this.title = data.title;
        this.description = data.description;
        this.imageUrl = data.imageUrl;
        this.idCompany = data.idCompany;
    }
}
