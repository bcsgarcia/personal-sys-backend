import { ApiProperty } from '@nestjs/swagger';

export class WorkoutMediaDto {
  @ApiProperty({ description: 'The id of the media' })
  id: string;

  @ApiProperty({ description: 'The title of the media' })
  title: string;

  @ApiProperty({ description: 'The format of the media' })
  format: string;

  @ApiProperty({ description: 'The type of the media' })
  type: string;

  @ApiProperty({ description: 'The url of the media' })
  url: string;

  @ApiProperty({ description: 'The thumbnailurl of the media' })
  thumbnailUrl: string;

  @ApiProperty({ description: 'The order of the media' })
  mediaOrder: number;

  constructor(data: any) {
    this.id = data.id || data.mediaId;
    this.title = data.title || data.mediaTitle;
    this.format = data.format || data.mediaFormat;
    this.type = data.type || data.mediaType;
    this.url = data.url || data.mediaUrl;
    this.mediaOrder = data.mediaOrder || 0;
    this.thumbnailUrl = data.thumbnailUrl || '';
  }
}
