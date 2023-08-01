import { Injectable } from '@nestjs/common';
// import { CreateIntroductionPageDto } from './dto/create-introduction-page.dto';
// import { UpdateIntroductionPageDto } from './dto/update-introduction-page.dto';
import { CompanyRepository } from 'src/api/company/respository/company.repository';
import { MediaRepository } from '../../../../media/repository/media.repository';
import { CreateBeforeAndAfterImageDto } from '../dto/create-before-and-after-image.dto';
import { DeleteBeforeAndAfterImageDto } from '../dto/delete-before-and-after-image.dto';
import { CreateTestimonyDto } from '../dto/create-testimony.dto';
import { DeleteTestimonyDto } from '../dto/delete-testimony.dto';

@Injectable()
export class IntroductionPageService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly mediaRepository: MediaRepository,
  ) {}

  async getCompanyInformation(idCompany: string): Promise<any> {
    try {
      const companyInfoFind = await this.companyRepository.findByIdAdmin(
        idCompany,
      );

      const companyInfo = {
        ...companyInfoFind,
        firstVideoMedia: null,
        secondVideoMedia: null,
        photoMedia: null,
      };

      const mediaList = await this.mediaRepository.findAll(idCompany);

      if (companyInfo.firstVideoMediaId != null) {
        companyInfo.firstVideoMedia = mediaList.find(
          (media) => media.id === companyInfo.firstVideoMediaId,
        );
      }

      if (companyInfo.secondVideoMediaId != null) {
        companyInfo.secondVideoMedia = mediaList.find(
          (media) => media.id === companyInfo.secondVideoMediaId,
        );
      }

      if (companyInfo.photoMediaId != null) {
        companyInfo.photoMedia = mediaList.find(
          (media) => media.id === companyInfo.photoMediaId,
        );
      }

      const testimonyList =
        await this.companyRepository.getTestimonyByIdCompanyAdmin(idCompany);

      const testimonyListWithMedia = testimonyList.map((item) => ({
        ...item,
        media: mediaList.find((media) => media.id === item.idMedia),
      }));

      const beforeAndAfterImageList =
        await this.companyRepository.getPhotosBeforeAndAfterByIdCompanyAdmin(
          idCompany,
        );

      const beforeAndAfterImageListWithMedia = beforeAndAfterImageList.map(
        (item) => ({
          ...item,
          media: mediaList.find((media) => media.id === item.idMedia),
        }),
      );

      return {
        companyInfo: companyInfo,
        testimony: testimonyListWithMedia,
        beforeAndAfterImageList: beforeAndAfterImageListWithMedia,
      };
    } catch (error) {
      throw error;
    }
  }

  async createBeforeAndAfterImage(
    createBeforeAndAfterImageDto: CreateBeforeAndAfterImageDto[],
    idCompany: string,
  ): Promise<any> {
    try {
      await this.companyRepository.createBeforeAndAfterImage(
        createBeforeAndAfterImageDto,
        idCompany,
      );

      return {
        status: 'success',
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteBeforeAndAfterImage(
    deleteBeforeAndAfter: DeleteBeforeAndAfterImageDto,
  ): Promise<any> {
    try {
      await this.companyRepository.deleteBeforeAndAfterImage(
        deleteBeforeAndAfter,
      );

      return {
        status: 'success',
      };
    } catch (error) {
      throw error;
    }
  }

  async createTestimony(
    createTestimonyDto: CreateTestimonyDto[],
    idCompany: string,
  ): Promise<any> {
    try {
      await this.companyRepository.createTestimony(
        createTestimonyDto,
        idCompany,
      );

      return {
        status: 'success',
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteTestimony(deleteTestimony: DeleteTestimonyDto): Promise<any> {
    try {
      await this.companyRepository.deleteTestimony(deleteTestimony);

      return {
        status: 'success',
      };
    } catch (error) {
      throw error;
    }
  }
}
