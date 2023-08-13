import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWorkoutMediaDto {
  @ApiProperty({
    description: 'Order of media',
    example: '1',
  })
  @IsNotEmpty()
  @IsNumber()
  mediaOrder: number;

  @ApiProperty({
    description: 'Media ID',
    example: '561253765736',
  })
  @IsNotEmpty()
  @IsString()
  idMedia: string;

  constructor(data: any) {
    this.mediaOrder = data.mediaOrder;
    this.idMedia = data.idMedia;
  }
}
