import { ApiProperty } from '@nestjs/swagger';
import { WorkoutMediaDto } from './workout-media.dto';

export class WorkoutResponseDto {
  @ApiProperty({ description: 'The uid of the workout' })
  id: string;

  @ApiProperty({ description: 'The title of the workout' })
  title: string;

  @ApiProperty({ description: 'The subtitle of the workout' })
  subtitle: string;

  @ApiProperty({ description: 'A brief description of the workout' })
  description: string;

  @ApiProperty({ description: 'The URL of the workout image' })
  media: WorkoutMediaDto[];

  @ApiProperty({ description: 'The order of the workout in the workout sheet' })
  order: number;

  @ApiProperty({ description: 'The breaktime of the workout in seconds' })
  breaktime: number;

  @ApiProperty({ description: 'The recommended number of repetitions for the workout' })
  serie: string;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.subtitle = data.subtitle;
    this.description = data.description;
    this.media = data.media ? data.media.map((item: any) => new WorkoutMediaDto(item)) : [];
    this.order = data.order;
    this.breaktime = data.breaktime;
    this.serie = data.serie;
  }
}
