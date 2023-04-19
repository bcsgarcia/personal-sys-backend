import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  isDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { convertTimestampToDate } from 'src/api/utils/timestamp-to-date';

export class ClientDto {
  @ApiHideProperty()
  id: string;

  @ApiHideProperty()
  idCompany: string;

  @ApiProperty({
    description: 'The name of the client',
    example: 'Bob Esponja',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Client`s birthday date',
    example: 'date',
    type: Date,
  })
  @IsNumber()
  birthday: Date;

  @ApiProperty({
    description: 'Client`s gender',
    example: 'm',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty({
    description: 'Client`s email',
    example: 'bobesponja@siricascudo.com',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Client`s phone',
    example: '99999999999',
    type: String,
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Client`s active status',
    example: 'true',
    type: Boolean,
  })
  @IsBoolean()
  isActive: string;

  @ApiProperty({
    description: 'Client`s photo url',
    example: 'https://www.example.com/company-logo.png',
    type: String,
  })
  @IsString()
  photoUrl: string;

  constructor(data: any | null) {
    this.id = data.id;
    this.idCompany = data.idCompany;
    this.name = data.name;
    this.birthday = new Date(data.birthday);
    this.gender = data.gender;
    this.email = data.email;
    this.phone = data.phone;
    this.photoUrl = data.photoUrl;
    this.isActive = data.isActive;
  }
}
