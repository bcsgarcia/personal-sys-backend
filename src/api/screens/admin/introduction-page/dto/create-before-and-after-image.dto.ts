import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBeforeAndAfterImageDto {
  @ApiProperty({
    description: 'IdMedia',
    example: '',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  idMedia: string;

  @ApiHideProperty()
  idCompany: string;

  constructor(idMedia: string, idCompany: string) {
    this.idMedia = idMedia;
    this.idCompany = idCompany;
  }
}
