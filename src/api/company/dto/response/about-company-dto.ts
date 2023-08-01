import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AboutCompanyDto {
  @ApiProperty({ description: 'URL of the company image' })
  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @ApiProperty({ description: 'Description of the company' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'URL of the company video' })
  @IsNotEmpty()
  @IsString()
  videoUrl: string;

  @ApiProperty({ description: 'URL of the company video' })
  @IsNotEmpty()
  @IsString()
  secondVideoUrl: string;
}
