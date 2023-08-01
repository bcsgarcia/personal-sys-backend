import { Injectable } from '@nestjs/common';

import { CompanyRepository } from '../respository/company.repository';
import { CompanyDTO } from '../dto/company.dto';
import { CompanyMainInformationDto } from '../dto/response/company-main-information.dto';
import { CreateCompanyMainInformationDto } from '../dto/request/create-company-main-information.dto';
import { UpdateCompanyMainInformationDto } from '../dto/request/update-company-main-information.dto';
import { CreatePosturalPatternDto } from '../dto/request/create-company-postural-pattern.dto';
import { PosturalPatternDto } from '../dto/response/company-postural-pattern.dto';
import { UpdatePosturalPatternDto } from '../dto/request/update-company-postural-pattern.dto';
import {
  GetMeetAppScreenResponseDto,
  TestimonyDto,
} from '../dto/response/response';
import { Company } from 'src/models/company.model';
import { PartnershipDTO } from '../dto/response/partnership-dto';
import { MediaRepository } from '../../media/repository/media.repository';
import { MediaDto } from '../../media/dto/create-media.dto';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly mediaRepository: MediaRepository,
  ) {}

  create(companyDto: CompanyDTO) {
    return this.companyRepository.create(companyDto);
  }

  async findAll() {
    const companyList = await this.companyRepository.findAll();

    return companyList.map((company) => new CompanyDTO(company));
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyRepository.findById(id);

    return new Company(company);
  }

  async update(updateCompanyDto: CompanyDTO) {
    try {
      await this.companyRepository.update(updateCompanyDto);
      return { status: 'success' };
    } catch (error) {
      throw error;
    }
  }

  remove(id: string) {
    return this.companyRepository.deleteById(id);
  }

  async createCompanyInformation(
    companyMainInformation: CreateCompanyMainInformationDto,
  ): Promise<void> {
    try {
      return await this.companyRepository.createCompanyMainInformation(
        companyMainInformation,
      );
    } catch (error) {
      throw error;
    }
  }

  async findAllCompanyMainInformation(
    idCompany: string,
  ): Promise<CompanyMainInformationDto[]> {
    try {
      const rows = await this.companyRepository.findAllCompanyMainInformation(
        idCompany,
      );
      const companyMainInformations = rows.map(
        (row) => new CompanyMainInformationDto(row),
      );
      return companyMainInformations;
    } catch (error) {
      throw error;
    }
  }

  async deleteCompanyMainInformation(id: string): Promise<void> {
    try {
      return await this.companyRepository.deleteCompanyMainInformation(id);
    } catch (error) {
      throw error;
    }
  }

  async updateCompanyMainInformation(
    updateCompanyMainInformation: UpdateCompanyMainInformationDto,
  ): Promise<void> {
    try {
      return await this.companyRepository.updateCompanyMainInformation(
        updateCompanyMainInformation,
      );
    } catch (error) {
      throw error;
    }
  }

  async createCompanyPosturalPattern(
    posturalPattern: CreatePosturalPatternDto,
  ): Promise<void> {
    try {
      return await this.companyRepository.createPosturalPatterns(
        posturalPattern,
      );
    } catch (error) {
      throw error;
    }
  }

  async findAllCompanyPosturalPattern(
    idCompany: string,
  ): Promise<PosturalPatternDto[]> {
    try {
      const rows = await this.companyRepository.findAllPosturalPatterns(
        idCompany,
      );

      return rows.map((row) => new PosturalPatternDto(row));
    } catch (error) {
      throw error;
    }
  }

  async deleteCompanyPosturalPattern(id: string): Promise<void> {
    try {
      return await this.companyRepository.deleteCompanyPosturalPattern(id);
    } catch (error) {
      throw error;
    }
  }

  async updateCompanyPosturalPattern(
    posturalPattern: UpdatePosturalPatternDto,
  ): Promise<void> {
    try {
      return await this.companyRepository.updateCompanyPosturalPatterns(
        posturalPattern,
      );
    } catch (error) {
      throw error;
    }
  }

  async getMeetAppScreen(
    idCompany: string,
  ): Promise<GetMeetAppScreenResponseDto> {
    try {
      const response: GetMeetAppScreenResponseDto = {
        aboutCompany: {
          imageUrl: '',
          description: '',
          videoUrl: '',
          secondVideoUrl: '',
        },
        testemonies: [],
        photosBeforeAndAfter: [],
      };

      const company = await this.findOne(idCompany);

      const rowsTestimonies =
        await this.companyRepository.getTestimonyByIdCompany(idCompany);

      const rowsPhotos =
        await this.companyRepository.getPhotosBeforeAndAfterByIdCompany(
          idCompany,
        );

      if (company.photoMediaId != null && company.photoMediaId != '') {
        const photoMedia = await this.mediaRepository.findById(
          company.photoMediaId,
        );

        response.aboutCompany.imageUrl = photoMedia.url;
      }

      response.aboutCompany.description = company.about;

      if (company.firstVideoMediaId != null) {
        const row = await this.mediaRepository.findById(
          company.firstVideoMediaId,
        );
        const firstVideoMediaDto = new MediaDto(row);
        response.aboutCompany.videoUrl = firstVideoMediaDto.url;
      }

      if (company.secondVideoMediaId != null) {
        const row = await this.mediaRepository.findById(
          company.secondVideoMediaId,
        );
        const secondVideoMediaDto = new MediaDto(row);
        response.aboutCompany.secondVideoUrl = secondVideoMediaDto.url;
      }

      response.testemonies = rowsTestimonies.map(
        (item) => new TestimonyDto(item),
      );

      response.photosBeforeAndAfter = rowsPhotos.map((item) => item);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async findAllPartnershipByIdCompany(
    idCompany: string,
  ): Promise<PartnershipDTO[]> {
    try {
      const rows = await this.companyRepository.getAllPartnershipsByIdCompany(
        idCompany,
      );

      return rows.map((item) => new PartnershipDTO(item));
    } catch (error) {
      throw error;
    }
  }
}

// TODOS:
// getAllCompanyMainInformation DONE
// createCompanyMainInformation DONE
// deleteCompanyMainInformation DONE
// updateCompanyMainInformation

// getAllPosturalPatterns DONE
// createPosturalPatterns DONE
// updatePosturalPatterns DONE
// deletePosturalPatterns
