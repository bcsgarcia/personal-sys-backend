import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
  @IsNumber()
  birthday: number;

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
    example: 'true',
    type: Boolean,
  })
  isActive: string;

  @ApiProperty({
    description: 'Client`s photo url',
    example: 'https://www.example.com/company-logo.png',
    type: String,
  })
  @IsString()
  photoUrl: string;
}
