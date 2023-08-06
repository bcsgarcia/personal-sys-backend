import { ApiProperty } from '@nestjs/swagger';
import { UpdateCompanyMainInformationDto } from './update-company-main-information.dto';

export class UpdateMainInformationListDto {
  @ApiProperty({
    description: 'Main information list to update',
    example: 'array of UpdateMainInformation',
    type: UpdateCompanyMainInformationDto,
  })
  mainInformationList: UpdateCompanyMainInformationDto[];

  @ApiProperty({
    description: 'Company ID.',
    example: '1',
    type: String,
  })
  idCompany: string;

  constructor(data: any) {
    this.mainInformationList = data.mainInformationList;
    this.idCompany = data.idCompany;
  }
}
