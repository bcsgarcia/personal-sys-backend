import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateWorkoutMediaDto } from './create-workout-media.dto';

export class UpdateWorkoutClientDto {
  @ApiProperty({
    description: 'id of workoutClient',
    example: 'dhfhdfgsj-sjdajkdhsh-sdjdhjak',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Title of the workoutClient',
    example: 'Strength Training',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Subtitle of the workoutClient',
    example: 'Upper Body',
  })
  @IsNotEmpty()
  @IsString()
  subtitle: string;

  @ApiProperty({
    description: 'Description of the workoutClient',
    example: 'This workout focuses on building upper body strength.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: '',
    example: [],
  })
  workoutMediaList: CreateWorkoutMediaDto[];

  @ApiHideProperty()
  idCompany: string;

  @ApiProperty({
    description: 'ID Workout',
    example: '123',
  })
  @IsNotEmpty()
  @IsString()
  idWorkout: string;

  @ApiProperty({
    description: 'ID Workoutsheet',
    example: '123',
  })
  @IsNotEmpty()
  @IsString()
  idWorkoutsheet: string;

  @ApiProperty({
    description: 'Break Time',
    example: '10"',
  })
  @IsNotEmpty()
  @IsString()
  breakTime: string;

  @ApiProperty({
    description: 'Break Time',
    example: '10"',
  })
  @IsNotEmpty()
  @IsString()
  series: string;

  @ApiProperty({
    description: 'WorkoutClient order',
    example: '1"',
  })
  @IsNotEmpty()
  @IsNumber()
  workoutOrder: number;

  constructor(data: any) {
    this.title = data.title;
    this.subtitle = data.subTitle;
    this.description = data.description;
    this.idCompany = data.idCompany;
    this.workoutMediaList = data.workoutMediaList;
    this.idWorkout = data.idWorkout;
    this.breakTime = data.breakTime;
    this.series = data.series;
    this.idWorkoutsheet = data.idWorkoutsheet;
    this.workoutOrder = data.workoutOrder;
  }
}
