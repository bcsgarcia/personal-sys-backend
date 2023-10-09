import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateWorkoutMediaDto } from './create-workout-media.dto';

export class UpdateWorkoutDto {
  @ApiProperty({
    description: 'workout id',
    example: 'uyffudhfjkshfk',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

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
  subtitle: string;

  @ApiProperty({
    description: 'Description of the workout',
    example: 'This workout focuses on building upper body strength.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: '',
    example: [],
  })
  mediaList: CreateWorkoutMediaDto[];

  @ApiHideProperty()
  idCompany: string;
}
