import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateClientEvaluationDto } from '../dto/create-client-evaluation.dto';

import { rethrow } from '@nestjs/core/helpers/rethrow';
import { MusclePerimeterDto } from '../dto/muscle-perimeter.dto';
import { MuscoloskeletalChangesDto } from '../dto/muscoloskeletal-change.dto';
import { CreateClientEvaluationPhotoDto } from '../dto/create-client-evaluation-photo.dto';
import { ClientEvaluationPhotoDto } from '../dto/client-evaluation-photo.dto';

@Injectable()
export class ClientEvaluationRepository {
  constructor(private databaseService: DatabaseService) {}

  async createClientEvaluation(clientEvaluation: CreateClientEvaluationDto): Promise<any> {
    await this.databaseService.execute(
      'INSERT INTO clientEvaluation (idClient, idCompany, date) VALUES (?, ?, now())',
      [clientEvaluation.idClient, clientEvaluation.idCompany],
    );

    const row = await this.databaseService.execute(
      'SELECT ce.id idClientEvaluation, ce.* FROM clientEvaluation ce WHERE ce.idClient = ? and ce.idCompany = ? order by ce.lastUpdate desc;',
      [clientEvaluation.idClient, clientEvaluation.idCompany],
    );

    return row[0];
  }

  async createClientEvaluationPhoto(clientEvaluationPhoto: CreateClientEvaluationPhotoDto): Promise<void> {
    try {
      await this.databaseService.execute(
        `INSERT INTO clientEvaluationPhoto
          (idClientEvaluation, idCompany, date, url, fileName)
          VALUES (?, ?, now(), ?, ?)`,
        [
          clientEvaluationPhoto.idClientEvaluation,
          clientEvaluationPhoto.idCompany,
          clientEvaluationPhoto.url,
          clientEvaluationPhoto.fileName,
        ],
      );
    } catch (error) {
      throw new Error(`Erro ao inserir foto da avaliação do cliente: ${error}`);
    }
  }

  async deleteClientEvaluationPhoto(clientEvaluationPhoto: ClientEvaluationPhotoDto): Promise<void> {
    try {
      await this.databaseService.execute(
        `DELETE from clientEvaluationPhoto where id = ? and idCompany = ? and idClientEvaluation = ?`,
        [clientEvaluationPhoto.id, clientEvaluationPhoto.idCompany, clientEvaluationPhoto.idClientEvaluation],
      );
    } catch (error) {
      throw new Error(`Erro ao inserir foto da avaliação do cliente: ${error}`);
    }
  }

  async createMusclePerimeter(
    idClientEvaluation: string,
    idCompany: string,
    musclePerimeterDto: MusclePerimeterDto,
  ): Promise<void> {
    try {
      const keys = Object.keys(musclePerimeterDto);
      const values = Object.values(musclePerimeterDto);
      const columns = keys.join(', ');
      const placeholders = new Array(keys.length + 2).fill('?').join(', ');

      const query = `
        INSERT INTO musclePerimeter (
          idClientEvaluation,
          idCompany,
          ${columns}
        ) VALUES (${placeholders})
      `;

      await this.databaseService.execute(query, [idClientEvaluation, idCompany, ...values]);
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
      const keys = Object.keys(musclePerimeterDto).filter((key) => key !== 'id');
      const values = Object.values(musclePerimeterDto).filter((key) => key !== musclePerimeterDto.id);

      const columnsToUpdate = keys.map((key) => `${key} = ?`).join(', ');

      const query = `
      UPDATE musclePerimeter
      SET ${columnsToUpdate}
      WHERE id = ? AND idCompany = ?
    `;

      // Adiciona idClientEvaluation e idCompany ao final do array de valores
      await this.databaseService.execute(query, [...values, musclePerimeterDto.id, idCompany]);
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
      const keys = Object.keys(muscoloskeletalChanges);
      const values = Object.values(muscoloskeletalChanges);

      const columns = keys.join(', ');
      const placeholders = new Array(keys.length + 2).fill('?').join(', ');

      const query = `
        INSERT INTO muscoloskeletalChange (
          idClientEvaluation,
          idCompany,
          ${columns}
        ) VALUES (${placeholders})
      `;

      await this.databaseService.execute(query, [idClientEvaluation, idCompany, ...values]);
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
      const keys = Object.keys(muscoloskeletalChanges).filter((key) => key !== 'id');
      const values = Object.values(muscoloskeletalChanges).filter((key) => key !== muscoloskeletalChanges.id);

      const columnsToUpdate = keys.map((key) => `${key} = ?`).join(', ');

      const query = `
        UPDATE muscoloskeletalChange
        SET ${columnsToUpdate}
        WHERE id = ? AND idCompany = ?
      `;

      // Adiciona idClientEvaluation e idCompany ao final do array de valores
      await this.databaseService.execute(query, [...values, muscoloskeletalChanges.id, idCompany]);
    } catch (error) {
      throw new Error(`Erro updateMuscoloskeletalChange: ${error}`);
    }
  }

  async findAllByClientAndCompany(idClient: string, idCompany: string): Promise<any> {
    const rows = await this.databaseService.execute(
      `SELECT ce.id idClientEvaluation,
              ce.date,
              ce.idClient,
              ce.idCompany,
              mp.id idMusclePerimeter,
              mp.weight,
              mp.height,
              mp.neck,
              mp.shoulder,
              mp.rightForearm,
              mp.leftForearm,
              mp.chest,
              mp.leftArm,
              mp.rightArm,
              mp.waist,
              mp.abdome,
              mp.hip,
              mp.breeches,
              mp.leftThigh,
              mp.rightThigh,
              mp.leftCalf,
              mp.rightCalf,
              mc.id idMucolosckeletalChanges,
              mc.head,
              mc.spine,
              mc.sholderBlades,
              mc.shoulders,
              mc.pelvis,
              mc.knees,
              mc.shins,
              mc.feet,
              cep.id idClientEvaluationPhoto,
              cep.url,
              cep.fileName
        from clientEvaluation ce
                inner join musclePerimeter mp on mp.idClientEvaluation = ce.id and mp.isActive = 1
                inner join muscoloskeletalChange mc on mc.idClientEvaluation = ce.id and mc.isActive = 1
                left join clientEvaluationPhoto cep on cep.idClientEvaluation = ce.id and cep.isActive = 1
        where ce.idCompany = ?
          and ce.idClient = ?
          and ce.isActive = 1
        order by ce.date desc`,
      [idCompany, idClient],
    );
    return rows;
  }
}
