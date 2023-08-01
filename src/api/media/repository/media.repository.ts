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
      'SELECT * FROM media where idCompany = ? order by title',
      [idCompany],
    );
    return rows;
  }

  async findAllPagined(
    idCompany: string,
    offset: number,
    itemsPerPage: number,
    mediaType: string,
    title: string,
  ): Promise<any> {
    const rows = await this.databaseService.execute(
      `SELECT *
       FROM media
       WHERE idCompany = '${idCompany}' ${
        mediaType == 'null' ? '' : ` AND type = '${mediaType}' `
      }
       AND title like '%${title}%'
       ORDER BY title LIMIT ${itemsPerPage}
       OFFSET ${offset}`,
    );

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
        'UPDATE media SET url = ?, thumbnailUrl = ? WHERE id = ?',
        [mediaDto.url, mediaDto.thumbnailUrl, mediaDto.id],
      );
    } catch (error) {
      throw error;
    }
  }

  async update(mediaDto: MediaDto): Promise<void> {
    try {
      await this.databaseService.execute(
        'UPDATE media SET title = ? WHERE id = ?',
        [mediaDto.title, mediaDto.id],
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id: string): Promise<void> {
    await this.databaseService.execute('DELETE from media WHERE id = ?', [id]);
  }
}
