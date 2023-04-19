import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Company } from 'src/models/company.model';
import { CompanyDTO } from '../dto/company.dto';
import { CreateCompanyMainInformationDto } from '../dto/request/create-company-main-information.dto';
import { UpdateCompanyMainInformationDto } from '../dto/request/update-company-main-information.dto';
import { CreatePosturalPatternDto } from '../dto/request/create-company-postural-pattern.dto';
import { UpdatePosturalPatternDto } from '../dto/request/update-company-postural-pattern.dto';
import { CompanyMainInformationDto } from '../dto/response/company-main-information.dto';

@Injectable()
export class CompanyRepository {
  constructor(private databaseService: DatabaseService) { }

  async findById(id: string): Promise<Company> {
    const [rows] = await this.databaseService.execute(
      'SELECT * FROM company WHERE id = ?',
      [id],
    );
    if (rows.length === 0) {
      return null;
    }
    const row = rows[0];
    const company = new Company(row);
    return company;
  }

  async findAll(): Promise<Company[]> {
    const rows = await this.databaseService.execute('SELECT * FROM company');
    const companies = rows.map((row) => new Company(row));
    return companies;
  }

  async create(company: CompanyDTO): Promise<void> {
    await this.databaseService.execute(
      'INSERT INTO company (name, about, photo, video, whatsapp, instagram) VALUES (?, ?, ?, ?, ?, ?)',
      [
        company.name,
        company.about,
        company.photo,
        company.video,
        company.whatsapp,
        company.instagram,
      ],
    );
  }

  async update(id: string, company: CompanyDTO): Promise<void> {
    await this.databaseService.execute(
      'UPDATE company SET name = ?, about = ?, photo = ?, video = ?, whatsapp = ?, instagram = ? WHERE id = ?',
      [
        company.name,
        company.about,
        company.photo,
        company.video,
        company.whatsapp,
        company.instagram,
        id,
      ],
    );
  }

  async deleteById(id: string): Promise<void> {
    await this.databaseService.execute(
      'UPDATE company SET isActive = 0 WHERE id = ?',
      [id],
    );
  }

  async findAllCompanyMainInformatin(idCompany: string): Promise<any> {
    try {
      return await this.databaseService.execute(`SELECT * FROM companyMainInformation WHERE idCompany = '${idCompany}' AND isActive = 1`);
    } catch (error) {
      throw error;
    }
  }

  async createCompanyMainInformation(item: CreateCompanyMainInformationDto): Promise<void> {
    try {
      const querie = `
      insert into 
        companyMainInformation 
          (title, description, idCompany)
        values (?, ?, ?);
      `;

      await this.databaseService.execute(querie, [
        item.title,
        item.description,
        item.idCompany,
      ]);
    } catch (error) {
      throw error;
    }
  }

  async deleteCompanyMainInformation(idCompanyMainInformation: string): Promise<void> {
    try {
      await this.databaseService.execute(
        'UPDATE companyMainInformation SET isActive = 0 WHERE id = ?',
        [idCompanyMainInformation],
      );
    } catch (error) {
      throw error;
    }
  }

  async updateCompanyMainInformation(item: UpdateCompanyMainInformationDto): Promise<void> {
    try {
      await this.databaseService.execute(
        'UPDATE companyMainInformation SET title = ?, description = ? WHERE id = ?',
        [
          item.title,
          item.description,
          item.idCompanyMainInformation,
        ],
      );
    } catch (error) {
      throw error;
    }
  }

  async findAllPosturalPatterns(idCompany: string): Promise<any> {
    try {
      const rows = await this.databaseService.execute(`SELECT * FROM posturalPattern WHERE idCompany = '${idCompany}' AND isActive = 1`);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async createPosturalPatterns(item: CreatePosturalPatternDto): Promise<void> {
    try {
      const querie = `
      insert into 
        posturalPattern (title, description, imageUrl, idCompany)
        values (?, ?, ?, ?);
      `;

      await this.databaseService.execute(querie, [
        item.title,
        item.description,
        item.imageUrl,
        item.idCompany,
      ]);
    } catch (error) {
      throw error;
    }
  }

  async updateCompanyPosturalPatterns(item: UpdatePosturalPatternDto): Promise<void> {
    try {
      await this.databaseService.execute(
        'UPDATE posturalPattern SET title = ?, description = ?, imageUrl = ? WHERE id = ?',
        [
          item.title,
          item.description,
          item.imageUrl,
          item.id,
        ],
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteCompanyPosturalPattern(id: string): Promise<void> {
    try {
      await this.databaseService.execute(
        'UPDATE posturalPattern SET isActive = 0 WHERE id = ?',
        [id],
      );
    } catch (error) {
      throw error;
    }
  }
}


