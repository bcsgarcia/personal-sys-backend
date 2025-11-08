import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { MediaDto } from '../dto/create-media.dto';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class MediaRepository {
  constructor(
    private databaseService: DatabaseService,
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async findById(id: string): Promise<any> {
    // const row = await this.databaseService.execute('SELECT * FROM media WHERE id = ?', [id]);
    // return row[0];

    const { data, error } = await this.supabase
      .from('media')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async findAll(idCompany: string): Promise<any> {
    // const rows = await this.databaseService.execute('SELECT * FROM media where idCompany = ? order by title', [
    //   idCompany,
    // ]);
    // return rows;
    const { data, error } = await this.supabase
      .from('media')
      .select('*')
      .eq('idCompany', idCompany)
      .order('title', { ascending: true });

    if (error) throw error;
    return data;
  }

  async findAllPagined(
    idCompany: string,
    offset: number,
    itemsPerPage: number,
    mediaType: string,
    title: string,
  ): Promise<any> {
    // const rows = await this.databaseService.execute(
    //   `SELECT *
    //    FROM media
    //    WHERE idCompany = '${idCompany}' ${mediaType == 'null' ? '' : ` AND type = '${mediaType}' `}
    //    AND title like '%${title}%'
    //    ORDER BY title LIMIT ${itemsPerPage}
    //    OFFSET ${offset}`,
    // );
    //
    // return rows;
    let query = this.supabase
      .from('media')
      .select('*')
      .eq('idCompany', idCompany)
      .order('title', { ascending: true })
      .range(offset, offset + itemsPerPage - 1);

    if (mediaType !== 'null') {
      query = query.eq('type', mediaType);
    }
    if (title) {
      query = query.ilike('title', `%${title}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async create(mediaDto: MediaDto): Promise<any> {
    // await this.databaseService.execute(
    //   'INSERT INTO media (title, url, fileFormat, type, thumbnailUrl, idCompany) VALUES (?, ?, ?, ?, ?, ?)',
    //   [mediaDto.title, mediaDto.url, mediaDto.fileFormat, mediaDto.type, mediaDto.thumbnailUrl, mediaDto.idCompany],
    // );
    //
    // const row = await this.databaseService.execute(
    //   'select * from media where lastUpdate = (select max(lastUpdate) from media);',
    // );
    //
    // return row[0];
    const { data, error } = await this.supabase
      .from('media')
      .insert([
        {
          title: mediaDto.title,
          url: mediaDto.url,
          fileFormat: mediaDto.fileFormat,
          type: mediaDto.type,
          thumbnailUrl: mediaDto.thumbnailUrl,
          idCompany: mediaDto.idCompany,
        },
      ])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async updateUrlMedia(mediaDto: MediaDto): Promise<void> {
    try {
      // await this.databaseService.execute('UPDATE media SET url = ?, thumbnailUrl = ? WHERE id = ?', [
      //   mediaDto.url,
      //   mediaDto.thumbnailUrl,
      //   mediaDto.id,
      // ]);
      const { error } = await this.supabase
        .from('media')
        .update({
          url: mediaDto.url,
          thumbnailUrl: mediaDto.thumbnailUrl,
        })
        .eq('id', mediaDto.id);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async update(mediaDto: MediaDto): Promise<void> {
    try {
      // await this.databaseService.execute('UPDATE media SET title = ? WHERE id = ?', [mediaDto.title, mediaDto.id]);
      const { error } = await this.supabase
        .from('media')
        .update({ title: mediaDto.title })
        .eq('id', mediaDto.id);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id: string): Promise<void> {
    // await this.databaseService.execute('DELETE from media WHERE id = ?', [id]);
    const { error } = await this.supabase.from('media').delete().eq('id', id);

    if (error) throw error;
  }
}
