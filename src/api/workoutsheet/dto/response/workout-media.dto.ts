import { ApiProperty } from '@nestjs/swagger';

export class WorkoutMediaDto {
    @ApiProperty({ description: 'The title of the media' })
    title: string;

    @ApiProperty({ description: 'The format of the media' })
    format: string;

    @ApiProperty({ description: 'The type of the media' })
    type: string;

    @ApiProperty({ description: 'The url of the media' })
    url: string;

    constructor(data: any) {
        this.title = data.title || data.mediaTitle;
        this.format = data.format || data.mediaFormat;
        this.type = data.type || data.mediaType;
        this.url = data.url || data.mediaUrl;
    }
}
