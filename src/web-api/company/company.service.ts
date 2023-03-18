import { Injectable } from '@nestjs/common';

import { CompanyRepository } from './company.repository';
import { CompanyDTO } from './dto/company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

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
}
