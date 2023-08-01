import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteBeforeAndAfterImageDto {
  @ApiProperty({
    description: 'ID',
    example: ['123', '456'],
    type: [String],
  })
  @IsNotEmpty()
  @IsString({ each: true })
  idList: string[];

  @ApiHideProperty()
  idCompany: string;

  constructor(idList: string[], idCompany: string) {
    this.idList = idList;
    this.idCompany = idCompany;
  }
}
