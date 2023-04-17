import { Injectable } from '@nestjs/common';

import { CompanyRepository } from '../respository/company.repository';
import { CompanyDTO } from '../dto/company.dto';
import { CompanyMainInformationDto } from '../dto/response/company-main-information.dto';
import { CreateCompanyMainInformationDto } from '../dto/request/create-company-main-information.dto';
import { UpdateCompanyMainInformationDto } from '../dto/request/update-company-main-information.dto';
import { CreatePosturalPatternDto } from '../dto/request/create-company-postural-pattern.dto';
import { PosturalPatternDto } from '../dto/response/company-postural-pattern.dto';
import { UpdatePosturalPatternDto } from '../dto/request/update-company-postural-pattern.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) { }

  create(companyDto: CompanyDTO) {
    return this.companyRepository.create(companyDto);
  }

  async findAll() {
    const companyList = await this.companyRepository.findAll();

    return companyList.map((company) => new CompanyDTO(company));
  }

  findOne(id: string) {
    return this.companyRepository.findById(id);
  }

  update(id: string, updateCompanyDto: CompanyDTO) {
    return this.companyRepository.update(id, updateCompanyDto);
  }

  remove(id: string) {
    return this.companyRepository.deleteById(id);
  }

  async createCompanyInformation(companyMainInformation: CreateCompanyMainInformationDto): Promise<void> {
    try {
      return await this.companyRepository.createCompanyMainInformation(companyMainInformation);
    } catch (error) {
      throw error;
    }
  }

  async findAllCompanyMainInformation(idCompany: string): Promise<CompanyMainInformationDto[]> {
    try {
      const rows = await this.companyRepository.findAllCompanyMainInformatin(idCompany);
      const companyMainInformations = rows.map((row) => new CompanyMainInformationDto(row));
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

  async updateCompanyMainInformation(updateCompanyMainInformation: UpdateCompanyMainInformationDto): Promise<void> {
    try {
      return await this.companyRepository.updateCompanyMainInformation(updateCompanyMainInformation);
    } catch (error) {
      throw error;
    }
  }


  async createCompanyPosturalPattern(posturalPattern: CreatePosturalPatternDto): Promise<void> {
    try {
      return await this.companyRepository.createPosturalPatterns(posturalPattern);
    } catch (error) {
      throw error;
    }
  }

  async findAllCompanyPosturalPattern(idCompany: string): Promise<PosturalPatternDto[]> {
    try {

      const rows = await this.companyRepository.findAllPosturalPatterns(idCompany);

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

  async updateCompanyPosturalPattern(posturalPattern: UpdatePosturalPatternDto): Promise<void> {
    try {
      return await this.companyRepository.updateCompanyPosturalPatterns(posturalPattern);
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
