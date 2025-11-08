import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  convertDateToTimestamp,
  getMessage,
  SqlError,
} from 'src/api/utils/utils';
import { AccessTokenModel } from 'src/models/access-token-user.model';
import { CreateWorkoutsheetDefaultWorkoutDto } from '../dto/request/create.workoutsheet.default.dto';
import { WorkoutsheetModel } from '../../../models/workoutsheet.model';
import { WorkoutClientModel } from '../../../models/workout.client.model';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class WorkoutsheetRepository {
  constructor(
    private databaseService: DatabaseService,
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async createWorkoutSheetDefault(
    title: string,
    idCompany: string,
  ): Promise<any> {
    try {
      // const createQuery = `insert into workoutSheetDefault (title, idCompany)
      //                      values (?, ?);`;
      //
      // await this.databaseService.execute(createQuery, [title, idCompany]);
      //
      // const idWorkoutSheetDefault = await this.databaseService.execute(
      //   `SELECT *
      //    FROM workoutSheetDefault
      //    WHERE idCompany = '${idCompany}'
      //    order by lastUpdate desc limit 1`,
      // );
      //
      // return idWorkoutSheetDefault[0]['id'];

      const { data, error } = await this.supabase
        .from('workoutSheetDefault')
        .insert([{ title, idCompany }])
        .select('id')
        .single();

      if (error) {
        // Supondo que o Supabase retorne um código de erro para chave duplicada
        if (error.code === '23505') {
          // unique_violation
          throw new HttpException(
            `SQL error: ${getMessage(SqlError.DuplicateKey)}`,
            HttpStatus.CONFLICT,
          );
        }
        throw error;
      }

      return data.id;
    } catch (error) {
      if (error.code == SqlError.DuplicateKey) {
        const errorMessage = getMessage(SqlError.DuplicateKey);
        throw new HttpException(
          `SQL error: ${errorMessage}`,
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
  }

  async createWorkoutSheet(
    workoutsheetList: WorkoutsheetModel[],
  ): Promise<any> {
    try {
      // const params = workoutsheetList
      //   .map(
      //     (item) =>
      //       `('${item.name}', '${item.idCompany}', '${item.idClient}', '${item.idWorkoutsheetDefault}', ${item.workoutsheetOrder})`,
      //   )
      //   .join(',');
      //
      // const createQuery = `insert into workoutSheet (name, idCompany, idClient,
      //                                                idWorkoutsheetDefault,
      //                                                workoutsheetOrder)
      //                      values ${params};`;
      //
      // return await this.databaseService.execute(createQuery);
      const records = workoutsheetList.map((item) => ({
        name: item.name,
        idCompany: item.idCompany,
        idClient: item.idClient,
        idWorkoutsheetDefault: item.idWorkoutsheetDefault,
        workoutsheetOrder: item.workoutsheetOrder,
      }));

      const { data, error } = await this.supabase
        .from('workoutSheet')
        .insert(records)
        .select();

      if (error) {
        // Supabase returns Postgres error codes under `error.code`
        if (error.code === '23505') {
          // unique_violation
          const errorMessage = getMessage(SqlError.DuplicateKey);
          throw new HttpException(
            `SQL error: ${errorMessage}`,
            HttpStatus.CONFLICT,
          );
        }
        throw error;
      }

      return data;
    } catch (error) {
      if (error.code == SqlError.DuplicateKey) {
        const errorMessage = getMessage(SqlError.DuplicateKey);
        throw new HttpException(
          `SQL error: ${errorMessage}`,
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
  }

  async createWorkoutClient(
    workoutClientList: WorkoutClientModel[],
  ): Promise<any> {
    try {
      // const params = workoutClientList
      //   .map(
      //     (item) =>
      //       `('${item.title}', '${item.subtitle}', '${item.description}', '${item.idWorkoutSheet}', '${item.idWorkout}', '${item.idCompany}', ${item.workoutOrder})`,
      //   )
      //   .join(',');
      //
      // const createQuery = `insert into workoutClient (title, subtitle,
      //                                                 description,
      //                                                 idWorkoutSheet, idWorkout,
      //                                                 idCompany, workoutOrder)
      //                      values ${params};`;
      //
      // return await this.databaseService.execute(createQuery);
      const records = workoutClientList.map((item) => ({
        title: item.title,
        subtitle: item.subtitle,
        description: item.description,
        idWorkoutSheet: item.idWorkoutSheet,
        idWorkout: item.idWorkout,
        idCompany: item.idCompany,
        workoutOrder: item.workoutOrder,
      }));

      const { data, error } = await this.supabase
        .from('workoutClient')
        .insert(records)
        .select();

      if (error) {
        // tratamento de chave duplicada
        if (error.code === '23505') {
          const message = getMessage(SqlError.DuplicateKey);
          throw new HttpException(`SQL error: ${message}`, HttpStatus.CONFLICT);
        }
        throw error;
      }

      return data;
    } catch (error) {
      if (error.code == SqlError.DuplicateKey) {
        const errorMessage = getMessage(SqlError.DuplicateKey);
        throw new HttpException(
          `SQL error: ${errorMessage}`,
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
  }

  async updateWorkoutSheetDefault(
    title: string,
    idWorkout: string,
  ): Promise<any> {
    try {
      // const createQuery = `update workoutSheetDefault
      //                      set title = ?
      //                      where id = ?;`;
      //
      // return await this.databaseService.execute(createQuery, [title, idWorkout]);
      const { data, error } = await this.supabase
        .from('workoutSheetDefault')
        .update({ title })
        .eq('id', idWorkout)
        .select('*')
        .single();

      if (error) {
        // código de erro para violação de unicidade no Postgres
        if (error.code === '23505') {
          const errorMessage = getMessage(SqlError.DuplicateKey);
          throw new HttpException(
            `SQL error: ${errorMessage}`,
            HttpStatus.CONFLICT,
          );
        }
        throw error;
      }

      return data;
    } catch (error) {
      if (error.code == SqlError.DuplicateKey) {
        const errorMessage = getMessage(SqlError.DuplicateKey);
        throw new HttpException(
          `SQL error: ${errorMessage}`,
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
  }

  async createWorkoutSheetDefaultWorkout(
    idWorkoutSheetDefault: string,
    idCompany: string,
    createWorkoutsheetDefaultWorkoutDto: CreateWorkoutsheetDefaultWorkoutDto[],
  ): Promise<void> {
    try {
      // const params = createWorkoutsheetDefaultWorkoutDto
      //   .map((item) => `('${idWorkoutSheetDefault}', '${idCompany}', '${item.idWorkout}', ${item.workoutOrder})`)
      //   .join(',');
      //
      // const createQuery = `insert into workoutSheetDefaultWorkout (idWorkoutSheetDefault,
      //                                                              idCompany,
      //                                                              idWorkout,
      //                                                              workoutOrder)
      //                      values ${params}`;
      //
      // await this.databaseService.execute(createQuery);
      const records = createWorkoutsheetDefaultWorkoutDto.map((item) => ({
        idWorkoutSheetDefault,
        idCompany,
        idWorkout: item.idWorkout,
        workoutOrder: item.workoutOrder,
      }));

      const { error } = await this.supabase
        .from('workoutSheetDefaultWorkout')
        .insert(records);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async deleteWorkoutSheetDefaultWorkout(
    idWorkoutSheetDefault: string,
  ): Promise<void> {
    try {
      // const createQuery = `delete
      //                      from workoutSheetDefaultWorkout
      //                      where
      //                          idWorkoutSheetDefault = '${idWorkoutSheetDefault}
      //                          ';`;
      //
      // await this.databaseService.execute(createQuery);
      const { error } = await this.supabase
        .from('workoutSheetDefaultWorkout')
        .delete()
        .eq('idWorkoutSheetDefault', idWorkoutSheetDefault);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async getAllWorkoutSheetDefaultByIdCompany(idCompany: string): Promise<any> {
    try {
      // const query = `
      //     SELECT wsd.id        as wsdId,
      //            w.id          as workoutId,
      //            w.isActive    as wIsActive,
      //            w.lastUpdate  as wLastUpdate,
      //            wsd.title     as wsdTitle,
      //            w.title       as wTitle,
      //            w.subTitle    as wSubTitle,
      //            w.description as wDesc,
      //            w.videoUrl    as wVideoUrl,
      //            w.imageUrl    as wImageUrl
      //     FROM workoutSheetDefault wsd
      //              INNER JOIN workoutSheetDefaultWorkout wsdw
      //                         on wsd.id = wsdw.idWorkoutSheetDefault
      //              INNER JOIN workout w on w.id = wsdw.idWorkout
      //
      //     WHERE w.idCompany = '${idCompany}'
      //       AND w.isActive = 1`;
      //
      // return await this.databaseService.execute(query);
      const { data, error } = await this.supabase
        .from('workoutSheetDefault')
        .select(
          `
        id as wsdId,
        title as wsdTitle,
        workoutSheetDefaultWorkout (
          workout: workout (
            id as workoutId,
            isActive as wIsActive,
            lastUpdate as wLastUpdate,
            title as wTitle,
            subTitle as wSubTitle,
            description as wDesc,
            videoUrl as wVideoUrl,
            imageUrl as wImageUrl
          )
        )
      `,
        )
        .eq('idCompany', idCompany);

      if (error) throw error;

      // Achatar resultado para combinar cada default com seu workout
      const result: any[] = [];
      (data || []).forEach((raw: any) => {
        const wsd = raw as any; // aqui garantimos ao TS que wsd é `any`
        const workouts = wsd.workoutSheetDefaultWorkout || [];
        workouts.forEach((wsdw: any) => {
          const w = (wsdw.workout || [])[0] as any;
          if (w.wIsActive) {
            result.push({
              wsdId: wsd.wsdId,
              wsdTitle: wsd.wsdTitle,
              workoutId: w.workoutId,
              wIsActive: w.wIsActive,
              wLastUpdate: w.wLastUpdate,
              wTitle: w.wTitle,
              wSubTitle: w.wSubTitle,
              wDesc: w.wDesc,
              wVideoUrl: w.wVideoUrl,
              wImageUrl: w.wImageUrl,
            });
          }
        });
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getAllWorkoutsheetByIdClientAdmin(
    idClient: string,
    idCompany: string,
  ): Promise<any> {
    try {
      // const query = `SELECT w.*
      //                FROM workoutSheet w
      //                WHERE w.isActive = 1
      //                  AND w.idCompany = '${idCompany}'
      //                  AND w.idClient = '${idClient}'
      //                order by w.workoutsheetOrder`;
      //
      // return await this.databaseService.execute(query);
      const { data, error } = await this.supabase
        .from('workoutSheet')
        .select('*')
        .eq('isActive', true)
        .eq('idCompany', idCompany)
        .eq('idClient', idClient)
        .order('workoutsheetOrder', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getWorkoutsheetDefaultByIdList(
    idCompany: string,
    idWorkoutsheetDefaultList: string[],
  ): Promise<any> {
    try {
      // const params = idWorkoutsheetDefaultList.map((item) => `'${item}'`).join(',');
      //
      // const query = `SELECT *
      //                FROM workoutSheetDefault
      //                WHERE isActive = 1
      //                  AND id in (${params})
      //                  AND idCompany = '${idCompany}'
      //                order by title`;
      //
      // return await this.databaseService.execute(query);
      const { data, error } = await this.supabase
        .from('workoutSheetDefault')
        .select('*')
        .in('id', idWorkoutsheetDefaultList)
        .eq('isActive', true)
        .eq('idCompany', idCompany)
        .order('title', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getAllWorkoutsheetDefaultByIdCompanyAdmin(
    idCompany: string,
  ): Promise<any> {
    try {
      // const query = `SELECT *
      //                FROM workoutSheetDefault
      //                WHERE isActive = 1
      //                  AND idCompany = '${idCompany}'
      //                order by title`;
      //
      // return await this.databaseService.execute(query);
      const { data, error } = await this.supabase
        .from('workoutSheetDefault')
        .select('*')
        .eq('isActive', true)
        .eq('idCompany', idCompany)
        .order('title', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getAllWorkoutsheetDefaultWorkoutByIdCompanyAdmin(
    idCompany: string,
  ): Promise<any> {
    try {
      // const query = `SELECT *
      //                FROM workoutSheetDefaultWorkout
      //                WHERE idCompany = '${idCompany}' `;
      //
      // return await this.databaseService.execute(query);
      const { data, error } = await this.supabase
        .from('workoutSheetDefaultWorkout')
        .select('*')
        .eq('idCompany', idCompany);

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async deleteById(idWorkoutSheetDefault: string): Promise<void> {
    try {
      // await this.databaseService.execute(
      //   'update workoutSheetDefault set active = ?, title = concat(title, ?) WHERE id = ?',
      //   [false, ` - ${idWorkoutSheetDefault} - DELETED`, idWorkoutSheetDefault],
      // );
      // 1) Primeiro, buscamos o título atual
      const { data: existing, error: fetchError } = await this.supabase
        .from('workoutSheetDefault')
        .select('title')
        .eq('id', idWorkoutSheetDefault)
        .single();
      if (fetchError) throw fetchError;

      // 2) Montamos o novo título concatenado
      const newTitle = `${existing.title} - ${idWorkoutSheetDefault} - DELETED`;

      // 3) Atualizamos o registro com active = false e o título modificado
      const { error } = await this.supabase
        .from('workoutSheetDefault')
        .update({ active: false, title: newTitle })
        .eq('id', idWorkoutSheetDefault);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async getMyTrainingProgram(user: AccessTokenModel): Promise<any> {
    try {
      // const query = `
      //     SELECT ws.id                as workoutSheetId,
      //            ws.name              as workoutSheetName,
      //            wsd.date             as workoutSheedConclusionDate,
      //            ws.workoutsheetOrder as workoutSheetOrder,
      //
      //            wc.id                as workoutId,
      //            w.title              as workoutTitle,
      //            w.subTitle           as workoutSubtitle,
      //            w.description        as workoutDescription,
      //            wc.workoutOrder      as workoutOrder,
      //            wc.breakTime         as workoutBreakTime,
      //            wc.series            as workoutSeries,
      //
      //            m.id                 as mediaId,
      //            m.title              as mediaTitle,
      //            m.fileFormat         as mediaFormat,
      //            m.type               as mediaType,
      //            m.url                as mediaUrl,
      //            m.thumbnailUrl       as thumbnailUrl,
      //            wm.mediaOrder        as mediaOrder
      //     FROM workoutSheetDone wsd
      //              INNER JOIN workoutSheet ws on wsd.idWorkoutSheet = ws.id
      //              INNER JOIN workoutClient wc
      //                         on ws.id = wc.idWorkoutSheet and wc.isActive = 1
      //              INNER JOIN workout w
      //                         on wc.idWorkout = w.id and w.isActive = 1
      //              LEFT JOIN workoutMedia wm on w.id = wm.idWorkout
      //              LEFT JOIN media m on wm.idMedia = m.id and m.isActive = 1
      //
      //     WHERE ws.idClient = '${user.clientId}'
      //       AND ws.idCompany = '${user.clientIdCompany}'
      //       AND ws.isActive = 1
      //       AND wsd.date > ADDDATE(NOW(), -10)
      //
      //     ORDER BY wsd.date ASC;`;
      //
      // return await this.databaseService.execute(query);
      const tenDaysAgo = new Date(
        Date.now() - 10 * 24 * 60 * 60 * 1000,
      ).toISOString();

      const { data, error } = await this.supabase
        .from('workoutSheetDone')
        .select(
          `
      date,
      workoutSheet: workoutSheet (
        id,
        name,
        workoutsheetOrder,
        idClient,
        idCompany,
        isActive,
        workoutClient (
          id,
          workoutOrder,
          breakTime,
          series,
          workout: workout!inner (
            id,
            title,
            subTitle,
            description,
            isActive,
            workoutMedia: workoutMedia!inner (
              mediaOrder,
              media: media!inner (
                id,
                title,
                fileFormat,
                type,
                url,
                thumbnailUrl
              )
            )
          )
        )
      )
    `,
        )
        .eq('workoutSheet.idClient', user.clientId)
        .eq('workoutSheet.idCompany', user.clientIdCompany)
        .eq('workoutSheet.isActive', true)
        .gt('date', tenDaysAgo)
        .order('date', { ascending: true });

      if (error) throw error;

      const result: any[] = [];

      for (const raw of (data as any[]) || []) {
        const wsd = raw as any;
        const ws = wsd.workoutSheet as any | null;

        // Se não vier workoutSheet ou se ws for null, pula
        if (!ws) continue;

        const wsdDate = wsd.date;
        const clients = Array.isArray(ws.workoutClient) ? ws.workoutClient : [];

        for (const wc of clients as any[]) {
          const w = wc.workout as any | null;
          const medias = Array.isArray(w?.workoutMedia) ? w.workoutMedia : [];

          // Base do objeto comum
          const base = {
            workoutSheetId: ws.id,
            workoutSheetName: ws.name,
            workoutSheedConclusionDate: wsdDate,
            workoutSheetOrder: ws.workoutsheetOrder,
            workoutId: wc.id,
            workoutTitle: w?.title ?? '',
            workoutSubtitle: w?.subTitle ?? '',
            workoutDescription: w?.description ?? '',
            workoutOrder: wc.workoutOrder,
            workoutBreakTime: wc.breakTime ?? '',
            workoutSeries: wc.series ?? '',
          };

          if (medias.length === 0) {
            // result.push({
            //   ...base,
            //   mediaId: null,
            //   mediaTitle: null,
            //   mediaFormat: null,
            //   mediaType: null,
            //   mediaUrl: null,
            //   thumbnailUrl: null,
            //   mediaOrder: null,
            // });
          } else {
            for (const mw of medias) {
              const m = mw.media as any;
              result.push({
                ...base,
                mediaId: m.id,
                mediaTitle: m.title,
                mediaFormat: m.fileFormat,
                mediaType: m.type,
                mediaUrl: m.url,
                thumbnailUrl: m.thumbnailUrl,
                mediaOrder: mw.mediaOrder,
              });
            }
          }
        }
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getAllMyCurrentWorkoutSheetsWithWorkouts(
    user: AccessTokenModel,
  ): Promise<any> {
    try {
      // const query = `
      //     SELECT ws.id                as workoutSheetId,
      //            ws.name              as workoutSheetName,
      //            ws.workoutsheetOrder as workoutSheetOrder,
      //
      //            wc.id                as workoutId,
      //            wc.title             as workoutTitle,
      //            wc.subTitle          as workoutSubtitle,
      //            wc.description       as workoutDescription,
      //            wc.workoutOrder      as workoutOrder,
      //            wc.breakTime         as workoutBreakTime,
      //            wc.series            as workoutSeries,
      //
      //            m.id                 as mediaId,
      //            m.title              as mediaTitle,
      //            m.fileFormat         as mediaFormat,
      //            m.type               as mediaType,
      //            m.url                as mediaUrl,
      //            m.thumbnailUrl       as thumbnailUrl,
      //            wm.mediaOrder        as mediaOrder
      //     FROM workoutSheet ws
      //
      //              LEFT JOIN workoutSheetDone wsd on wsd.idWorkoutSheet = ws.id
      //              LEFT JOIN workoutClient wc on ws.id = wc.idWorkoutSheet
      //              INNER JOIN workout w on wc.idWorkout = w.id
      //              LEFT JOIN workoutMedia wm on w.id = wm.idWorkout
      //              LEFT JOIN media m on wm.idMedia = m.id
      //
      //
      //     WHERE ws.idClient = '${user.clientId}'
      //       AND ws.idCompany = '${user.clientIdCompany}'
      //       AND ws.isActive = 1
      //     ORDER BY ws.workoutsheetOrder, wc.workoutOrder;
      // `;
      //
      // return await this.databaseService.execute(query);
      // 1) Busca tudo, apenas ordenando pelo workoutsheetOrder no servidor
      const { data, error } = await this.supabase
        .from('workoutSheet')
        .select(
          `
        id,
        name,
        workoutsheetOrder,
        workoutClient (
          id,
          title,
          subtitle,
          description,
          workoutOrder,
          breakTime,
          series,
          workout: workout (
            workoutMedia (
              mediaOrder,
              media (id, title, fileFormat, type, url, thumbnailUrl)
            )
          )
        )
      `,
        )
        .eq('idClient', user.clientId)
        .eq('idCompany', user.clientIdCompany)
        .eq('isActive', true)
        .order('workoutsheetOrder', { ascending: true });

      if (error) throw error;

      const result: any[] = [];

      // 2) No cliente, ordenamos pelo workoutOrder em JS e construímos o flat
      for (const raw of (data as any[]) || []) {
        const ws: any = raw;
        const clients: any[] = Array.isArray(ws.workoutClient)
          ? ws.workoutClient
          : [];

        // ordena em-memory pelo campo workoutOrder
        clients.sort((a, b) => (a.workoutOrder ?? 0) - (b.workoutOrder ?? 0));

        for (const wc of clients) {
          const w = wc.workout as any;
          const medias = Array.isArray(w?.workoutMedia) ? w.workoutMedia : [];

          // base comum
          const base = {
            workoutSheetId: ws.id,
            workoutSheetName: ws.name,
            workoutSheetOrder: ws.workoutsheetOrder,
            workoutId: wc.id,
            workoutTitle: wc.title ?? '',
            workoutSubtitle: wc.subtitle ?? '',
            workoutDescription: wc.description ?? '',
            workoutOrder: wc.workoutOrder,
            workoutBreakTime: wc.breakTime ?? '',
            workoutSeries: wc.series ?? '',
          };

          if (medias.length === 0) {
            // result.push({
            //   ...base,
            //   mediaId: null,
            //   mediaTitle: null,
            //   mediaFormat: null,
            //   mediaType: null,
            //   mediaUrl: null,
            //   thumbnailUrl: null,
            //   mediaOrder: null,
            // });
          } else {
            for (const mw of medias) {
              const m: any = mw.media;
              result.push({
                ...base,
                mediaId: m.id,
                mediaTitle: m.title,
                mediaFormat: m.fileFormat,
                mediaType: m.type,
                mediaUrl: m.url,
                thumbnailUrl: m.thumbnailUrl,
                mediaOrder: mw.mediaOrder,
              });
            }
          }
        }
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getUrlMediasForSync(user: AccessTokenModel): Promise<any> {
    try {
      // const query = `SELECT m.id,
      //                       m.url,
      //                       m.type,
      //                       m.thumbnailUrl
      //
      //                FROM workoutSheet ws
      //
      //                         INNER JOIN workoutClient wc on ws.id = wc.idWorkoutSheet
      //                         INNER JOIN workout w on wc.idWorkout = w.id
      //                         INNER JOIN workoutMedia wm on w.id = wm.idWorkout
      //                         INNER JOIN media m on wm.idMedia = m.id
      //                WHERE ws.idClient = '${user.clientId}'
      //                  AND ws.idCompany = '${user.clientIdCompany}'
      //                  AND ws.isActive = 1`;
      //
      // return await this.databaseService.execute(query);

      // Supabase: consultar em cadeia de relacionamentos e coletar URLs
      const { data, error } = await this.supabase
        .from('workoutSheet')
        .select(
          `
        workoutClient (
          workout (
            workoutMedia (
              media (id, url, type, thumbnailUrl)
            )
          )
        )
      `,
        )
        .eq('idClient', user.clientId)
        .eq('idCompany', user.clientIdCompany)
        .eq('isActive', true);

      if (error) throw error;

      // Flatten media de todos os níveis
      const urls: any[] = [];
      ((data as any[]) || []).forEach((raw) => {
        const ws: any = raw;
        const clients: any[] = ws.workoutClient || [];
        clients.forEach((wcRaw) => {
          const wc: any = wcRaw;
          const w = wc.workout as any;
          const medias: any[] = (w.workoutMedia as any[]) || [];
          medias.forEach((mw) => {
            const m: any = mw.media;
            urls.push({
              id: m.id,
              url: m.url,
              type: m.type,
              thumbnailUrl: m.thumbnailUrl,
            });
          });
        });
      });

      return urls;
    } catch (error) {
      throw error;
    }
  }

  async workoutSheetDone(idWorkoutsheet: string, idCompany: string) {
    try {
      // const query = `
      //     INSERT INTO workoutSheetDone
      //     (idWorkoutSheet,
      //      idCompany,
      //      date)
      //     VALUES (?, ?, ?);`;
      //
      // return await this.databaseService.execute(query, [idWorkoutsheet, idCompany, convertDateToTimestamp(new Date())]);
      const ts = convertDateToTimestamp(new Date());

      const { error } = await this.supabase.from('workoutSheetDone').insert([
        {
          idWorkoutSheet: idWorkoutsheet,
          idCompany: idCompany,
          date: ts,
        },
      ]);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async createWorkoutsheetFeedback(
    feedback: string,
    idWorkoutsheet: string,
  ): Promise<void> {
    try {
      // const query = `
      //     INSERT INTO workoutSheetFeedback
      //     (feedback,
      //      idWorkoutsheet)
      //     VALUES ('${feedback}',
      //             '${idWorkoutsheet}');`;
      //
      // await this.databaseService.execute(query);
      const { error } = await this.supabase
        .from('workoutSheetFeedback')
        .insert([
          {
            feedback,
            idWorkoutsheet,
          },
        ]);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async deleteWorkoutsheetByIdWorkoutsheetDefaultList(
    idWorkoutSheetDefaultList: string[],
    idClient: string,
    idCompany: string,
  ): Promise<void> {
    try {
      // const params = idWorkoutSheetDefaultList.map((item) => `'${item}'`).join(',');
      //
      // await this.databaseService.execute(
      //   `delete
      //    from workoutSheet
      //    WHERE idClient = ?
      //      AND idCompany = ?
      //      AND idWorkoutsheetDefault IN (${params})`,
      //   [idClient, idCompany],
      // );
      const { error } = await this.supabase
        .from('workoutSheet')
        .delete()
        .eq('idClient', idClient)
        .eq('idCompany', idCompany)
        .in('idWorkoutsheetDefault', idWorkoutSheetDefaultList);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }
}
