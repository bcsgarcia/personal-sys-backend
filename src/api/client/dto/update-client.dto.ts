import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class UpdateClientDto {
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
    example: '492044400000',
    type: Number,
  })
  @IsDate()
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
  phone: string;

  @ApiProperty({
    description: 'Client`s activate status',
    example: true,
    type: Boolean,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Client`s photo url',
    example: 'https://www.example.com/company-logo.png',
    type: String,
  })
  @IsString()
  photoUrl: string;

  constructor(data: any | null) {
    this.name = data.name;
    this.birthday = new Date(data.birthday);
    this.gender = data.gender;
    this.email = data.email;
    this.phone = data.phone;
    this.photoUrl = data.photoUrl;
    this.isActive = data.isActive;
  }
}
