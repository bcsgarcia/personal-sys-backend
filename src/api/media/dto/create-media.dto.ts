import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MediaDto {
  @ApiHideProperty()
  id: string;

  @ApiHideProperty()
  idCompany: string;

  @ApiProperty({
    description: 'Name of media',
    example: 'Video/imagem do bob esponja',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Media URL',
    example: 'http://videodobobesponja.bob',
    type: String,
  })
  @IsString()
  url: string;

  @ApiProperty({
    description: 'Media file format',
    example: 'png',
    type: String,
  })
  @IsString()
  fileFormat: string;

  @ApiProperty({
    description: 'Media type',
    example: 'video',
    type: String,
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Media thumbnail if needed',
    example: 'http://thumnaildovideodobobesponja.bob',
    type: String,
  })
  @IsString()
  thumbnailUrl: string;

  constructor(data: any | null) {
    this.id = data.id;
    this.idCompany = data.idCompany;
    this.title = data.title;
    this.url = data.url;
    this.fileFormat = data.fileFormat;
    this.type = data.type;
    this.thumbnailUrl = data.thumbnailUrl;
  }
}
