import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { convertDateToTimestamp, getMessage, SqlError } from 'src/api/utils/utils';
import { AccessTokenModel } from 'src/models/access-token-user.model';
import { CreateWorkoutsheetDefaultWorkoutDto } from '../dto/request/create.workoutsheet.default.dto';
import { WorkoutsheetModel } from '../../../models/workoutsheet.model';
import { WorkoutClientModel } from '../../../models/workout.client.model';

@Injectable()
export class WorkoutsheetRepository {
  constructor(private databaseService: DatabaseService) {}

  async createWorkoutSheetDefault(title: string, idCompany: string): Promise<any> {
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
        throw new HttpException(`SQL error: ${errorMessage}`, HttpStatus.CONFLICT);
      }
      throw error;
    }
  }

  async createWorkoutSheet(workoutsheetList: WorkoutsheetModel[]): Promise<any> {
    try {
      const params = workoutsheetList
        .map(
          (item) =>
            `('${item.name}', '${item.idCompany}', '${item.idClient}', '${item.idWorkoutsheetDefault}', ${item.workoutsheetOrder})`,
        )
        .join(',');

      const createQuery = `insert into workoutSheet (name, idCompany, idClient, idWorkoutsheetDefault, workoutsheetOrder)
                           values ${params};`;

      return await this.databaseService.execute(createQuery);
    } catch (error) {
      if (error.code == SqlError.DuplicateKey) {
        const errorMessage = getMessage(SqlError.DuplicateKey);
        throw new HttpException(`SQL error: ${errorMessage}`, HttpStatus.CONFLICT);
      }
      throw error;
    }
  }

  async createWorkoutClient(workoutClientList: WorkoutClientModel[]): Promise<any> {
    try {
      const params = workoutClientList
        .map(
          (item) =>
            `('${item.title}', '${item.subtitle}', '${item.description}', '${item.idWorkoutSheet}', '${item.idWorkout}', '${item.idCompany}', ${item.workoutOrder})`,
        )
        .join(',');

      const createQuery = `insert into workoutClient (title, subtitle, description, idWorkoutSheet, idWorkout,
                                                      idCompany, workoutOrder)
                           values ${params};`;

      return await this.databaseService.execute(createQuery);
    } catch (error) {
      if (error.code == SqlError.DuplicateKey) {
        const errorMessage = getMessage(SqlError.DuplicateKey);
        throw new HttpException(`SQL error: ${errorMessage}`, HttpStatus.CONFLICT);
      }
      throw error;
    }
  }

  async updateWorkoutSheetDefault(title: string, idWorkout: string): Promise<any> {
    try {
      const createQuery = `update workoutSheetDefault
                           set title = ?
                           where id = ?;`;

      return await this.databaseService.execute(createQuery, [title, idWorkout]);
    } catch (error) {
      if (error.code == SqlError.DuplicateKey) {
        const errorMessage = getMessage(SqlError.DuplicateKey);
        throw new HttpException(`SQL error: ${errorMessage}`, HttpStatus.CONFLICT);
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
        .map((item) => `('${idWorkoutSheetDefault}', '${idCompany}', '${item.idWorkout}', ${item.workoutOrder})`)
        .join(',');

      const createQuery = `insert into workoutSheetDefaultWorkout (idWorkoutSheetDefault, idCompany, idWorkout, workoutOrder)
                           values ${params}`;

      await this.databaseService.execute(createQuery);
    } catch (error) {
      throw error;
    }
  }

  async deleteWorkoutSheetDefaultWorkout(idWorkoutSheetDefault: string): Promise<void> {
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

  async getAllWorkoutsheetByIdClientAdmin(idClient: string, idCompany: string): Promise<any> {
    try {
      const query = `SELECT w.*
                     FROM workoutSheet w
                     WHERE w.isActive = 1
                       AND w.idCompany = '${idCompany}'
                       AND w.idClient = '${idClient}'
                     order by w.workoutsheetOrder`;

      return await this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }

  async getWorkoutsheetDefaultByIdList(idCompany: string, idWorkoutsheetDefaultList: string[]): Promise<any> {
    try {
      const params = idWorkoutsheetDefaultList.map((item) => `'${item}'`).join(',');

      const query = `SELECT *
                     FROM workoutSheetDefault
                     WHERE isActive = 1
                       AND id in (${params})
                       AND idCompany = '${idCompany}'
                     order by title`;

      return await this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }

  async getAllWorkoutsheetDefaultByIdCompanyAdmin(idCompany: string): Promise<any> {
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

  async getAllWorkoutsheetDefaultWorkoutByIdCompanyAdmin(idCompany: string): Promise<any> {
    try {
      const query = `SELECT *
                     FROM workoutSheetDefaultWorkout
                     WHERE idCompany = '${idCompany}' `;

      return await this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }

  // async getWorkoutsheetDefaultWorkoutByIdWorkoutsheetDefaultList(
  //   idCompany: string,
  //   idWorkoutsheetDefaultList: string[],
  // ): Promise<any> {
  //   try {
  //     const params = idWorkoutsheetDefaultList.map((item) => `'${item}'`).join(',');

  //     const query = `SELECT *
  //                    FROM workoutSheetDefaultWorkout
  //                    WHERE idCompany = '${idCompany}'
  //                      AND
  //     `;

  //     return await this.databaseService.execute(query);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async deleteById(idWorkoutSheetDefault: string): Promise<void> {
    try {
      await this.databaseService.execute(
        'update workoutSheetDefault set active = ?, title = concat(title, ?) WHERE id = ?',
        [false, ` - ${idWorkoutSheetDefault} - DELETED`, idWorkoutSheetDefault],
      );
    } catch (error) {
      throw error;
    }
  }

  async getMyTrainingProgram(user: AccessTokenModel): Promise<any> {
    try {
      const query = `
          SELECT ws.id                as workoutSheetId,
                 ws.name              as workoutSheetName,
                 wsd.date             as workoutSheedConclusionDate,
                 ws.workoutsheetOrder as workoutSheetOrder,

                 wc.id                as workoutId,
                 w.title              as workoutTitle,
                 w.subTitle           as workoutSubtitle,
                 w.description        as workoutDescription,
                 wc.workoutOrder      as workoutOrder,
                 wc.breakTime         as workoutBreakTime,
                 wc.series            as workoutSeries,

                 m.id                 as mediaId,
                 m.title              as mediaTitle,
                 m.fileFormat         as mediaFormat,
                 m.type               as mediaType,
                 m.url                as mediaUrl,
                 m.thumbnailUrl       as thumbnailUrl,
                 wm.mediaOrder        as mediaOrder
          FROM workoutSheetDone wsd
                   INNER JOIN workoutSheet ws on wsd.idWorkoutSheet = ws.id
                   INNER JOIN workoutClient wc on ws.id = wc.idWorkoutSheet and wc.isActive = 1
                   INNER JOIN workout w on wc.idWorkout = w.id and w.isActive = 1
                   LEFT JOIN workoutMedia wm on w.id = wm.idWorkout
                   LEFT JOIN media m on wm.idMedia = m.id and m.isActive = 1

          WHERE ws.idClient = '${user.clientId}'
            AND ws.idCompany = '${user.clientIdCompany}'
            AND ws.isActive = 1
            AND wsd.date > ADDDATE(NOW(), -10)

          ORDER BY wsd.date ASC;`;

      return await this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }

  async getAllMyCurrentWorkoutSheetsWithWorkouts(user: AccessTokenModel): Promise<any> {
    try {
      const query = `
          SELECT ws.id                as workoutSheetId,
                 ws.name              as workoutSheetName,
                 ws.workoutsheetOrder as workoutSheetOrder,

                 wc.id                as workoutId,
                 wc.title              as workoutTitle,
                 wc.subTitle           as workoutSubtitle,
                 wc.description        as workoutDescription,
                 wc.workoutOrder      as workoutOrder,
                 wc.breakTime         as workoutBreakTime,
                 wc.series            as workoutSeries,

                 m.id                 as mediaId,
                 m.title              as mediaTitle,
                 m.fileFormat         as mediaFormat,
                 m.type               as mediaType,
                 m.url                as mediaUrl,
                 m.thumbnailUrl       as thumbnailUrl,
                 wm.mediaOrder        as mediaOrder
          FROM workoutSheet ws

                   LEFT JOIN workoutSheetDone wsd on wsd.idWorkoutSheet = ws.id
                   LEFT JOIN workoutClient wc on ws.id = wc.idWorkoutSheet
                   INNER JOIN workout w on wc.idWorkout = w.id
                   LEFT JOIN workoutMedia wm on w.id = wm.idWorkout
                   LEFT JOIN media m on wm.idMedia = m.id


          WHERE ws.idClient = '${user.clientId}'
            AND ws.idCompany = '${user.clientIdCompany}'
            AND ws.isActive = 1
          ORDER BY ws.workoutsheetOrder ASC
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
                            m.type,
                            m.thumbnailUrl

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

      return await this.databaseService.execute(query, [idWorkoutsheet, idCompany, convertDateToTimestamp(new Date())]);
    } catch (error) {
      throw error;
    }
  }

  async createWorkoutsheetFeedback(feedback: string, idWorkoutsheet: string): Promise<void> {
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

  async deleteWorkoutsheetByIdWorkoutsheetDefaultList(
    idWorkoutSheetDefaultList: string[],
    idClient: string,
    idCompany: string,
  ): Promise<void> {
    try {
      // let titleCaseString = 'CASE id ';
      // idWorkoutSheetDefaultList.forEach((id) => {
      //   titleCaseString += `WHEN ${id} THEN concat(title, ' - ${id} - DELETED') `;
      // });
      // titleCaseString += 'END';

      const params = idWorkoutSheetDefaultList.map((item) => `'${item}'`).join(',');

      await this.databaseService.execute(
        `delete
         from workoutSheet
         WHERE idClient = ?
           AND idCompany = ?
           AND idWorkoutsheetDefault IN (${params})`,
        [idClient, idCompany],
      );
    } catch (error) {
      throw error;
    }
  }
}
