import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateWorkoutDto } from '../dto/create-workout.dto';
import { UpdateWorkoutDto } from '../dto/update-workout.dto';
import { CreateWorkoutMediaDto } from '../dto/create-workout-media.dto';
import { CreateWorkoutClientDto } from '../dto/create-workout-client.dto';
import { UpdateWorkoutClientDto } from '../dto/update-workout-client.dto';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class WorkoutRepository {
  constructor(
    private databaseService: DatabaseService,
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async create(workout: CreateWorkoutDto): Promise<void> {
    try {
      // const createQuery = 'insert into workout (title, subTitle, description, idCompany) values (?,?,?,?);';
      //
      // await this.databaseService.execute(createQuery, [
      //   workout.title,
      //   workout.subtitle,
      //   workout.description,
      //   workout.idCompany,
      // ]);
      const { error } = await this.supabase.from('workout').insert([
        {
          title: workout.title,
          subTitle: workout.subtitle,
          description: workout.description,
          idCompany: workout.idCompany,
        },
      ]);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async createWorkoutClient(
    workoutClientDto: CreateWorkoutClientDto,
  ): Promise<void> {
    try {
      // const createQuery =
      //   'insert into workoutClient (title, subTitle, description, idCompany, idWorkout, breakTime, series, workoutOrder, idWorkoutsheet) values (?,?,?,?,?,?,?,?,?);';
      //
      // await this.databaseService.execute(createQuery, [
      //   workoutClientDto.title,
      //   workoutClientDto.subtitle,
      //   workoutClientDto.description,
      //   workoutClientDto.idCompany,
      //   workoutClientDto.idWorkout,
      //   workoutClientDto.breakTime,
      //   workoutClientDto.series,
      //   workoutClientDto.workoutOrder,
      //   workoutClientDto.idWorkoutsheet,
      // ]);
      const { error } = await this.supabase.from('workoutClient').insert([
        {
          title: workoutClientDto.title,
          subTitle: workoutClientDto.subtitle,
          description: workoutClientDto.description,
          idCompany: workoutClientDto.idCompany,
          idWorkout: workoutClientDto.idWorkout,
          breakTime: workoutClientDto.breakTime,
          series: workoutClientDto.series,
          workoutOrder: workoutClientDto.workoutOrder,
          idWorkoutsheet: workoutClientDto.idWorkoutsheet,
        },
      ]);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async updateWorkoutClient(
    workoutClientDto: UpdateWorkoutClientDto,
  ): Promise<void> {
    try {
      // const createQuery = `update workoutClient
      //                      set title       = ?,
      //                          subTitle    = ?,
      //                          description = ?,
      //                          breakTime   = ?,
      //                          series      = ?
      //                      where id = ?; `;
      //
      // await this.databaseService.execute(createQuery, [
      //   workoutClientDto.title,
      //   workoutClientDto.subtitle,
      //   workoutClientDto.description,
      //   workoutClientDto.breakTime,
      //   workoutClientDto.series,
      //   workoutClientDto.id,
      // ]);
      const { error } = await this.supabase
        .from('workoutClient')
        .update({
          title: workoutClientDto.title,
          subTitle: workoutClientDto.subtitle,
          description: workoutClientDto.description,
          breakTime: workoutClientDto.breakTime,
          series: workoutClientDto.series,
        })
        .eq('id', workoutClientDto.id);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async createWorkoutMedia(
    workoutMediaList: CreateWorkoutMediaDto[],
    idWorkout: string,
    idCompany: string,
  ): Promise<void> {
    try {
      // const params = workoutMediaList
      //   .map((item) => `('${idWorkout}', '${idCompany}', '${item.id}', ${item.mediaOrder})`)
      //   .join(',');
      //
      // const query = `
      //     insert into workoutMedia
      //         (idWorkout, idCompany, idMedia, mediaOrder)
      //     values ${params};
      // `;
      //
      // await this.databaseService.execute(query);
      const records = workoutMediaList.map((item) => ({
        idWorkout,
        idCompany,
        idMedia: item.id,
        mediaOrder: item.mediaOrder,
      }));

      const { error } = await this.supabase
        .from('workoutMedia')
        .insert(records);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async findLastInserted(workout: CreateWorkoutDto): Promise<any> {
    try {
      // return this.databaseService.execute(
      //   `SELECT *
      //    FROM workout
      //    WHERE idCompany = '${workout.idCompany}'
      //      AND title = '${workout.title}'
      //      AND subTitle = '${workout.subtitle}'
      //      AND description = '${workout.description}'
      //      and isActive = true
      //    order by lastUpdate desc limit 1`,
      // );
      const { data, error } = await this.supabase
        .from('workout')
        .select('*')
        .eq('idCompany', workout.idCompany)
        .eq('title', workout.title)
        .eq('subTitle', workout.subtitle)
        .eq('description', workout.description)
        .eq('isActive', true)
        .order('lastUpdate', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async update(workout: UpdateWorkoutDto): Promise<void> {
    try {
      // await this.databaseService.execute('UPDATE workout SET title = ?, subTitle = ?, description = ?  WHERE id = ?', [
      //   workout.title,
      //   workout.subtitle,
      //   workout.description,
      //   workout.id,
      // ]);
      const { error } = await this.supabase
        .from('workout')
        .update({
          title: workout.title,
          subTitle: workout.subtitle,
          description: workout.description,
        })
        .eq('id', workout.id);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async findAll(idCompany: string): Promise<any> {
    try {
      // return this.databaseService.execute(
      //   `SELECT *
      //    FROM workout
      //    WHERE idCompany = '${idCompany}'
      //      and isActive = true`,
      // );
      const { data, error } = await this.supabase
        .from('workout')
        .select('*')
        .eq('idCompany', idCompany)
        .eq('isActive', true);

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async findManyWorkoutByIdWorkout(idWorkoutList: string[]): Promise<any> {
    try {
      // const params = idWorkoutList.map((item) => `'${item}'`).join(',');
      // return this.databaseService.execute(
      //   `SELECT *
      //    FROM workout
      //    WHERE id in (${params})
      //      and isActive = true`,
      // );
      const { data, error } = await this.supabase
        .from('workout')
        .select('*')
        .in('id', idWorkoutList)
        .eq('isActive', true);

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async findManyWorkoutByIdWorkoutsheetList(
    idWorkoutsheetList: string[],
  ): Promise<any> {
    try {
      // const params = idWorkoutsheetList.map((item) => `'${item}'`).join(',');
      //
      // return this.databaseService.execute(
      //   `select *
      //    from workout w
      //             inner join workoutSheetDefaultWorkout ws
      //                        on w.id = ws.idWorkout
      //    where ws.idWorkoutSheetDefault in (${params})
      //      and w.isActive = true
      //    order by ws.idWorkoutSheetDefault, ws.workoutOrder;`,
      // );

      // Efetuamos a query na tabela de relacionamento, trazendo o workout aninhado
      const { data, error } = await this.supabase
        .from('workoutSheetDefaultWorkout')
        .select(`*, workout: workout ( * )`)
        .in('idWorkoutSheetDefault', idWorkoutsheetList)
        .order('idWorkoutSheetDefault', { ascending: true })
        .order('workoutOrder', { ascending: true });

      if (error) throw error;

      // Retornamos apenas os objetos workout
      return (data || []).map((rec: any) => ({
        ...rec,
        ...rec.workout,
        workout: undefined, // remove o objeto original se quiser
      }));
    } catch (error) {
      throw error;
    }
  }

  async findWorkoutClientByWorkoutsheet(
    workoutsheetList: string[],
  ): Promise<any> {
    try {
      // const params = workoutsheetList.map((item) => `'${item}'`).join(',');
      //
      // const query = `
      //     select w.*
      //     from workoutClient w
      //     where w.idWorkoutsheet in (${params})
      //       and w.isActive = true
      //     order by w.idWorkoutSheet, w.idWorkoutSheet, w.workoutOrder`;
      //
      // return this.databaseService.execute(query);

      const { data, error } = await this.supabase
        .from('workoutClient')
        .select('*')
        .in('idWorkoutSheet', workoutsheetList)
        .eq('isActive', true)
        .order('idWorkoutSheet', { ascending: true })
        .order('workoutOrder', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async findAllWorkoutMedia(idCompany: string): Promise<any> {
    try {
      // return this.databaseService.execute(
      //   `SELECT *
      //    FROM workoutMedia
      //    WHERE idCompany = '${idCompany}'
      //    order by idWorkout, mediaOrder`,
      // );
      const { data, error } = await this.supabase
        .from('workoutMedia')
        .select('*')
        .eq('idCompany', idCompany)
        .order('idWorkout', { ascending: true })
        .order('mediaOrder', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async findManyWorkoutMediaByIdWorkoutList(
    idWorkoutList: string[],
    idCompany: string,
  ): Promise<any> {
    try {
      // const params = idWorkoutList.map((item) => `'${item}'`).join(',');
      //
      // return this.databaseService.execute(
      //   `SELECT *
      //    FROM workoutMedia
      //    WHERE idWorkout in (${params})
      //      and idCompany = '${idCompany}'`,
      // );
      const { data, error } = await this.supabase
        .from('workoutMedia')
        .select('*')
        .in('idWorkout', idWorkoutList)
        .eq('idCompany', idCompany);

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async findManyMediaByIdWorkout(idWorkoutList: string[], idCompany: string) {
    // const params = idWorkoutList.map((item) => `'${item}'`).join(',');
    //
    // const rows = await this.databaseService.execute(
    //   `SELECT m.*, w.idWorkout, w.mediaOrder
    //    FROM media m
    //             inner join workoutMedia w
    //                        on m.id = w.idMedia and
    //                           w.idWorkout in (${params}) and
    //                           m.idCompany = w.idCompany
    //    where m.idCompany = ?
    //    order by w.mediaOrder`,
    //   [idCompany],
    // );
    // return rows;
    const { data, error } = await this.supabase
      .from('media')
      .select(`*, workoutMedia (idWorkout, mediaOrder)`)
      // filtra pelo relacionamento
      .in('workoutMedia.idWorkout', idWorkoutList)
      .eq('idCompany', idCompany)
      // ordena pelo campo “plano” mediaOrder na tabela workoutMedia
      .order('mediaOrder', { foreignTable: 'workoutMedia', ascending: true });

    if (error) throw error;

    // Achatar relacionamento para retornar como no SQL original
    return (data || []).map((m) => {
      const wm = m.workoutMedia?.[0] ?? { idWorkout: null, mediaOrder: null };
      return {
        ...m,
        idWorkout: wm.idWorkout,
        mediaOrder: wm.mediaOrder,
      };
    });
  }

  async deleteById(idWorkout: string): Promise<void> {
    try {
      // await this.databaseService.execute('DELETE FROM workout WHERE id = ?', [idWorkout]);
      const { error } = await this.supabase
        .from('workout')
        .delete()
        .eq('id', idWorkout);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async deleteWorkoutClientById(idWorkoutClient: string): Promise<void> {
    try {
      // await this.databaseService.execute('DELETE FROM workoutClient WHERE id = ?', [idWorkoutClient]);
      const { error } = await this.supabase
        .from('workoutClient')
        .delete()
        .eq('id', idWorkoutClient);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async deleteWorkoutMedia(idWorkout: string): Promise<void> {
    try {
      // await this.databaseService.execute('DELETE FROM workoutMedia WHERE idWorkout = ?', [idWorkout]);
      const { error } = await this.supabase
        .from('workoutMedia')
        .delete()
        .eq('idWorkout', idWorkout);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async createFeedback(
    idWorkoutClient: string,
    idCompany: string,
    feedback: string,
  ): Promise<void> {
    try {
      // const querie = 'insert into workoutFeedback (feedback, idWorkoutClient, idCompany) values (?,?,?);';
      //
      // await this.databaseService.execute(querie, [feedback, idWorkoutClient, idCompany]);
      const { error } = await this.supabase.from('workoutFeedback').insert([
        {
          feedback,
          idWorkoutClient,
          idCompany,
        },
      ]);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }
}
