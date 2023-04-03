import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Company } from 'src/models/company.model';
import { CompanyDTO } from './dto/company.dto';

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
}
