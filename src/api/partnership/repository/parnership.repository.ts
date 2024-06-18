import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreatePartnershipDto } from '../dto/create-partnership.dto';
import { UpdatePartnershipDto } from '../dto/update-partnership.dto';

@Injectable()
export class PartnershipRepository {
  constructor(private databaseService: DatabaseService) {}

  async create(partner: CreatePartnershipDto): Promise<string> {
    try {
      const createQuery = `INSERT INTO partnership (
          name,
          contact,
          email,
          instagram,
          website,
          imageUrl,
          description,
          address,
          idPartnershipCategory,
          idCompany)
          VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      await this.databaseService.execute(createQuery, [
        partner.name,
        partner.contact == undefined ? null : partner.contact,
        partner.email == undefined ? null : partner.email,
        partner.instagram == undefined ? null : partner.instagram,
        partner.website == undefined ? null : partner.website,
        partner.imageUrl == undefined ? null : partner.imageUrl,
        partner.description == undefined ? null : partner.description,
        partner.address == undefined ? null : partner.address,
        partner.idPartnershipCategory,
        partner.idCompany,
      ]);

      const query = `SELECT id
                      FROM partnership
                      WHERE name = ?
                      and idCompany = ?
                      and idPartnershipCategory = ?
                      ORDER BY lastUpdate DESC limit 1;`;

      const lastInsertedRows = await this.databaseService.execute(query, [
        partner.name,
        partner.idCompany,
        partner.idPartnershipCategory,
      ]);

      return lastInsertedRows[0].id;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async updateLogoUrl(partnershipId: string, imageUrl: string): Promise<void> {
    try {
      const createQuery = `update partnership set imageUrl = ? where id = ?`;

      await this.databaseService.execute(createQuery, [imageUrl, partnershipId]);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async update(updatePartnerDto: UpdatePartnershipDto): Promise<void> {
    try {
      await this.databaseService.execute(
        `
        UPDATE partnership SET
          name = ?,
          contact = ?,
          email = ?,
          instagram = ?,
          website = ?,
          description = ?,
          address = ?,
          idPartnershipCategory = ?
        WHERE id = ?`,
        [
          updatePartnerDto.name,
          updatePartnerDto.contact,
          updatePartnerDto.email,
          updatePartnerDto.instagram,
          updatePartnerDto.website,
          updatePartnerDto.description,
          updatePartnerDto.address,
          updatePartnerDto.idPartnershipCategory,
          updatePartnerDto.id,
        ],
      );
    } catch (error) {
      throw error;
    }
  }

  async findAll(idCompany: string): Promise<any> {
    try {
      const query = `
      SELECT p.id, p.name, p.email, p.instagram, p.website,
            p.imageUrl, p.description, p.address,
            c.name as category, upper(substr(trim(c.name), 1, 1))  as sortGroup
            FROM partnership p
            INNER JOIN partnershipCategory c on p.idPartnershipCategory = c.id
         WHERE p.idCompany = '${idCompany}' ORDER BY c.name, p.name`;

      return await this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }

  async findAllPartnershipCategory(idCompany: string): Promise<any> {
    try {
      const query = `
          SELECT id, name
          FROM partnershipCategory
          WHERE idCompany = '${idCompany}'
            AND isActive = 1
          ORDER BY name`;

      return await this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }

  async findCategoryByIdOrName(idCategoryOrName: string, idCompany: string): Promise<any> {
    try {
      const query = `SELECT *
                      FROM partnershipCategory
                      WHERE isActive = 1
                        AND idCompany = '${idCompany}'
                        AND (
                          id = '${idCategoryOrName}'
                          OR trim(lower(name)) = trim(lower('${idCategoryOrName}'))
                        )`;

      return await this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }

  async createCategory(categoryName: string, idCompany: string) {
    try {
      const createQuery = `INSERT INTO partnershipCategory (
          name,
          idCompany)
          VALUES
          (?, ?)`;

      await this.databaseService.execute(createQuery, [categoryName.trim(), idCompany]);

      const query = `SELECT *
                      FROM partnershipCategory
                      WHERE isActive = 1
                        AND idCompany = '${idCompany}'
                        AND name = TRIM('${categoryName}')`;

      return await this.databaseService.execute(query);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async delete(idPartner: string, idCompany: string) {
    try {
      const createQuery = `DELETE FROM partnership WHERE id = ? AND idCompany = ?`;

      return await this.databaseService.execute(createQuery, [idPartner, idCompany]);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
