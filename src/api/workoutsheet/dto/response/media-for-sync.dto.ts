import { ApiProperty } from '@nestjs/swagger';

export class MediaForSyncDto {
    @ApiProperty({ description: 'The id of the media' })
    id: string;

    @ApiProperty({ description: 'The url of the media' })
    url: string;

    @ApiProperty({ description: 'The type of the media' })
    type: string;

    constructor(data: any) {
        this.id = data.id;
        this.url = data.url;
        this.type = data.type;
    }
}
