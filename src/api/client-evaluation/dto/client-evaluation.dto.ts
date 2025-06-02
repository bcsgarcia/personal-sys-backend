import { ApiProperty } from '@nestjs/swagger';
import { MusclePerimeterDto } from './muscle-perimeter.dto';
import { MuscoloskeletalChangesDto } from './muscoloskeletal-change.dto';
import { ClientEvaluationPhotoDto } from './client-evaluation-photo.dto';

export class ClientEvaluationDto {
  @ApiProperty({
    description: 'Id do cliente',
    example: '123456789',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Client Evaluation start',
    type: Date,
  })
  date: Date;

  @ApiProperty({
    description: 'Id do cliente',
    example: '123456789',
    type: String,
  })
  idClient: string;

  @ApiProperty({
    description: 'Id da company',
    example: '123456789',
    type: String,
  })
  idCompany: string;

  musclePerimeter: MusclePerimeterDto;
  muscoloskeletalChanges: MuscoloskeletalChangesDto;
  clientEvaluationPhotoList: Array<ClientEvaluationPhotoDto>;

  constructor(data: any) {
    this.id = data.id ?? '';
    this.date = data.date;
    this.idClient = data.idClient;
  }
}
