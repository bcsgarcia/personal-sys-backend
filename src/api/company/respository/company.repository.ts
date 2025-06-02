import { Inject, Injectable } from '@nestjs/common';
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
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class CompanyRepository {
  constructor(
    private databaseService: DatabaseService,
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async findById(id: string): Promise<any> {
    // const row = await this.databaseService.execute('SELECT * FROM company WHERE id = ?', [id]);
    // return row[0];
    const { data, error } = await this.supabase
      .from('company')
      .select('*')
      .eq('id', id);
    if (error) throw error;
    return data[0];
  }

  async findByIdAdmin(id: string): Promise<any> {
    // const row = await this.databaseService.execute(
    //   'SELECT id, name, about, photoMediaId, firstVideoMediaId, secondVideoMediaId, whatsapp, instagram FROM company WHERE id = ?',
    //   [id],
    // );
    //
    // return row[0];

    const { data, error } = await this.supabase
      .from('company')
      .select(
        `
      id,
      name,
      about,
      photoMediaId,
      firstVideoMediaId,
      secondVideoMediaId,
      whatsapp,
      instagram
    `,
      )
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async findAll(): Promise<CompanyModel[]> {
    // const rows = await this.databaseService.execute('SELECT * FROM company');
    // const companies = rows.map((row) => new CompanyModel(row));
    // return companies;

    const { data: rows, error } = await this.supabase
      .from('company')
      .select('*');
    if (error) throw error;
    return (rows || []).map((row) => new CompanyModel(row));
  }

  async create(company: CompanyDTO): Promise<void> {
    // await this.databaseService.execute(
    //   'INSERT INTO company (name, about, photoMediaId, firstVideoMediaId, secondVideoMediaId, whatsapp, instagram) VALUES (?, ?, ?, ?, ?, ?, ?)',
    //   [
    //     company.name,
    //     company.about,
    //     company.photoMediaId,
    //     company.firstVideoMediaId,
    //     company.secondVideoMediaId,
    //     company.whatsapp,
    //     company.instagram,
    //   ],
    // );

    const { error } = await this.supabase.from('company').insert([
      {
        name: company.name,
        about: company.about,
        photoMediaId: company.photoMediaId,
        firstVideoMediaId: company.firstVideoMediaId,
        secondVideoMediaId: company.secondVideoMediaId,
        whatsapp: company.whatsapp,
        instagram: company.instagram,
      },
    ]);

    if (error) throw error;
  }

  async update(company: CompanyDTO): Promise<void> {
    // await this.databaseService.execute(
    //   'UPDATE company SET  about = ?, photoMediaId = ?, firstVideoMediaId = ?, secondVideoMediaId = ?, whatsapp = ? WHERE id = ?',
    //   [
    //     company.about,
    //     company.photoMediaId,
    //     company.firstVideoMediaId,
    //     company.secondVideoMediaId,
    //     company.whatsapp,
    //     company.id,
    //   ],
    // );

    const { error } = await this.supabase
      .from('company')
      .update({
        about: company.about,
        photoMediaId: company.photoMediaId,
        firstVideoMediaId: company.firstVideoMediaId,
        secondVideoMediaId: company.secondVideoMediaId,
        whatsapp: company.whatsapp,
      })
      .eq('id', company.id);

    if (error) throw error;
  }

  async deleteById(id: string): Promise<void> {
    // await this.databaseService.execute('UPDATE company SET isActive = 0 WHERE id = ?', [id]);
    const { error } = await this.supabase
      .from('company')
      .update({ isActive: false })
      .eq('id', id);

    if (error) throw error;
  }

  async findAllCompanyMainInformation(idCompany: string): Promise<any> {
    // try {
    //   return await this.databaseService.execute(
    //     `SELECT *
    //      FROM companyMainInformation
    //      WHERE idCompany = '${idCompany}'
    //        AND isActive = 1
    //      ORDER BY infoOrder ASC`,
    //   );
    // } catch (error) {
    //   throw error;
    // }

    const { data, error } = await this.supabase
      .from('companyMainInformation')
      .select('*')
      .eq('idCompany', idCompany)
      .eq('isActive', true)
      .order('infoOrder', { ascending: true });

    if (error) throw error;
    return data;
  }

  async createCompanyMainInformation(
    item: CreateCompanyMainInformationDto,
  ): Promise<void> {
    // try {
    //   const querie = `
    //       insert into companyMainInformation
    //           (title, description, idCompany, infoOrder)
    //       values (?, ?, ?, ?);
    //   `;
    //
    //   await this.databaseService.execute(querie, [item.title, item.description, item.idCompany, item.infoOrder]);
    // } catch (error) {
    //   throw error;
    // }

    const { error } = await this.supabase
      .from('companyMainInformation')
      .insert([
        {
          title: item.title,
          description: item.description,
          idCompany: item.idCompany,
          infoOrder: item.infoOrder,
        },
      ]);

    if (error) throw error;
  }

  async deleteCompanyMainInformation(
    deleteItemDto: DeleteItemDto,
  ): Promise<void> {
    // try {
    //   const placeholders = deleteItemDto.idList.map(() => '?').join(',');
    //
    //   const query = `delete
    //                  from companyMainInformation
    //                  WHERE id in (${placeholders})
    //                    and idCompany = ?`;
    //
    //   await this.databaseService.execute(query, [...deleteItemDto.idList, deleteItemDto.idCompany]);
    // } catch (error) {
    //   throw error;
    // }

    const { error } = await this.supabase
      .from('companyMainInformation')
      .delete()
      .in('id', deleteItemDto.idList)
      .eq('idCompany', deleteItemDto.idCompany);

    if (error) throw error;
  }

  async updateCompanyMainInformation(
    updateMainInformationList: UpdateMainInformationListDto,
  ): Promise<void> {
    // try {
    //   await this.databaseService.transaction(async (conn) => {
    //     for (const item of updateMainInformationList.mainInformationList) {
    //       await this.databaseService.execute(
    //         'UPDATE companyMainInformation SET title = ?, description = ?, infoOrder = ? WHERE id = ? and idCompany = ?',
    //         [item.title, item.description, item.infoOrder, item.id, updateMainInformationList.idCompany],
    //         conn,
    //       );
    //     }
    //   });
    // } catch (error) {
    //   throw error;
    // }

    for (const item of updateMainInformationList.mainInformationList) {
      const { error } = await this.supabase
        .from('companyMainInformation')
        .update({
          title: item.title,
          description: item.description,
          infoOrder: item.infoOrder,
        })
        .eq('id', item.id)
        .eq('idCompany', updateMainInformationList.idCompany);

      if (error) throw error;
    }
  }

  async findAllPosturalPatterns(idCompany: string): Promise<any> {
    // try {
    //   const rows = await this.databaseService.execute(
    //     `SELECT *
    //      FROM posturalPattern pp
    //      WHERE pp.idCompany = '${idCompany}'
    //        AND pp.isActive = 1
    //      ORDER BY pp.posturalPatternOrder ASC`,
    //   );
    //   return rows;
    // } catch (error) {
    //   throw error;
    // }
    const { data, error } = await this.supabase
      .from('posturalPattern')
      .select('*')
      .eq('idCompany', idCompany)
      .eq('isActive', true)
      .order('posturalPatternOrder', { ascending: true });

    if (error) throw error;
    return data;
  }

  async createPosturalPatterns(item: CreatePosturalPatternDto): Promise<void> {
    // try {
    //   const query = `
    //       insert into posturalPattern (title, description, idMedia, idCompany,
    //                                    posturalPatternOrder)
    //       values (?, ?, ?, ?, ?);
    //   `;
    //
    //   await this.databaseService.execute(query, [
    //     item.title,
    //     item.description,
    //     item.idMedia,
    //     item.idCompany,
    //     item.posturalPatternOrder,
    //   ]);
    // } catch (error) {
    //   throw error;
    // }
    const { error } = await this.supabase.from('posturalPattern').insert([
      {
        title: item.title,
        description: item.description,
        idMedia: item.idMedia,
        idCompany: item.idCompany,
        posturalPatternOrder: item.posturalPatternOrder,
      },
    ]);

    if (error) throw error;
  }

  async updateCompanyPosturalPatterns(
    updatePosturalPatternList: UpdatePosturalPatternListDto,
  ): Promise<void> {
    // try {
    //   await this.databaseService.transaction(async (conn) => {
    //     for (const item of updatePosturalPatternList.posturalPatternList) {
    //       await this.databaseService.execute(
    //         'UPDATE posturalPattern SET title = ?, description = ?, posturalPatternOrder = ?, idMedia = ? WHERE id = ? and idCompany = ?',
    //         [
    //           item.title,
    //           item.description,
    //           item.posturalPatternOrder,
    //           item.idMedia,
    //           item.id,
    //           updatePosturalPatternList.idCompany,
    //         ],
    //         conn,
    //       );
    //     }
    //   });
    // } catch (error) {
    //   throw error;
    // }
    for (const item of updatePosturalPatternList.posturalPatternList) {
      const { error } = await this.supabase
        .from('posturalPattern')
        .update({
          title: item.title,
          description: item.description,
          posturalPatternOrder: item.posturalPatternOrder,
          idMedia: item.idMedia,
        })
        .eq('id', item.id)
        .eq('idCompany', updatePosturalPatternList.idCompany);

      if (error) throw error;
    }
  }

  async deleteCompanyPosturalPattern(
    deleteItemDto: DeleteItemDto,
  ): Promise<void> {
    // try {
    //   const placeholders = deleteItemDto.idList.map(() => '?').join(',');
    //
    //   const query = `delete
    //                  from posturalPattern
    //                  WHERE id in (${placeholders})
    //                    and idCompany = ?`;
    //
    //   await this.databaseService.execute(query, [...deleteItemDto.idList, deleteItemDto.idCompany]);
    // } catch (error) {
    //   throw error;
    // }
    const { error } = await this.supabase
      .from('posturalPattern')
      .delete()
      .in('id', deleteItemDto.idList)
      .eq('idCompany', deleteItemDto.idCompany);

    if (error) throw error;
  }

  async getMeetAppScreen(idCompany: string): Promise<any> {
    // try {
    //   const querie = `
    //       SELECT c.about             AS aboutCompany_description,
    //              c.photo             AS aboutCompany_imageUrl,
    //              c.firstVideoMediaId AS aboutCompany_videoUrl,
    //              t.name              AS testimonies_name,
    //              t.description       AS testimonies_description,
    //              mt.url              AS testimonies_imageUrl,
    //              m.url               AS photosBeforeAndAfter_imageUrl
    //       FROM company c
    //                LEFT JOIN testimony t ON c.id = t.idCompany
    //                LEFT JOIN photosBeforeAndAfter pba ON c.id = pba.idCompany
    //                LEFT JOIN media mt on mt.id = t.idMedia
    //                LEFT JOIN media m ON m.id = pba.idMedia
    //       WHERE c.id = '${idCompany}';`;
    //
    //   return await this.databaseService.execute(querie);
    // } catch (error) {
    //   throw error;
    // }
    const { data, error } = await this.supabase
      .from('company')
      .select(
        `
        about,
        photoMedia:photoMediaId (url),
        firstVideoMedia: firstVideoMediaId (url),
        secondVideoMedia: secondVideoMediaId (url),
        testimonies: testimony (
          name,
          description,
          media (url)
        ),
        photosBeforeAndAfter: photosBeforeAndAfter (
          media (url)
        )
      `,
      )
      .eq('id', idCompany)
      .single();

    if (error) throw error;
    return data;
  }

  async getTestimonyByIdCompany(idCompany: string): Promise<any> {
    // const query = `
    //     SELECT t.name,
    //            t.description,
    //            m.url as imageUrl
    //     FROM testimony t
    //              left join media m on t.idMedia = m.id
    //     WHERE t.idCompany = '${idCompany}'
    // `;
    //
    // return await this.databaseService.execute(query);

    const { data, error } = await this.supabase
      .from('testimony')
      .select(`name, description, media (url)`)
      .eq('idCompany', idCompany);

    if (error) throw error;
    return data;
  }

  async getTestimonyByIdCompanyAdmin(idCompany: string): Promise<any> {
    // const query = `
    //     SELECT id,
    //            name,
    //            description,
    //            idMedia
    //     FROM testimony
    //     WHERE idCompany = '${idCompany}'
    // `;
    //
    // return await this.databaseService.execute(query);
    const { data, error } = await this.supabase
      .from('testimony')
      .select('id, name, description, idMedia')
      .eq('idCompany', idCompany);

    if (error) throw error;
    return data;
  }

  async getPhotosBeforeAndAfterByIdCompany(idCompany: string): Promise<any> {
    // const query = `
    //     SELECT m.url as imageUrl
    //     FROM photosBeforeAndAfter b
    //              left join media m on m.id = b.idMedia
    //     WHERE b.idCompany = '${idCompany}'
    // `;
    //
    // return await this.databaseService.execute(query);

    const { data, error } = await this.supabase
      .from('photosBeforeAndAfter')
      .select(`media (url)`)
      .eq('idCompany', idCompany);

    if (error) throw error;
    return data;
  }

  async getPhotosBeforeAndAfterByIdCompanyAdmin(
    idCompany: string,
  ): Promise<any> {
    // const query = `
    //     SELECT b.id,
    //            b.idMedia
    //     FROM photosBeforeAndAfter b
    //     WHERE b.idCompany = '${idCompany}'
    //     order by b.lastUpdate
    // `;
    //
    // return this.databaseService.execute(query);
    const { data, error } = await this.supabase
      .from('photosBeforeAndAfter')
      .select('id, idMedia')
      .eq('idCompany', idCompany)
      .order('lastUpdate', { ascending: true });

    if (error) throw error;
    return data;
  }

  async getAllPartnershipsByIdCompany(idCompany: string): Promise<any> {
    // try {
    //   const querie = `
    //       SELECT p.id          as partnershipId,
    //              p.idCompany   as partnershipIdCompany,
    //              p.name        as partnershipName,
    //              case
    //                  when p.imageUrl is not null then p.imageUrl
    //                  else 'https://personal-media.bcsgarcia.com.br/partnership_logo/default_logo.png'
    //                  end       as partnershipImageUrl,
    //              p.description as partnershipDescription,
    //              p.contact     as partnershipContact,
    //              p.email       as partnershipEmail,
    //              p.instagram   as partnershipInstagram,
    //              p.website     as partnershipWebsite,
    //              p.address     as partnershipAddress,
    //              pc.name       as partnershipCategoryName
    //       FROM partnership p
    //                INNER JOIN partnershipCategory pc
    //                           on p.idPartnershipCategory = pc.id
    //
    //       WHERE p.idCompany = '${idCompany}'
    //         AND p.isActive = 1`;
    //
    //   return await this.databaseService.execute(querie);
    // } catch (error) {
    //   throw error;
    // }
    const { data, error } = await this.supabase
      .from('partnership')
      .select(
        `
        id,
        idCompany,
        name,
        imageUrl,
        description,
        contact,
        email,
        instagram,
        website,
        address,
        partnershipCategory ( name )
      `,
      )
      .eq('idCompany', idCompany)
      .eq('isActive', true);

    if (error) throw error;

    // Aplicar lógica do CASE para imageUrl nulo
    return (data || []).map((p) => ({
      partnershipId: p.id,
      partnershipIdCompany: p.idCompany,
      partnershipName: p.name,
      partnershipImageUrl:
        p.imageUrl ??
        'https://personal-media.bcsgarcia.com.br/partnership_logo/default_logo.png',
      partnershipDescription: p.description,
      partnershipContact: p.contact,
      partnershipEmail: p.email,
      partnershipInstagram: p.instagram,
      partnershipWebsite: p.website,
      partnershipAddress: p.address,
      partnershipCategoryName: p.partnershipCategory[0]?.name ?? '',
    }));
  }

  async createBeforeAndAfterImage(
    items: CreateBeforeAndAfterImageDto[],
    idCompany: string,
  ): Promise<void> {
    // try {
    //   const params = items.map((item) => `('${item.idMedia}', '${idCompany}')`).join(',');
    //
    //   const query = `
    //       insert into photosBeforeAndAfter
    //           (idMedia, idCompany)
    //       values ${params};
    //   `;
    //
    //   await this.databaseService.execute(query);
    // } catch (error) {
    //   throw error;
    // }

    const records = items.map((item) => ({
      idMedia: item.idMedia,
      idCompany: idCompany,
    }));

    const { error } = await this.supabase
      .from('photosBeforeAndAfter')
      .insert(records);

    if (error) throw error;
  }

  async deleteBeforeAndAfterImage(
    deleteBeforeAndAfterImageDto: DeleteBeforeAndAfterImageDto,
  ): Promise<void> {
    // try {
    //   const placeholders = deleteBeforeAndAfterImageDto.idList.map(() => '?').join(',');
    //
    //   const query = `delete
    //                  from photosBeforeAndAfter
    //                  WHERE id in (${placeholders})
    //                    and idCompany = ?`;
    //
    //   await this.databaseService.execute(query, [
    //     ...deleteBeforeAndAfterImageDto.idList,
    //     deleteBeforeAndAfterImageDto.idCompany,
    //   ]);
    // } catch (error) {
    //   throw error;
    // }

    const { error } = await this.supabase
      .from('photosBeforeAndAfter')
      .delete()
      .in('id', deleteBeforeAndAfterImageDto.idList)
      .eq('idCompany', deleteBeforeAndAfterImageDto.idCompany);

    if (error) throw error;
  }

  async createTestimony(
    items: CreateTestimonyDto[],
    idCompany: string,
  ): Promise<void> {
    // try {
    //   const params = items
    //     .map((item) => `('${item.name}', '${item.description}', '${idCompany}', '${item.idMedia}')`)
    //     .join(',');
    //
    //   const query = `
    //       insert into testimony
    //           (name, description, idCompany, idMedia)
    //       values ${params};
    //   `;
    //
    //   await this.databaseService.execute(query);
    // } catch (error) {
    //   throw error;
    // }
    const records = items.map((item) => ({
      name: item.name,
      description: item.description,
      idCompany: idCompany,
      idMedia: item.idMedia,
    }));

    const { error } = await this.supabase.from('testimony').insert(records);

    if (error) throw error;
  }

  async deleteTestimony(deleteTestimonyDto: DeleteTestimonyDto): Promise<void> {
    // try {
    //   const placeholders = deleteTestimonyDto.idList.map(() => '?').join(',');
    //
    //   const query = `delete
    //                  from testimony
    //                  WHERE id in (${placeholders})
    //                    and idCompany = ? `;
    //
    //   await this.databaseService.execute(query, [...deleteTestimonyDto.idList, deleteTestimonyDto.idCompany]);
    // } catch (error) {
    //   throw error;
    // }
    const { error } = await this.supabase
      .from('testimony')
      .delete()
      .in('id', deleteTestimonyDto.idList)
      .eq('idCompany', deleteTestimonyDto.idCompany);

    if (error) throw error;
  }
}
