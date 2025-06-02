import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreatePartnershipDto } from '../dto/create-partnership.dto';
import { UpdatePartnershipDto } from '../dto/update-partnership.dto';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class PartnershipRepository {
  constructor(
    private databaseService: DatabaseService,
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async create(partner: CreatePartnershipDto): Promise<string> {
    try {
      // const createQuery = `INSERT INTO partnership (name,
      //                                               contact,
      //                                               email,
      //                                               instagram,
      //                                               website,
      //                                               imageUrl,
      //                                               description,
      //                                               address,
      //                                               idPartnershipCategory,
      //                                               idCompany)
      //                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      //
      // await this.databaseService.execute(createQuery, [
      //   partner.name,
      //   partner.contact == undefined ? null : partner.contact,
      //   partner.email == undefined ? null : partner.email,
      //   partner.instagram == undefined ? null : partner.instagram,
      //   partner.website == undefined ? null : partner.website,
      //   partner.imageUrl == undefined ? null : partner.imageUrl,
      //   partner.description == undefined ? null : partner.description,
      //   partner.address == undefined ? null : partner.address,
      //   partner.idPartnershipCategory,
      //   partner.idCompany,
      // ]);
      //
      // const query = `SELECT id
      //                FROM partnership
      //                WHERE name = ?
      //                  and idCompany = ?
      //                  and idPartnershipCategory = ?
      //                ORDER BY lastUpdate DESC limit 1;`;
      //
      // const lastInsertedRows = await this.databaseService.execute(query, [
      //   partner.name,
      //   partner.idCompany,
      //   partner.idPartnershipCategory,
      // ]);
      //
      // return lastInsertedRows[0].id;
      const { data, error } = await this.supabase
        .from('partnership')
        .insert([
          {
            name: partner.name,
            contact: partner.contact ?? null,
            email: partner.email ?? null,
            instagram: partner.instagram ?? null,
            website: partner.website ?? null,
            imageUrl: partner.imageUrl ?? null,
            description: partner.description ?? null,
            address: partner.address ?? null,
            idPartnershipCategory: partner.idPartnershipCategory,
            idCompany: partner.idCompany,
          },
        ])
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async updateLogoUrl(partnershipId: string, imageUrl: string): Promise<void> {
    try {
      // const createQuery = `update partnership
      //                      set imageUrl = ?
      //                      where id = ?`;
      //
      // await this.databaseService.execute(createQuery, [imageUrl, partnershipId]);
      const { error } = await this.supabase
        .from('partnership')
        .update({ imageUrl })
        .eq('id', partnershipId);

      if (error) throw error;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async update(updatePartnerDto: UpdatePartnershipDto): Promise<void> {
    try {
      // await this.databaseService.execute(
      //   `
      //       UPDATE partnership
      //       SET name                  = ?,
      //           contact               = ?,
      //           email                 = ?,
      //           instagram             = ?,
      //           website               = ?,
      //           description           = ?,
      //           address               = ?,
      //           idPartnershipCategory = ?
      //       WHERE id = ?`,
      //   [
      //     updatePartnerDto.name,
      //     updatePartnerDto.contact,
      //     updatePartnerDto.email,
      //     updatePartnerDto.instagram,
      //     updatePartnerDto.website,
      //     updatePartnerDto.description,
      //     updatePartnerDto.address,
      //     updatePartnerDto.idPartnershipCategory,
      //     updatePartnerDto.id,
      //   ],
      // );

      const { error } = await this.supabase
        .from('partnership')
        .update({
          name: updatePartnerDto.name,
          contact: updatePartnerDto.contact,
          email: updatePartnerDto.email,
          instagram: updatePartnerDto.instagram,
          website: updatePartnerDto.website,
          description: updatePartnerDto.description,
          address: updatePartnerDto.address,
          idPartnershipCategory: updatePartnerDto.idPartnershipCategory,
        })
        .eq('id', updatePartnerDto.id);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async findAll(idCompany: string): Promise<any> {
    try {
      // const query = `
      //     SELECT p.id,
      //            p.name,
      //            p.email,
      //            p.instagram,
      //            p.website,
      //            p.imageUrl,
      //            p.description,
      //            p.address,
      //            c.name as                            category,
      //            upper(substr(trim(c.name), 1, 1)) as sortGroup
      //     FROM partnership p
      //              INNER JOIN partnershipCategory c
      //                         on p.idPartnershipCategory = c.id
      //     WHERE p.idCompany = '${idCompany}'
      //     ORDER BY c.name, p.name`;
      //
      // return await this.databaseService.execute(query);
      const { data, error } = await this.supabase
        .from('partnership')
        .select(
          `
        id,
        name,
        email,
        instagram,
        website,
        imageUrl,
        description,
        address,
        partnershipCategory ( name )
      `,
        )
        .eq('idCompany', idCompany)
        // ordena primeiro pelo nome da categoria (coluna “name” em partnershipCategory)
        .order('name', { foreignTable: 'partnershipCategory', ascending: true })
        // depois pelo nome da parceria (coluna “name” em partnership)
        .order('name', { ascending: true });

      if (error) throw error;

      return (data || []).map((item) => {
        const category = item.partnershipCategory?.[0]?.name ?? '';
        return {
          id: item.id,
          name: item.name,
          email: item.email,
          instagram: item.instagram,
          website: item.website,
          imageUrl: item.imageUrl,
          description: item.description,
          address: item.address,
          category,
          sortGroup: category.trim().charAt(0).toUpperCase(),
        };
      });
    } catch (error) {
      throw error;
    }
  }

  async findAllPartnershipCategory(idCompany: string): Promise<any> {
    try {
      // const query = `
      //     SELECT id, name
      //     FROM partnershipCategory
      //     WHERE idCompany = '${idCompany}'
      //       AND isActive = 1
      //     ORDER BY name`;
      //
      // return await this.databaseService.execute(query);
      const { data, error } = await this.supabase
        .from('partnershipCategory')
        .select('id, name')
        .eq('idCompany', idCompany)
        .eq('isActive', true)
        .order('name', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async findCategoryByIdOrName(
    idCategoryOrName: string,
    idCompany: string,
  ): Promise<any> {
    try {
      // const query = `SELECT *
      //                FROM partnershipCategory
      //                WHERE isActive = 1
      //                  AND idCompany = '${idCompany}'
      //                  AND (
      //                    id = '${idCategoryOrName}'
      //                        OR
      //                    trim(lower(name)) = trim(lower('${idCategoryOrName}'))
      //                    )`;
      //
      // return await this.databaseService.execute(query);
      const { data, error } = await this.supabase
        .from('partnershipCategory')
        .select('*')
        .eq('idCompany', idCompany)
        .eq('isActive', true)
        .or(`id.eq.${idCategoryOrName},name.ilike.${idCategoryOrName}`);

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async createCategory(categoryName: string, idCompany: string) {
    try {
      // const createQuery = `INSERT INTO partnershipCategory (name,
      //                                                       idCompany)
      //                      VALUES (?, ?)`;
      //
      // await this.databaseService.execute(createQuery, [categoryName.trim(), idCompany]);
      //
      // const query = `SELECT *
      //                FROM partnershipCategory
      //                WHERE isActive = 1
      //                  AND idCompany = '${idCompany}'
      //                  AND name = TRIM('${categoryName}')`;
      //
      // return await this.databaseService.execute(query);
      const trimmedName = categoryName.trim();
      const { data, error } = await this.supabase
        .from('partnershipCategory')
        .insert([{ name: trimmedName, idCompany }])
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async delete(idPartner: string, idCompany: string) {
    try {
      // const createQuery = `DELETE
      //                      FROM partnership
      //                      WHERE id = ?
      //                        AND idCompany = ?`;
      //
      // return await this.databaseService.execute(createQuery, [idPartner, idCompany]);
      const { error } = await this.supabase
        .from('partnership')
        .delete()
        .eq('id', idPartner)
        .eq('idCompany', idCompany);

      if (error) throw error;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
