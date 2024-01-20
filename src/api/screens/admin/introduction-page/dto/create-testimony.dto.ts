import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTestimonyDto {
  @ApiProperty({
    description: 'IdMedia',
    example: '',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  idMedia: string;

  @ApiProperty({
    description: 'description',
    example: '',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'name',
    example: '',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiHideProperty()
  idCompany: string;

  constructor(idMedia: string, description: string, name: string, idCompany: string) {
    this.idMedia = idMedia;
    this.description = description;
    this.name = name;
    this.idCompany = idCompany;
  }
}
