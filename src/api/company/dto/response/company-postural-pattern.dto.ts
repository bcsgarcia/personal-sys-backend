import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class PosturalPatternDto {
  @ApiProperty({
    description: 'The unique identifier of the postural pattern.',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Indicates if the postural pattern is active.',
    example: true,
    type: Boolean,
  })
  isActive: boolean;

  @ApiProperty({
    description:
      'The date and time of the last update to the postural pattern.',
    example: '2023-04-17T00:00:00.000Z',
    type: String,
  })
  lastUpdate: Date;

  @ApiProperty({
    description: 'The title of the postural pattern.',
    example: 'Forward Head Posture',
    type: String,
  })
  title: string;

  @ApiProperty({
    description: 'The description of the postural pattern.',
    example:
      'Forward Head Posture is a common postural imbalance where the head is positioned forward relative to the shoulders.',
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

  constructor(data: any) {
    this.id = data.id;
    this.isActive = data.isActive;
    this.lastUpdate = data.lastUpdate;
    this.title = data.title;
    this.description = data.description;
    this.imageUrl = data.imageUrl;
    this.idCompany = data.idCompany;
  }
}
