import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateWorkoutDto {
  @ApiProperty({
    description: 'Title of the workout',
    example: 'Strength Training',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Subtitle of the workout',
    example: 'Upper Body',
  })
  @IsNotEmpty()
  @IsString()
  subTitle: string;

  @ApiProperty({
    description: 'Description of the workout',
    example: 'This workout focuses on building upper body strength.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'video url of the workout',
    example: 'https://www.videoworkout1.com/company',
  })
  @IsString()
  @IsOptional()
  videoUrl: string;

  @ApiProperty({
    description: 'imagem url of the workout',
    example: 'https://www.imageworkout1.com/company',
  })
  @IsString()
  @IsOptional()
  imageUrl: string;
}
