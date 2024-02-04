import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class MuscoloskeletalChangesDto {
  @ApiProperty({
    description: 'Id do MuscoloskeletalChanges',
    example: '123456789',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Id do clientEvaluation',
    example: '123456789',
    type: String,
  })
  idClientEvaluation: string;

  @ApiHideProperty()
  @ApiProperty({
    description: 'Id da company',
    example: '123456789',
    type: String,
  })
  idCompany: string;

  @ApiProperty({
    description: 'head',
    type: String,
  })
  head: string;

  @ApiProperty({
    description: 'spine',
    type: String,
  })
  spine: string;

  @ApiProperty({
    description: 'sholderBlades',
    type: String,
  })
  sholderBlades: string;

  @ApiProperty({
    description: 'shoulders',
    type: String,
  })
  shoulders: string;

  @ApiProperty({
    description: 'pelvis',
    type: String,
  })
  pelvis: string;

  @ApiProperty({
    description: 'knees',
    type: String,
  })
  knees: string;

  @ApiProperty({
    description: 'shins',
    type: String,
  })
  shins: string;

  @ApiProperty({
    description: 'feet',
    type: String,
  })
  feet: string;

  constructor(data: any) {
    this.id = data.idMucolosckeletalChanges ?? '';
    this.head = data.head ?? '';
    this.spine = data.spine ?? '';
    this.sholderBlades = data.sholderBlades ?? '';
    this.shoulders = data.shoulders ?? '';
    this.pelvis = data.pelvis ?? '';
    this.knees = data.knees ?? '';
    this.shins = data.shins ?? '';
    this.feet = data.feet ?? '';
  }

  // criar um metodo para retornar uma instancia com dados mockados
  static mockInstance(): MuscoloskeletalChangesDto {
    return new MuscoloskeletalChangesDto({
      head: 'head',
      spine: 'spine',
      sholderBlades: 'sholderBlades',
      shoulders: 'shoulders',
      pelvis: 'pelvis',
      knees: 'knees',
      shins: 'shins',
      feet: 'feet',
    });
  }
}
