import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  convertDateToTimestamp,
  getMessage,
  SqlError,
} from 'src/api/utils/utils';
import { AccessTokenModel } from 'src/models/access-token-user.model';
import { CreateWorkoutsheetDefaultWorkoutDto } from '../dto/request/create.workoutsheet.default.dto';

@Injectable()
export class WorkoutsheetRepository {
  constructor(private databaseService: DatabaseService) {}

  async createWorkoutSheetDefault(
    title: string,
    idCompany: string,
  ): Promise<any> {
    try {
      const createQuery = `insert into workoutSheetDefault (title, idCompany)
                           values (?, ?);`;

      await this.databaseService.execute(createQuery, [title, idCompany]);

      const idWorkoutSheetDefault = await this.databaseService.execute(
        `SELECT *
         FROM workoutSheetDefault
         WHERE idCompany = '${idCompany}'
         order by lastUpdate desc limit 1`,
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

  async updateWorkoutSheetDefault(
    title: string,
    idWorkout: string,
  ): Promise<any> {
    try {
      const createQuery = `update workoutSheetDefault
                           set title = ?
                           where id = ?;`;

      return await this.databaseService.execute(createQuery, [
        title,
        idWorkout,
      ]);
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
      const params = createWorkoutsheetDefaultWorkoutDto
        .map(
          (item) =>
            `('${idWorkoutSheetDefault}', '${idCompany}', '${item.idWorkout}', ${item.order})`,
        )
        .join(',');

      const createQuery = `insert into workoutSheetDefaultWorkout (idWorkoutSheetDefault, idCompany, idWorkout, workoutOrder)
                           values ${params}`;

      await this.databaseService.execute(createQuery);
    } catch (error) {
      throw error;
    }
  }

  async deleteWorkoutSheetDefaultWorkout(
    idWorkoutSheetDefault: string,
  ): Promise<void> {
    try {
      const createQuery = `delete
                           from workoutSheetDefaultWorkout
                           where idWorkoutSheetDefault = '${idWorkoutSheetDefault}';`;

      await this.databaseService.execute(createQuery);
    } catch (error) {
      throw error;
    }
  }

  async getAllWorkoutSheetDefaultByIdCompany(idCompany: string): Promise<any> {
    try {
      const query = `
          SELECT wsd.id        as wsdId,
                 w.id          as workoutId,
                 w.isActive    as wIsActive,
                 w.lastUpdate  as wLastUpdate,
                 wsd.title     as wsdTitle,
                 w.title       as wTitle,
                 w.subTitle    as wSubTitle,
                 w.description as wDesc,
                 w.videoUrl    as wVideoUrl,
                 w.imageUrl    as wImageUrl
          FROM workoutSheetDefault wsd
                   INNER JOIN workoutSheetDefaultWorkout wsdw on wsd.id = wsdw.idWorkoutSheetDefault
                   INNER JOIN workout w on w.id = wsdw.idWorkout

          WHERE w.idCompany = '${idCompany}'
            AND w.isActive = 1`;

      return await this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }

  async getAllWorkoutSheetDefaultByIdCompanyAdmin(
    idCompany: string,
  ): Promise<any> {
    try {
      const query = `SELECT *
                     FROM workoutSheetDefault
                     WHERE isActive = 1
                       AND idCompany = '${idCompany}'
                     order by title`;

      return await this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }

  async getAllWorkoutSheetDefaultWorkoutByIdCompanyAdmin(
    idCompany: string,
  ): Promise<any> {
    try {
      const query = `SELECT *
                     FROM workoutSheetDefaultWorkout
                     WHERE idCompany = '${idCompany}' `;

      return await this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }

  async deleteById(idWorkoutSheetDefault: string): Promise<void> {
    try {
      await this.databaseService.execute(
        'delete from workoutSheetDefault WHERE id = ?',
        [idWorkoutSheetDefault],
      );
    } catch (error) {
      throw error;
    }
  }

  async getMyTrainingProgram(user: AccessTokenModel): Promise<any> {
    try {
      const query = `
          SELECT ws.id         as workoutSheetId,
                 ws.name       as workoutSheetName,
                 wsd.date      as workoutSheedConclusionDate,
                 ws.order      as workoutSheetOrder,

                 wc.id         as workoutId,
                 w.title       as workoutTitle,
                 w.subTitle    as workoutSubtitle,
                 w.description as workoutDescription,
                 wc.order      as workoutOrder,
                 wc.breakTime  as workoutBreakTime,
                 wc.series     as workoutSeries,

                 m.id          as mediaId,
                 m.title       as mediaTitle,
                 m.fileFormat  as mediaFormat,
                 m.type        as mediaType,
                 m.url         as mediaUrl
          FROM workoutSheetDone wsd
                   LEFT JOIN workoutSheet ws on wsd.idWorkoutSheet = ws.id
                   INNER JOIN workoutClient wc on ws.id = wc.idWorkoutSheet
                   INNER JOIN workout w on wc.idWorkout = w.id
                   INNER JOIN workoutMedia wm on w.id = wm.idWorkout
                   INNER JOIN media m on wm.idMedia = m.id

          WHERE ws.idClient = '${user.clientId}'
            AND ws.idCompany = '${user.clientIdCompany}'
            AND ws.isActive = 1

          ORDER BY wsd.date ASC;`;

      return await this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }

  async getAllMyCurrentWorkoutSheetsWithWorkouts(
    user: AccessTokenModel,
  ): Promise<any> {
    try {
      const query = `
          SELECT ws.id         as workoutSheetId,
                 ws.name       as workoutSheetName,
                 ws.order      as workoutSheetOrder,

                 wc.id         as workoutId,
                 w.title       as workoutTitle,
                 w.subTitle    as workoutSubtitle,
                 w.description as workoutDescription,
                 wc.order      as workoutOrder,
                 wc.breakTime  as workoutBreakTime,
                 wc.series     as workoutSeries,

                 m.id          as mediaId,
                 m.title       as mediaTitle,
                 m.fileFormat  as mediaFormat,
                 m.type        as mediaType,
                 m.url         as mediaUrl

          FROM workoutSheet ws

                   INNER JOIN workoutClient wc on ws.id = wc.idWorkoutSheet
                   INNER JOIN workout w on wc.idWorkout = w.id
                   INNER JOIN workoutMedia wm on w.id = wm.idWorkout
                   INNER JOIN media m on wm.idMedia = m.id


          WHERE ws.idClient = '${user.clientId}'
            AND ws.idCompany = '${user.clientIdCompany}'
            AND ws.isActive = 1
          ORDER BY ws.order ASC
      `;

      return await this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }

  async getUrlMediasForSync(user: AccessTokenModel): Promise<any> {
    try {
      const query = `SELECT m.id,
                            m.url,
                            m.type

                     FROM workoutSheet ws

                              INNER JOIN workoutClient wc on ws.id = wc.idWorkoutSheet
                              INNER JOIN workout w on wc.idWorkout = w.id
                              INNER JOIN workoutMedia wm on w.id = wm.idWorkout
                              INNER JOIN media m on wm.idMedia = m.id
                     WHERE ws.idClient = '${user.clientId}'
                       AND ws.idCompany = '${user.clientIdCompany}'
                       AND ws.isActive = 1`;

      return await this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }

  async workoutSheetDone(idWorkoutsheet: string, idCompany: string) {
    try {
      const query = `
          INSERT INTO workoutSheetDone
          (idWorkoutSheet,
           idCompany,
           date)
          VALUES (?, ?, ?);`;

      return await this.databaseService.execute(query, [
        idWorkoutsheet,
        idCompany,
        convertDateToTimestamp(new Date()),
      ]);
    } catch (error) {
      throw error;
    }
  }

  async createWorkoutsheetFeedback(
    feedback: string,
    idWorkoutsheet: string,
  ): Promise<void> {
    try {
      const query = `
          INSERT INTO workoutSheetFeedback
          (feedback,
           idWorkoutsheet)
          VALUES ('${feedback}',
                  '${idWorkoutsheet}');`;

      await this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }
}
