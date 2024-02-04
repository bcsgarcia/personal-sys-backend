import { ApiProperty } from '@nestjs/swagger';
import { MusclePerimeterDto } from './muscle-perimeter.dto';
import { MuscoloskeletalChangesDto } from './muscoloskeletal-change.dto';

export class CreateClientEvaluationDto {
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

  @ApiProperty({
    description: 'Muscle Perimeter DTO',
    example: MusclePerimeterDto.mockInstance(),
    type: MusclePerimeterDto,
  })
  musclePerimeter: MusclePerimeterDto;

  @ApiProperty({
    description: 'Muscoloskeletal Change DTO',
    example: MuscoloskeletalChangesDto.mockInstance(),
    type: MuscoloskeletalChangesDto,
  })
  muscoloskeletalChanges: MuscoloskeletalChangesDto;
}
