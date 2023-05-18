import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { getMessage, SqlError } from 'src/api/utils/utils';
import { AccessTokenDto } from 'src/api/auth/dto/response/access-token-dto';
import { AccessTokenModel } from 'src/models/access-token-user.model';

@Injectable()
export class WorkoutsheetRepository {
  constructor(private databaseService: DatabaseService) { }

  async createWorkoutSheetDefault(
    title: string,
    idCompany: string,
  ): Promise<any> {
    try {
      const createQuery = `insert into workoutSheetDefault (title, idCompany) values (?,?);`;

      await this.databaseService.execute(createQuery, [title, idCompany]);

      const idWorkoutSheetDefault = await this.databaseService.execute(
        `SELECT id FROM workoutSheetDefault WHERE title = '${title}' and idCompany = '${idCompany}'`,
      );

      return idWorkoutSheetDefault[0]['id'];
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
    idWorkout: string,
  ): Promise<void> {
    try {
      const createQuery = `insert into workoutSheetDefaultWorkout (idWorkouotSheetDefault, idWorkout) values (?, ?)`;

      await this.databaseService.execute(createQuery, [
        idWorkoutSheetDefault,
        idWorkout,
      ]);
    } catch (error) {
      throw error;
    }
  }

  async deleteWorkoutSheetDefaultWorkout(
    idWorkoutSheetDefault: string,
  ): Promise<void> {
    try {
      const createQuery = `delete from workoutSheetDefaultWorkout
            where idWorkouotSheetDefault = '${idWorkoutSheetDefault}';`;

      await this.databaseService.execute(createQuery);
    } catch (error) {
      throw error;
    }
  }

  async getAllWorkoutSheetDefaultByIdCompany(idCompany: string): Promise<any> {
    try {
      const query = `
            SELECT wsd.id as wsdId, w.id as workoutId, w.isActive as wIsActive, w.lastUpdate as wLastUpdate, wsd.title as wsdTitle, w.title as wTitle, w.subTitle as wSubTitle, w.description as wDesc, w.videoUrl as wVideoUrl, w.imageUrl as wImageUrl FROM workoutSheetDefault wsd
                INNER JOIN workoutSheetDefaultWorkout wSDW on wsd.id = wSDW.idWorkouotSheetDefault
                INNER JOIN workout w on w.id = wSDW.idWorkout

                WHERE w.idCompany = '${idCompany}' AND w.isActive = 1`;

      return await this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }

  async deleteById(idWorkoutSheetDefault: string): Promise<void> {
    try {
      await this.databaseService.execute(
        'UPDATE workoutSheetDefault SET isActive = 0 WHERE id = ?',
        [idWorkoutSheetDefault],
      );
    } catch (error) {
      throw error;
    }
  }

  async getMyTrainingProgram(user: AccessTokenModel): Promise<any> {
    try {
      const query = `
        SELECT
              ws.id as workoutSheetId,
                ws.name as workoutSheetName,
                wsd.date as workoutSheedConclusionDate,
                ws.order as workoutSheetOrder,
        
                w.id as workoutId,
                w.title as workoutTitle,
                w.subTitle as workoutSubtitle,
                w.description as workoutDescription,
                wc.order as workoutOrder,
                wc.breakTime as workoutBreakTime,
                wc.series as workoutSeries,
        
                m.title as mediaTitle,
                m.fileFormat as mediaFormat,
                m.type as mediaType,
                m.url as mediaUrl
        FROM
            workoutSheetDone wsD
        INNER JOIN workoutSheet wS on wsD.idWorkoutSheet = wS.id
        INNER JOIN workoutClient wC on ws.id = wc.idWorkoutSheet
        INNER JOIN workout w on wc.idWorkout = w.id
        INNER JOIN workoutMedia wM on w.id = wM.idWorkout
        INNER JOIN media m on wM.idMedia = m.id
        
        WHERE
            ws.idClient = '${user.clientId}' AND
            ws.idCompany = '${user.clientIdCompany}' AND
            ws.isActive = 1

          ORDER BY wsd.date ASC;`;

      return await this.databaseService.execute(query);

    } catch (error) {
      throw error;
    }
  }

  async getAllMyCurrentWorkoutSheetsWithWorkouts(user: AccessTokenModel): Promise<any> {
    try {
      const query = `
      SELECT
            ws.id as workoutSheetId,
                ws.name as workoutSheetName,
                ws.order as workoutSheetOrder,

                w.id as workoutId,
                w.title as workoutTitle,
                w.subTitle as workoutSubtitle,
                w.description as workoutDescription,
                wc.order as workoutOrder,
                wc.breakTime as workoutBreakTime,
                wc.series as workoutSeries,

                m.title as mediaTitle,
                m.fileFormat as mediaFormat,
                m.type as mediaType,
                m.url as mediaUrl

        FROM workoutSheet ws

                INNER JOIN workoutClient wC on ws.id = wC.idWorkoutSheet
                INNER JOIN workout w on wC.idWorkout = w.id
                INNER JOIN workoutMedia wM on w.id = wM.idWorkout
                INNER JOIN media m on wM.idMedia = m.id


         WHERE
             ws.idClient = 'c284ac9d-d78e-11ed-ba77-0242ac110002' AND
              ws.idCompany = '7c576f1d-d78e-11ed-ba77-0242ac110002' AND
              ws.isActive = 1
        ORDER BY ws.order ASC
      `;

      return await this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }
}
