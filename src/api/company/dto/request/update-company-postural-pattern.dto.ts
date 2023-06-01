import { ApiProperty } from '@nestjs/swagger';

export class UpdatePosturalPatternDto {
  @ApiProperty({
    description: 'The unique identifier of the postural pattern to update.',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'The updated title of the postural pattern.',
    example: 'Updated Forward Head Posture',
    type: String,
  })
  title: string;

  @ApiProperty({
    description: 'The updated description of the postural pattern.',
    example:
      'Updated Forward Head Posture is a common postural imbalance where the head is positioned forward relative to the shoulders.',
    type: String,
  })
  description: string;

  @ApiProperty({
    description:
      'The updated URL of the image representing the postural pattern.',
    example: 'https://example.com/images/updated-forward-head-posture.jpg',
    type: String,
  })
  imageUrl: string;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.imageUrl = data.imageUrl;
  }
}
