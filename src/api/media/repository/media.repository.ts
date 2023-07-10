import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { MediaDto } from '../dto/create-media.dto';

@Injectable()
export class MediaRepository {
  constructor(private databaseService: DatabaseService) {}

  async findById(id: string): Promise<any> {
    const row = await this.databaseService.execute(
      'SELECT * FROM media WHERE id = ?',
      [id],
    );

    return row[0];
  }

  async findAll(idCompany: string): Promise<any> {
    const rows = await this.databaseService.execute(
      'SELECT * FROM media where idCompany = ? ',
      [idCompany],
    );
    // const companies = rows.map((row) => new MediaModel(row));
    return rows;
  }

  async create(mediaDto: MediaDto): Promise<any> {
    await this.databaseService.execute(
      'INSERT INTO media (title, url, fileFormat, type, thumbnailUrl, idCompany) VALUES (?, ?, ?, ?, ?, ?)',
      [
        mediaDto.title,
        mediaDto.url,
        mediaDto.fileFormat,
        mediaDto.type,
        mediaDto.thumbnailUrl,
        mediaDto.idCompany,
      ],
    );

    const row = await this.databaseService.execute(
      'select * from media where lastUpdate = (select max(lastUpdate) from media);',
    );

    return row[0];
  }

  async updateUrlMedia(mediaDto: MediaDto): Promise<void> {
    try {
      await this.databaseService.execute(
        'UPDATE media SET url = ? WHERE id = ?',
        [mediaDto.url, mediaDto.id],
      );
    } catch (error) {
      throw error;
    }
  }

  //   async update(id: string, company: CompanyDTO): Promise<void> {
  //     await this.databaseService.execute(
  //       'UPDATE company SET name = ?, about = ?, photo = ?, video = ?, whatsapp = ?, instagram = ? WHERE id = ?',
  //       [
  //         company.name,
  //         company.about,
  //         company.photo,
  //         company.video,
  //         company.whatsapp,
  //         company.instagram,
  //         id,
  //       ],
  //     );
  //   }

  async deleteById(id: string): Promise<void> {
    await this.databaseService.execute(
      'UPDATE media SET isActive = 0 WHERE id = ?',
      [id],
    );
  }

  //   async findAllCompanyMainInformation(idCompany: string): Promise<any> {
  //     try {
  //       return await this.databaseService.execute(
  //         `SELECT * FROM companyMainInformation WHERE idCompany = '${idCompany}' AND isActive = 1 ORDER BY title ASC`,
  //       );
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  //   async createCompanyMainInformation(
  //     item: CreateCompanyMainInformationDto,
  //   ): Promise<void> {
  //     try {
  //       const querie = `
  //       insert into
  //         companyMainInformation
  //           (title, description, idCompany)
  //         values (?, ?, ?);
  //       `;

  //       await this.databaseService.execute(querie, [
  //         item.title,
  //         item.description,
  //         item.idCompany,
  //       ]);
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  //   async deleteCompanyMainInformation(
  //     idCompanyMainInformation: string,
  //   ): Promise<void> {
  //     try {
  //       await this.databaseService.execute(
  //         'UPDATE companyMainInformation SET isActive = 0 WHERE id = ?',
  //         [idCompanyMainInformation],
  //       );
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  //   async updateCompanyMainInformation(
  //     item: UpdateCompanyMainInformationDto,
  //   ): Promise<void> {
  //     try {
  //       await this.databaseService.execute(
  //         'UPDATE companyMainInformation SET title = ?, description = ? WHERE id = ?',
  //         [item.title, item.description, item.idCompanyMainInformation],
  //       );
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  //   async findAllPosturalPatterns(idCompany: string): Promise<any> {
  //     try {
  //       const rows = await this.databaseService.execute(
  //         `SELECT * FROM posturalPattern pp WHERE pp.idCompany = '${idCompany}' AND pp.isActive = 1  ORDER BY pp.order ASC`,
  //       );
  //       return rows;
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  //   async createPosturalPatterns(item: CreatePosturalPatternDto): Promise<void> {
  //     try {
  //       const querie = `
  //       insert into
  //         posturalPattern (title, description, imageUrl, idCompany)
  //         values (?, ?, ?, ?);
  //       `;

  //       await this.databaseService.execute(querie, [
  //         item.title,
  //         item.description,
  //         item.imageUrl,
  //         item.idCompany,
  //       ]);
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  //   async updateCompanyPosturalPatterns(
  //     item: UpdatePosturalPatternDto,
  //   ): Promise<void> {
  //     try {
  //       await this.databaseService.execute(
  //         'UPDATE posturalPattern SET title = ?, description = ?, imageUrl = ? WHERE id = ?',
  //         [item.title, item.description, item.imageUrl, item.id],
  //       );
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  //   async deleteCompanyPosturalPattern(id: string): Promise<void> {
  //     try {
  //       await this.databaseService.execute(
  //         'UPDATE posturalPattern SET isActive = 0 WHERE id = ?',
  //         [id],
  //       );
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  //   async getMeetAppScreen(idCompany: string): Promise<any> {
  //     try {
  //       const querie = `
  //         SELECT
  //             c.about AS aboutCompany_description,
  //             c.photo AS aboutCompany_imageUrl,
  //             c.video AS aboutCompany_videoUrl,
  //             t.name AS testimonies_name,
  //             t.description AS testimonies_description,
  //             t.imageUrl AS testimonies_imageUrl,
  //             pba.imageUrl AS photosBeforeAndAfter_imageUrl
  //         FROM
  //             company c
  //         LEFT JOIN testimony t ON c.id = t.idCompany
  //         LEFT JOIN photosBeforeAndAfter pba ON c.id = pba.idCompany
  //         WHERE
  //             c.id = '${idCompany}';`;

  //       return await this.databaseService.execute(querie);
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  //   async getTestimonyByIdCompany(idCompany: string): Promise<any> {
  //     const query = `
  //     SELECT
  //       name,
  //       description,
  //       imageUrl
  //     FROM
  //       testimony
  //     WHERE
  //       idCompany = '${idCompany}'
  //     `;

  //     return await this.databaseService.execute(query);
  //   }

  //   async getTestimonyByIdCompanyAdmin(idCompany: string): Promise<any> {
  //     const query = `
  //     SELECT
  //     id,
  //     name,
  //     description,
  //     imageUrl
  //     FROM
  //       testimony
  //     WHERE
  //       idCompany = '${idCompany}'
  //     `;

  //     return await this.databaseService.execute(query);
  //   }

  //   async getPhotosBeforeAndAfterByIdCompany(idCompany: string): Promise<any> {
  //     const query = `
  //     SELECT
  //       imageUrl
  //     FROM
  //     photosBeforeAndAfter
  //     WHERE
  //       idCompany = '${idCompany}'
  //     `;

  //     return await this.databaseService.execute(query);
  //   }

  //   async getPhotosBeforeAndAfterByIdCompanyAdmin(
  //     idCompany: string,
  //   ): Promise<any> {
  //     const query = `
  //     SELECT
  //       id, imageUrl
  //     FROM
  //     photosBeforeAndAfter
  //     WHERE
  //       idCompany = '${idCompany}'
  //     `;

  //     return this.databaseService.execute(query);
  //   }

  //   async getAllPartnershipsByIdCompany(idCompany: string): Promise<any> {
  //     try {
  //       const querie = `
  //       SELECT
  //         p.id as partnershipId,
  //         p.idCompany as partnershipIdCompany,
  //         p.name as partnershipName,
  //         p.imageUrl as partnershipImageUrl,
  //         p.description as partnershipDescription,
  //         p.contact as partnershipContact,
  //         p.email as partnershipEmail,
  //         p.instagram as partnershipInstagram,
  //         p.website as partnershipWebsite,
  //         p.address as partnershipAddress,
  //         pc.name as partnershipCategoryName
  //   FROM partnership p
  //       INNER JOIN partnershipCategory pc on p.idPartnershipCategory = pc.id

  //   WHERE
  //       p.idCompany = '${idCompany}' AND
  //       p.isActive = 1`;

  //       return await this.databaseService.execute(querie);
  //     } catch (error) {
  //       throw error;
  //     }
  //   }
}
