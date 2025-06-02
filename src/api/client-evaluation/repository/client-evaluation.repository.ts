import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateClientEvaluationDto } from '../dto/create-client-evaluation.dto';

import { MusclePerimeterDto } from '../dto/muscle-perimeter.dto';
import { MuscoloskeletalChangesDto } from '../dto/muscoloskeletal-change.dto';
import { CreateClientEvaluationPhotoDto } from '../dto/create-client-evaluation-photo.dto';
import { ClientEvaluationPhotoDto } from '../dto/client-evaluation-photo.dto';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class ClientEvaluationRepository {
  constructor(
    private databaseService: DatabaseService,
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async createClientEvaluation(clientEvaluation: CreateClientEvaluationDto): Promise<any> {
    // await this.databaseService.execute(
    //   'INSERT INTO clientEvaluation (idClient, idCompany, date) VALUES (?, ?, now())',
    //   [clientEvaluation.idClient, clientEvaluation.idCompany],
    // );
    //
    // const row = await this.databaseService.execute(
    //   'SELECT ce.id idClientEvaluation, ce.* FROM clientEvaluation ce WHERE ce.idClient = ? and ce.idCompany = ? order by ce.lastUpdate desc;',
    //   [clientEvaluation.idClient, clientEvaluation.idCompany],
    // );
    //
    // return row[0];
    const { data: inserted, error: insertError } = await this.supabase
      .from('clientEvaluation')
      .insert([
        {
          idClient: clientEvaluation.idClient,
          idCompany: clientEvaluation.idCompany,
          date: new Date().toISOString(),
        },
      ])
      .select('*') // ← ask for every column
      .single();

    if (insertError) throw insertError;
    return inserted;
  }

  async createClientEvaluationPhoto(clientEvaluationPhoto: CreateClientEvaluationPhotoDto): Promise<void> {
    try {
      // await this.databaseService.execute(
      //   `INSERT INTO clientEvaluationPhoto
      //    (idClientEvaluation, idCompany, date, url, fileName)
      //    VALUES (?, ?, now(), ?, ?)`,
      //   [
      //     clientEvaluationPhoto.idClientEvaluation,
      //     clientEvaluationPhoto.idCompany,
      //     clientEvaluationPhoto.url,
      //     clientEvaluationPhoto.fileName,
      //   ],
      // );
      const { error } = await this.supabase.from('clientEvaluationPhoto').insert([
        {
          idClientEvaluation: clientEvaluationPhoto.idClientEvaluation,
          idCompany: clientEvaluationPhoto.idCompany,
          date: new Date().toISOString(),
          url: clientEvaluationPhoto.url,
          fileName: clientEvaluationPhoto.fileName,
        },
      ]);

      if (error) throw error;
    } catch (error) {
      throw new Error(`Erro ao inserir foto da avaliação do cliente: ${error}`);
    }
  }

  async deleteClientEvaluation(idCompany: string, clientEvaluationId: string): Promise<void> {
    try {
      // await this.databaseService.execute(
      //   `DELETE
      //    from clientEvaluation
      //    where id = ?
      //      and idCompany = ?`,
      //   [clientEvaluationId, idCompany],
      // );
      const { error } = await this.supabase
        .from('clientEvaluation')
        .delete()
        .eq('id', clientEvaluationId)
        .eq('idCompany', idCompany);

      if (error) throw error;
    } catch (error) {
      throw new Error(`Erro ao deletar foto da avaliação do cliente: ${error}`);
    }
  }

  async deleteClientEvaluationPhoto(clientEvaluationPhoto: ClientEvaluationPhotoDto): Promise<void> {
    try {
      // await this.databaseService.execute(
      //   `DELETE
      //    from clientEvaluationPhoto
      //    where id = ?
      //      and idCompany = ?
      //      and idClientEvaluation = ?`,
      //   [clientEvaluationPhoto.id, clientEvaluationPhoto.idCompany, clientEvaluationPhoto.idClientEvaluation],
      // );
      const { error } = await this.supabase
        .from('clientEvaluationPhoto')
        .delete()
        .eq('id', clientEvaluationPhoto.id)
        .eq('idCompany', clientEvaluationPhoto.idCompany)
        .eq('idClientEvaluation', clientEvaluationPhoto.idClientEvaluation);

      if (error) throw error;
    } catch (error) {
      throw new Error(`Erro ao deletar foto da avaliação do cliente: ${error}`);
    }
  }

  async deleteAllClientEvaluationPhoto(idCompany: string, idClientEvaluation: string): Promise<void> {
    try {
      // await this.databaseService.execute(
      //   `DELETE
      //    from clientEvaluationPhoto
      //    where idCompany = ?
      //      and idClientEvaluation = ?`,
      //   [idCompany, idClientEvaluation],
      // );
      const { error } = await this.supabase
        .from('clientEvaluationPhoto')
        .delete()
        .eq('idCompany', idCompany)
        .eq('idClientEvaluation', idClientEvaluation);

      if (error) throw error;
    } catch (error) {
      throw new Error(`Erro ao deletar todas as fotos da avaliação do cliente: ${error}`);
    }
  }

  async createMusclePerimeter(
    idClientEvaluation: string,
    idCompany: string,
    musclePerimeterDto: MusclePerimeterDto,
  ): Promise<void> {
    try {
      // const keys = Object.keys(musclePerimeterDto);
      // const values = Object.values(musclePerimeterDto);
      // const columns = keys.join(', ');
      // const placeholders = new Array(keys.length + 2).fill('?').join(', ');
      //
      // const query = `
      //     INSERT INTO musclePerimeter (idClientEvaluation,
      //                                  idCompany,
      //                                  ${columns})
      //     VALUES (${placeholders})
      // `;
      //
      // await this.databaseService.execute(query, [idClientEvaluation, idCompany, ...values]);

      // 1) extrai `id` e guarda o resto em `fields`
      const { id, ...fields } = musclePerimeterDto;

      // 2) monta o objeto sem o `id`
      const record = {
        idClientEvaluation,
        idCompany,
        ...Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v === '' ? null : v])),
      };

      const { error } = await this.supabase.from('musclePerimeter').insert([record]);

      if (error) throw error;
    } catch (error) {
      throw new Error(`Erro createMusclePerimeter: ${error}`);
    }
  }

  async updateMusclePerimeter(
    idClientEvaluation: string,
    idCompany: string,
    musclePerimeterDto: MusclePerimeterDto,
  ): Promise<void> {
    try {
      // const keys = Object.keys(musclePerimeterDto).filter((key) => key !== 'id');
      // const values = Object.values(musclePerimeterDto).filter((key) => key !== musclePerimeterDto.id);
      //
      // const columnsToUpdate = keys.map((key) => `${key} = ?`).join(', ');
      //
      // const query = `
      //     UPDATE musclePerimeter
      //     SET ${columnsToUpdate}
      //     WHERE id = ?
      //       AND idCompany = ?
      // `;
      //
      // // Adiciona idClientEvaluation e idCompany ao final do array de valores
      // await this.databaseService.execute(query, [...values, musclePerimeterDto.id, idCompany]);
      // Supabase
      // Prepara objeto com todos os campos, exceto id e idCompany
      const { id, ...rest } = musclePerimeterDto;
      const updateFields = { ...rest };

      const { error } = await this.supabase
        .from('musclePerimeter')
        .update(updateFields)
        .eq('id', id)
        .eq('idCompany', idCompany);

      if (error) throw error;
    } catch (error) {
      throw new Error(`Erro updateMusclePerimeter: ${error}`);
    }
  }

  async createMuscoloskeletalChange(
    idClientEvaluation: string,
    idCompany: string,
    muscoloskeletalChanges: MuscoloskeletalChangesDto,
  ): Promise<void> {
    try {
      // const keys = Object.keys(muscoloskeletalChanges);
      // const values = Object.values(muscoloskeletalChanges);
      //
      // const columns = keys.join(', ');
      // const placeholders = new Array(keys.length + 2).fill('?').join(', ');
      //
      // const query = `
      //     INSERT INTO muscoloskeletalChange (idClientEvaluation,
      //                                        idCompany,
      //                                        ${columns})
      //     VALUES (${placeholders})
      // `;
      //
      // await this.databaseService.execute(query, [idClientEvaluation, idCompany, ...values]);
      // 1) separar id do DTO
      const { id, ...fields } = muscoloskeletalChanges;

      // 2) montar record sem id e trocando '' por null
      const record = {
        idClientEvaluation,
        idCompany,
        ...Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v === '' ? null : v])),
      };

      const { error } = await this.supabase.from('muscoloskeletalChange').insert([record]);

      if (error) throw error;
    } catch (error) {
      throw new Error(`Erro createMuscoloskeletalChange: ${error}`);
    }
  }

  async updateMuscoloskeletalChange(
    idClientEvaluation: string,
    idCompany: string,
    muscoloskeletalChanges: MuscoloskeletalChangesDto,
  ): Promise<void> {
    try {
      // const keys = Object.keys(muscoloskeletalChanges).filter((key) => key !== 'id');
      // const values = Object.values(muscoloskeletalChanges).filter((key) => key !== muscoloskeletalChanges.id);
      //
      // const columnsToUpdate = keys.map((key) => `${key} = ?`).join(', ');
      //
      // const query = `
      //     UPDATE muscoloskeletalChange
      //     SET ${columnsToUpdate}
      //     WHERE id = ?
      //       AND idCompany = ?
      // `;
      //
      // // Adiciona idClientEvaluation e idCompany ao final do array de valores
      // await this.databaseService.execute(query, [...values, muscoloskeletalChanges.id, idCompany]);

      // Supabase: atualiza apenas os campos enviados (exceto id e idCompany)
      const { id, ...rest } = muscoloskeletalChanges;
      const updateFields = { ...rest };

      const { error } = await this.supabase
        .from('muscoloskeletalChange')
        .update(updateFields)
        .eq('id', id)
        .eq('idCompany', idCompany);

      if (error) throw error;
    } catch (error) {
      throw new Error(`Erro updateMuscoloskeletalChange: ${error}`);
    }
  }

  async findAllByClientAndCompany(idClient: string, idCompany: string): Promise<any> {
    // const rows = await this.databaseService.execute(
    //   `SELECT ce.id  idClientEvaluation,
    //           ce.date,
    //           ce.idClient,
    //           ce.idCompany,
    //           mp.id  idMusclePerimeter,
    //           mp.weight,
    //           mp.height,
    //           mp.neck,
    //           mp.shoulder,
    //           mp.rightForearm,
    //           mp.leftForearm,
    //           mp.chest,
    //           mp.leftArm,
    //           mp.rightArm,
    //           mp.waist,
    //           mp.abdome,
    //           mp.hip,
    //           mp.breeches,
    //           mp.leftThigh,
    //           mp.rightThigh,
    //           mp.leftCalf,
    //           mp.rightCalf,
    //           mc.id  idMucolosckeletalChanges,
    //           mc.head,
    //           mc.spine,
    //           mc.sholderBlades,
    //           mc.shoulders,
    //           mc.pelvis,
    //           mc.knees,
    //           mc.shins,
    //           mc.feet,
    //           cep.id idClientEvaluationPhoto,
    //           cep.url,
    //           cep.fileName
    //    from clientEvaluation ce
    //             inner join musclePerimeter mp
    //                        on mp.idClientEvaluation = ce.id and mp.isActive = 1
    //             inner join muscoloskeletalChange mc
    //                        on mc.idClientEvaluation = ce.id and mc.isActive = 1
    //             left join clientEvaluationPhoto cep
    //                       on cep.idClientEvaluation = ce.id and cep.isActive = 1
    //    where ce.idCompany = ?
    //      and ce.idClient = ?
    //      and ce.isActive = 1
    //    order by ce.date desc`,
    //   [idCompany, idClient],
    // );
    // return rows;
    const { data, error } = await this.supabase
      .from('clientEvaluation')
      .select(
        `
      id,
      date,
      idClient,
      idCompany,
      musclePerimeter (
        id,
        weight,
        height,
        neck,
        shoulder,
        rightForearm,
        leftForearm,
        chest,
        leftArm,
        rightArm,
        waist,
        abdome,
        hip,
        breeches,
        leftThigh,
        rightThigh,
        leftCalf,
        rightCalf
      ),
      muscoloskeletalChange (
        id,
        head,
        spine,
        sholderBlades,
        shoulders,
        pelvis,
        knees,
        shins,
        feet
      ),
      clientEvaluationPhoto (
        id,
        url,
        fileName
      )
    `,
      )
      .eq('idCompany', idCompany)
      .eq('idClient', idClient)
      .eq('isActive', true)
      .order('date', { ascending: false });

    if (error) throw error;

    return (data || []).map((ce: any) => ({
      id: ce.id,
      date: ce.date,
      idClient: ce.idClient,
      idCompany: ce.idCompany,

      // flatten musclePerimeter[0]
      idMusclePerimeter: ce.musclePerimeter?.[0]?.id ?? null,
      weight: ce.musclePerimeter?.[0]?.weight,
      height: ce.musclePerimeter?.[0]?.height,
      neck: ce.musclePerimeter?.[0]?.neck,
      shoulder: ce.musclePerimeter?.[0]?.shoulder,
      rightForearm: ce.musclePerimeter?.[0]?.rightForearm,
      leftForearm: ce.musclePerimeter?.[0]?.leftForearm,
      chest: ce.musclePerimeter?.[0]?.chest,
      leftArm: ce.musclePerimeter?.[0]?.leftArm,
      rightArm: ce.musclePerimeter?.[0]?.rightArm,
      waist: ce.musclePerimeter?.[0]?.waist,
      abdome: ce.musclePerimeter?.[0]?.abdome,
      hip: ce.musclePerimeter?.[0]?.hip,
      breeches: ce.musclePerimeter?.[0]?.breeches,
      leftThigh: ce.musclePerimeter?.[0]?.leftThigh,
      rightThigh: ce.musclePerimeter?.[0]?.rightThigh,
      leftCalf: ce.musclePerimeter?.[0]?.leftCalf,
      rightCalf: ce.musclePerimeter?.[0]?.rightCalf,

      // flatten muscoloskeletalChange[0]
      idMucoloskeletalChanges: ce.muscoloskeletalChange?.[0]?.id ?? null,
      head: ce.muscoloskeletalChange?.[0]?.head,
      spine: ce.muscoloskeletalChange?.[0]?.spine,
      sholderBlades: ce.muscoloskeletalChange?.[0]?.sholderBlades,
      shoulders: ce.muscoloskeletalChange?.[0]?.shoulders,
      pelvis: ce.muscoloskeletalChange?.[0]?.pelvis,
      knees: ce.muscoloskeletalChange?.[0]?.knees,
      shins: ce.muscoloskeletalChange?.[0]?.shins,
      feet: ce.muscoloskeletalChange?.[0]?.feet,

      // photos (one-to-many)
      clientEvaluationPhoto: (ce.clientEvaluationPhoto || []).map((p: any) => ({
        idClientEvaluationPhoto: p.id,
        url: p.url,
        fileName: p.fileName,
      })),
    }));
  }

  async findOne(idCompany: string, idClientEvaluation: string): Promise<any> {
    // const rows = await this.databaseService.execute(
    //   `SELECT ce.id  idClientEvaluation,
    //           ce.date,
    //           ce.idClient,
    //           ce.idCompany,
    //           mp.id  idMusclePerimeter,
    //           mp.weight,
    //           mp.height,
    //           mp.neck,
    //           mp.shoulder,
    //           mp.rightForearm,
    //           mp.leftForearm,
    //           mp.chest,
    //           mp.leftArm,
    //           mp.rightArm,
    //           mp.waist,
    //           mp.abdome,
    //           mp.hip,
    //           mp.breeches,
    //           mp.leftThigh,
    //           mp.rightThigh,
    //           mp.leftCalf,
    //           mp.rightCalf,
    //           mc.id  idMucolosckeletalChanges,
    //           mc.head,
    //           mc.spine,
    //           mc.sholderBlades,
    //           mc.shoulders,
    //           mc.pelvis,
    //           mc.knees,
    //           mc.shins,
    //           mc.feet,
    //           cep.id idClientEvaluationPhoto,
    //           cep.url,
    //           cep.fileName
    //    from clientEvaluation ce
    //             inner join musclePerimeter mp
    //                        on mp.idClientEvaluation = ce.id and mp.isActive = 1
    //             inner join muscoloskeletalChange mc
    //                        on mc.idClientEvaluation = ce.id and mc.isActive = 1
    //             left join clientEvaluationPhoto cep
    //                       on cep.idClientEvaluation = ce.id and cep.isActive = 1
    //    where ce.idCompany = ?
    //      and ce.id = ?
    //      and ce.isActive = 1
    //    order by ce.date desc`,
    //   [idCompany, idClientEvaluation],
    // );
    // return rows;

    const { data, error } = await this.supabase
      .from('clientEvaluation')
      .select(
        `
      id: idClientEvaluation,
      date,
      idClient,
      idCompany,
      musclePerimeter (
        id: idMusclePerimeter,
        weight,
        height,
        neck,
        shoulder,
        rightForearm,
        leftForearm,
        chest,
        leftArm,
        rightArm,
        waist,
        abdome,
        hip,
        breeches,
        leftThigh,
        rightThigh,
        leftCalf,
        rightCalf
      ),
      muscoloskeletalChange (
        id: idMucolosckeletalChanges,
        head,
        spine,
        sholderBlades,
        shoulders,
        pelvis,
        knees,
        shins,
        feet
      ),
      clientEvaluationPhoto (
        id: idClientEvaluationPhoto,
        url,
        fileName
      )
    `,
      )
      .eq('idCompany', idCompany)
      .eq('id', idClientEvaluation)
      .eq('isActive', true)
      .single();

    if (error) throw error;

    // Extrai primeiro elemento de cada array de relacionamento
    const mp = (data.musclePerimeter || [])[0];
    const mc = (data.muscoloskeletalChange || [])[0];
    const photos = data.clientEvaluationPhoto || [];

    return {
      idClientEvaluation: data.id,
      date: data.date,
      idClient: data.idClient,
      idCompany: data.idCompany,
      idMusclePerimeter: mp?.id ?? null,
      weight: mp?.weight,
      height: mp?.height,
      neck: mp?.neck,
      shoulder: mp?.shoulder,
      rightForearm: mp?.rightForearm,
      leftForearm: mp?.leftForearm,
      chest: mp?.chest,
      leftArm: mp?.leftArm,
      rightArm: mp?.rightArm,
      waist: mp?.waist,
      abdome: mp?.abdome,
      hip: mp?.hip,
      breeches: mp?.breeches,
      leftThigh: mp?.leftThigh,
      rightThigh: mp?.rightThigh,
      leftCalf: mp?.leftCalf,
      rightCalf: mp?.rightCalf,
      idMucolosckeletalChanges: mc?.id ?? null,
      head: mc?.head,
      spine: mc?.spine,
      sholderBlades: mc?.sholderBlades,
      shoulders: mc?.shoulders,
      pelvis: mc?.pelvis,
      knees: mc?.knees,
      shins: mc?.shins,
      feet: mc?.feet,
      clientEvaluationPhoto: photos.map((p) => ({
        idClientEvaluationPhoto: p.id,
        url: p.url,
        fileName: p.fileName,
      })),
    };
  }
}
