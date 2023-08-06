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
    example:
      'Forward Head Posture is a common postural imbalance where the head is positioned forward relative to the shoulders.',
    type: String,
  })
  description: string;

  @ApiProperty({
    description: 'Id media.',
    example: '1234',
    type: String,
  })
  idMedia: string;

  @ApiProperty({
    description: 'Order.',
    example: '1',
    type: Number,
  })
  posturalPatternOrder: number;

  @ApiHideProperty()
  idCompany: string;

  constructor(data: any) {
    this.title = data.title;
    this.description = data.description;
    this.idMedia = data.idMedia;
    this.idCompany = data.idCompany;
  }
}
