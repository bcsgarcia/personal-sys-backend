import { Injectable } from '@nestjs/common';
// import { CreateIntroductionPageDto } from './dto/create-introduction-page.dto';
// import { UpdateIntroductionPageDto } from './dto/update-introduction-page.dto';
import { CompanyRepository } from 'src/api/company/respository/company.repository';

@Injectable()
export class IntroductionPageService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async getCompanyInformation(idCompany: string): Promise<any> {
    const companyInfo = await this.companyRepository.findByIdAdmin(idCompany);
    const testimonyList =
      await this.companyRepository.getTestimonyByIdCompanyAdmin(idCompany);
    const beforeAndAfterImageList =
      await this.companyRepository.getPhotosBeforeAndAfterByIdCompanyAdmin(
        idCompany,
      );

    return {
      companyInfo: companyInfo,
      testimony: testimonyList,
      beforeAndAfterImageList: beforeAndAfterImageList,
    };
  }
}
