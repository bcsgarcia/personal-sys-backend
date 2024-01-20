import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateClientEvaluationDto } from '../dto/create-client-evaluation.dto';
import { ClientEvaluationPhotoDto } from '../dto/client-evaluation-photo.dto';
import { rethrow } from '@nestjs/core/helpers/rethrow';

@Injectable()
export class ClientEvaluationRepository {
  constructor(private databaseService: DatabaseService) {}

  async createClientEvaluation(clientEvaluation: CreateClientEvaluationDto): Promise<any> {
    await this.databaseService.execute(
      'INSERT INTO clientEvaluation (idClient, idCompany, date) VALUES (?, ?, now())',
      [clientEvaluation.idClient, clientEvaluation.idCompany],
    );

    const row = await this.databaseService.execute(
      'SELECT ce.id idClientEvaluation, ce.* FROM clientEvaluation ce WHERE ce.idClient = ? and ce.idCompany = ? order by ce.date desc;',
      [clientEvaluation.idClient, clientEvaluation.idCompany],
    );

    return row[0];
  }

  async createClientEvaluationPhoto(clientEvaluationPhoto: ClientEvaluationPhotoDto): Promise<void> {
    try {
      await this.databaseService.execute(
        'INSERT INTO clientEvaluationPhoto (idClientEvaluation, idCompany, date, url) VALUES (?, ?, now(), ?)',
        [clientEvaluationPhoto.idClientEvaluation, clientEvaluationPhoto.idCompany, clientEvaluationPhoto.url],
      );
    } catch (error) {
      rethrow;
    }
  }

  async createMusclePerimeter(idClientEvaluation: string, idCompany: string): Promise<void> {
    await this.databaseService.execute(
      `INSERT INTO musclePerimeter (
        idClientEvaluation,
        idCompany
      ) VALUES (?,?)`,
      [idClientEvaluation, idCompany],
    );
    /*
    weight,
        height,
        neck,
        shoulder,
        forearm,
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
    */
  }

  async createMuscoloskeletalChange(idClientEvaluation: string, idCompany: string): Promise<void> {
    await this.databaseService.execute(
      `INSERT INTO muscoloskeletalChange (
        idClientEvaluation,
        idCompany
      ) VALUES (?,?)`,
      [idClientEvaluation, idCompany],
    );

    /*
    head,
        spine,
        sholderBlades,
        shoulders,
        pelvis,
        knees,
        shins,
        feet
    */
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
              mc.id idMucolosckeletalChange,
              mc.head,
              mc.spine,
              mc.sholderBlades,
              mc.shoulders,
              mc.pelvis,
              mc.knees,
              mc.shins,
              mc.feet,
              cep.id idClientEvaluationPhoto,
              cep.url
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
