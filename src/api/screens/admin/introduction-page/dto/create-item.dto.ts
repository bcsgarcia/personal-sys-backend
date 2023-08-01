import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { CreateBeforeAndAfterImageDto } from './create-before-and-after-image.dto';
import { CreateTestimonyDto } from './create-testimony.dto';

export class CreateItemDto {
  @ApiProperty({
    description: '',
    example: '',
    type: CreateBeforeAndAfterImageDto,
  })
  beforeAndAfterImageToInsert?: CreateBeforeAndAfterImageDto[];

  @ApiProperty({
    description: '',
    example: '',
    type: CreateTestimonyDto,
  })
  testimonyToInsert?: CreateTestimonyDto[];

  @ApiHideProperty()
  idCompany: string;

  constructor(
    beforeAndAfterImageToInsert: CreateBeforeAndAfterImageDto[],
    idCompany: string,
  ) {
    this.beforeAndAfterImageToInsert = beforeAndAfterImageToInsert;
    this.idCompany = idCompany;
  }
}
