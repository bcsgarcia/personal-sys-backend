import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CompanyModel } from 'src/models/company.model';
import { CompanyDTO } from '../dto/company.dto';
import { CreateCompanyMainInformationDto } from '../dto/request/create-company-main-information.dto';
import { CreatePosturalPatternDto } from '../dto/request/create-company-postural-pattern.dto';
import { CreateBeforeAndAfterImageDto } from '../../screens/admin/introduction-page/dto/create-before-and-after-image.dto';
import { DeleteBeforeAndAfterImageDto } from '../../screens/admin/introduction-page/dto/delete-before-and-after-image.dto';
import { CreateTestimonyDto } from '../../screens/admin/introduction-page/dto/create-testimony.dto';
import { DeleteTestimonyDto } from '../../screens/admin/introduction-page/dto/delete-testimony.dto';
import { DeleteItemDto } from '../dto/request/delete-item.dto';
import { UpdateMainInformationListDto } from '../dto/request/update-main-information-list.dto';
import { UpdatePosturalPatternListDto } from '../dto/request/update-postural-pattern-list.dto';

@Injectable()
export class CompanyRepository {
  constructor(private databaseService: DatabaseService) {}

  async findById(id: string): Promise<any> {
    const row = await this.databaseService.execute(
      'SELECT * FROM company WHERE id = ?',
      [id],
    );

    return row[0];
  }

  async findByIdAdmin(id: string): Promise<any> {
    const row = await this.databaseService.execute(
      'SELECT id, name, about, photoMediaId, firstVideoMediaId, secondVideoMediaId, whatsapp, instagram FROM company WHERE id = ?',
      [id],
    );

    return row[0];
  }

  async findAll(): Promise<CompanyModel[]> {
    const rows = await this.databaseService.execute('SELECT * FROM company');
    const companies = rows.map((row) => new CompanyModel(row));
    return companies;
  }

  async create(company: CompanyDTO): Promise<void> {
    await this.databaseService.execute(
      'INSERT INTO company (name, about, photoMediaId, firstVideoMediaId, secondVideoMediaId, whatsapp, instagram) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        company.name,
        company.about,
        company.photoMediaId,
        company.firstVideoMediaId,
        company.secondVideoMediaId,
        company.whatsapp,
        company.instagram,
      ],
    );
  }

  async update(company: CompanyDTO): Promise<void> {
    await this.databaseService.execute(
      'UPDATE company SET  about = ?, photoMediaId = ?, firstVideoMediaId = ?, secondVideoMediaId = ?, whatsapp = ? WHERE id = ?',
      [
        company.about,
        company.photoMediaId,
        company.firstVideoMediaId,
        company.secondVideoMediaId,
        company.whatsapp,
        company.id,
      ],
    );
  }

  async deleteById(id: string): Promise<void> {
    await this.databaseService.execute(
      'UPDATE company SET isActive = 0 WHERE id = ?',
      [id],
    );
  }

  async findAllCompanyMainInformation(idCompany: string): Promise<any> {
    try {
      return await this.databaseService.execute(
        `SELECT *
         FROM companyMainInformation
         WHERE idCompany = '${idCompany}'
           AND isActive = 1
         ORDER BY infoOrder ASC`,
      );
    } catch (error) {
      throw error;
    }
  }

  async createCompanyMainInformation(
    item: CreateCompanyMainInformationDto,
  ): Promise<void> {
    try {
      const querie = `
          insert into companyMainInformation
              (title, description, idCompany, infoOrder)
          values (?, ?, ?, ?);
      `;

      await this.databaseService.execute(querie, [
        item.title,
        item.description,
        item.idCompany,
        item.infoOrder,
      ]);
    } catch (error) {
      throw error;
    }
  }

  async deleteCompanyMainInformation(
    deleteItemDto: DeleteItemDto,
  ): Promise<void> {
    try {
      const placeholders = deleteItemDto.idList.map(() => '?').join(',');

      const query = `delete
                     from companyMainInformation
                     WHERE id in (${placeholders})
                       and idCompany = ?`;

      await this.databaseService.execute(query, [
        ...deleteItemDto.idList,
        deleteItemDto.idCompany,
      ]);
    } catch (error) {
      throw error;
    }
  }

  async updateCompanyMainInformation(
    updateMainInformationList: UpdateMainInformationListDto,
  ): Promise<void> {
    try {
      await this.databaseService.transaction(async (conn) => {
        for (const item of updateMainInformationList.mainInformationList) {
          await this.databaseService.execute(
            'UPDATE companyMainInformation SET title = ?, description = ?, infoOrder = ? WHERE id = ? and idCompany = ?',
            [
              item.title,
              item.description,
              item.infoOrder,
              item.id,
              updateMainInformationList.idCompany,
            ],
            conn,
          );
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async findAllPosturalPatterns(idCompany: string): Promise<any> {
    try {
      const rows = await this.databaseService.execute(
        `SELECT *
         FROM posturalPattern pp
         WHERE pp.idCompany = '${idCompany}'
           AND pp.isActive = 1
         ORDER BY pp.posturalPatternOrder ASC`,
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async createPosturalPatterns(item: CreatePosturalPatternDto): Promise<void> {
    try {
      const query = `
          insert into posturalPattern (title, description, idMedia, idCompany, posturalPatternOrder)
          values (?, ?, ?, ?, ?);
      `;

      await this.databaseService.execute(query, [
        item.title,
        item.description,
        item.idMedia,
        item.idCompany,
        item.posturalPatternOrder,
      ]);
    } catch (error) {
      throw error;
    }
  }

  async updateCompanyPosturalPatterns(
    updatePosturalPatternList: UpdatePosturalPatternListDto,
  ): Promise<void> {
    try {
      await this.databaseService.transaction(async (conn) => {
        for (const item of updatePosturalPatternList.posturalPatternList) {
          await this.databaseService.execute(
            'UPDATE posturalPattern SET title = ?, description = ?, posturalPatternOrder = ?, idMedia = ? WHERE id = ? and idCompany = ?',
            [
              item.title,
              item.description,
              item.posturalPatternOrder,
              item.idMedia,
              item.id,
              updatePosturalPatternList.idCompany,
            ],
            conn,
          );
        }
      });
    } catch (error) {
      throw error;
    }

    // try {
    //   await this.databaseService.execute(
    //     'UPDATE posturalPattern SET title = ?, description = ?, imageUrl = ? WHERE id = ?',
    //     [item.title, item.description, item.imageUrl, item.id],
    //   );
    // } catch (error) {
    //   throw error;
    // }
  }

  async deleteCompanyPosturalPattern(
    deleteItemDto: DeleteItemDto,
  ): Promise<void> {
    try {
      const placeholders = deleteItemDto.idList.map(() => '?').join(',');

      const query = `delete
                     from posturalPattern
                     WHERE id in (${placeholders})
                       and idCompany = ?`;

      await this.databaseService.execute(query, [
        ...deleteItemDto.idList,
        deleteItemDto.idCompany,
      ]);
    } catch (error) {
      throw error;
    }
  }

  async getMeetAppScreen(idCompany: string): Promise<any> {
    try {
      const querie = `
          SELECT c.about             AS aboutCompany_description,
                 c.photo             AS aboutCompany_imageUrl,
                 c.firstVideoMediaId AS aboutCompany_videoUrl,
                 t.name              AS testimonies_name,
                 t.description       AS testimonies_description,
                 mt.url              AS testimonies_imageUrl,
                 m.url               AS photosBeforeAndAfter_imageUrl
          FROM company c
                   LEFT JOIN testimony t ON c.id = t.idCompany
                   LEFT JOIN photosBeforeAndAfter pba ON c.id = pba.idCompany
                   LEFT JOIN media mt on mt.id = t.idMedia
                   LEFT JOIN media m ON m.id = pba.idMedia
          WHERE c.id = '${idCompany}';`;

      return await this.databaseService.execute(querie);
    } catch (error) {
      throw error;
    }
  }

  async getTestimonyByIdCompany(idCompany: string): Promise<any> {
    const query = `
        SELECT t.name,
               t.description,
               m.url as imageUrl
        FROM testimony t
                 left join media m on t.idMedia = m.id
        WHERE t.idCompany = '${idCompany}'
    `;

    return await this.databaseService.execute(query);
  }

  async getTestimonyByIdCompanyAdmin(idCompany: string): Promise<any> {
    const query = `
        SELECT id,
               name,
               description,
               idMedia
        FROM testimony
        WHERE idCompany = '${idCompany}'
    `;

    return await this.databaseService.execute(query);
  }

  async getPhotosBeforeAndAfterByIdCompany(idCompany: string): Promise<any> {
    const query = `
        SELECT m.url as imageUrl
        FROM photosBeforeAndAfter b
                 left join media m on m.id = b.idMedia
        WHERE b.idCompany = '${idCompany}'
    `;

    return await this.databaseService.execute(query);
  }

  async getPhotosBeforeAndAfterByIdCompanyAdmin(
    idCompany: string,
  ): Promise<any> {
    const query = `
        SELECT b.id,
               b.idMedia
        FROM photosBeforeAndAfter b
        WHERE b.idCompany = '${idCompany}'
        order by b.lastUpdate
    `;

    return this.databaseService.execute(query);
  }

  async getAllPartnershipsByIdCompany(idCompany: string): Promise<any> {
    try {
      const querie = `
          SELECT p.id          as partnershipId,
                 p.idCompany   as partnershipIdCompany,
                 p.name        as partnershipName,
                 p.imageUrl    as partnershipImageUrl,
                 p.description as partnershipDescription,
                 p.contact     as partnershipContact,
                 p.email       as partnershipEmail,
                 p.instagram   as partnershipInstagram,
                 p.website     as partnershipWebsite,
                 p.address     as partnershipAddress,
                 pc.name       as partnershipCategoryName
          FROM partnership p
                   INNER JOIN partnershipCategory pc on p.idPartnershipCategory = pc.id

          WHERE p.idCompany = '${idCompany}'
            AND p.isActive = 1`;

      return await this.databaseService.execute(querie);
    } catch (error) {
      throw error;
    }
  }

  async createBeforeAndAfterImage(
    items: CreateBeforeAndAfterImageDto[],
    idCompany: string,
  ): Promise<void> {
    try {
      const params = items
        .map((item) => `('${item.idMedia}', '${idCompany}')`)
        .join(',');

      const query = `
          insert into photosBeforeAndAfter
              (idMedia, idCompany)
          values ${params};
      `;

      await this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }

  async deleteBeforeAndAfterImage(
    deleteBeforeAndAfterImageDto: DeleteBeforeAndAfterImageDto,
  ): Promise<void> {
    try {
      const placeholders = deleteBeforeAndAfterImageDto.idList
        .map(() => '?')
        .join(',');

      const query = `delete
                     from photosBeforeAndAfter
                     WHERE id in (${placeholders})
                       and idCompany = ?`;

      await this.databaseService.execute(query, [
        ...deleteBeforeAndAfterImageDto.idList,
        deleteBeforeAndAfterImageDto.idCompany,
      ]);
    } catch (error) {
      throw error;
    }
  }

  async createTestimony(
    items: CreateTestimonyDto[],
    idCompany: string,
  ): Promise<void> {
    try {
      const params = items
        .map(
          (item) =>
            `('${item.name}', '${item.description}', '${idCompany}', '${item.idMedia}')`,
        )
        .join(',');

      const query = `
          insert into testimony
              (name, description, idCompany, idMedia)
          values ${params};
      `;

      await this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }

  async deleteTestimony(deleteTestimonyDto: DeleteTestimonyDto): Promise<void> {
    try {
      const placeholders = deleteTestimonyDto.idList.map(() => '?').join(',');

      const query = `delete
                     from testimony
                     WHERE id in (${placeholders})
                       and idCompany = ? `;

      await this.databaseService.execute(query, [
        ...deleteTestimonyDto.idList,
        deleteTestimonyDto.idCompany,
      ]);
    } catch (error) {
      throw error;
    }
  }
}
