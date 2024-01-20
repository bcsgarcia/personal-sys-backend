import { ApiProperty } from '@nestjs/swagger';

export class MusclePerimeterDto {
  @ApiProperty({
    description: 'Id do MusclePerimeter',
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

  @ApiProperty({
    description: 'Id da company',
    example: '123456789',
    type: String,
  })
  idCompany: string;

  @ApiProperty({
    description: 'Peso',
    type: Number,
  })
  weight: number;

  @ApiProperty({
    description: 'Altura',
    type: Number,
  })
  height: number;

  @ApiProperty({
    description: 'Neck',
    type: Number,
  })
  neck: number;

  @ApiProperty({
    description: 'shoulder',
    type: Number,
  })
  shoulder: number;

  @ApiProperty({
    description: 'rightForearm',
    type: Number,
  })
  rightForearm: number;

  @ApiProperty({
    description: 'leftForearm',
    type: Number,
  })
  leftForearm: number;

  @ApiProperty({
    description: 'chest',
    type: Number,
  })
  chest: number;
  @ApiProperty({
    description: 'leftArm',
    type: Number,
  })
  leftArm: number;

  @ApiProperty({
    description: 'rightArm',
    type: Number,
  })
  rightArm: number;

  @ApiProperty({
    description: 'waist',
    type: Number,
  })
  waist: number;

  @ApiProperty({
    description: 'abdome',
    type: Number,
  })
  abdome: number;

  @ApiProperty({
    description: 'hip',
    type: Number,
  })
  hip: number;

  @ApiProperty({
    description: 'breeches',
    type: Number,
  })
  breeches: number;

  @ApiProperty({
    description: 'leftThigh',
    type: Number,
  })
  leftThigh: number;

  @ApiProperty({
    description: 'rightThigh',
    type: Number,
  })
  rightThigh: number;

  @ApiProperty({
    description: 'leftCalf',
    type: Number,
  })
  leftCalf: number;

  @ApiProperty({
    description: 'rightCalf',
    type: Number,
  })
  rightCalf: number;

  constructor(data: any) {
    this.id = data.idMusclePerimeter ?? '';
    // this.idCompany = data.idCompany;
    this.weight = data.weight;
    this.height = data.height;
    this.neck = data.neck;
    this.shoulder = data.shoulder;
    this.leftForearm = data.leftForearm;
    this.rightForearm = data.rightForearm;
    this.chest = data.chest;
    this.leftArm = data.leftArm;
    this.rightArm = data.rightArm;
    this.waist = data.waist;
    this.abdome = data.abdome;
    this.hip = data.hip;
    this.breeches = data.breeches;
    this.leftThigh = data.leftThigh;
    this.rightThigh = data.rightThigh;
    this.leftCalf = data.leftCalf;
    this.rightCalf = data.rightCalf;
  }
}
