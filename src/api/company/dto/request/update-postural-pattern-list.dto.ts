import { ApiProperty } from '@nestjs/swagger';
import { UpdatePosturalPatternDto } from './update-company-postural-pattern.dto';

export class UpdatePosturalPatternListDto {
  @ApiProperty({
    description: 'Postural Pattern list to update',
    example: 'array of Postural Pattern',
    type: UpdatePosturalPatternDto,
  })
  posturalPatternList: UpdatePosturalPatternDto[];

  @ApiProperty({
    description: 'Company ID.',
    example: '1',
    type: String,
  })
  idCompany: string;

  constructor(data: any) {
    this.posturalPatternList = data.posturalPatternList;
    this.idCompany = data.idCompany;
  }
}
