import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateWorkoutDto } from '../dto/create-workout.dto';
import { UpdateWorkoutDto } from '../dto/update-workout.dto';
import { CreateWorkoutMediaDto } from '../dto/create-workout-media.dto';
import { CreateWorkoutClientDto } from '../dto/create-workout-client.dto';

@Injectable()
export class WorkoutRepository {
  constructor(private databaseService: DatabaseService) {}

  async create(workout: CreateWorkoutDto): Promise<void> {
    try {
      const createQuery =
        'insert into workout (title, subTitle, description, idCompany) values (?,?,?,?);';

      await this.databaseService.execute(createQuery, [
        workout.title,
        workout.subtitle,
        workout.description,
        workout.idCompany,
      ]);
    } catch (error) {
      throw error;
    }
  }

  async createWorkoutClient(
    workoutClientDto: CreateWorkoutClientDto,
  ): Promise<void> {
    try {
      const createQuery =
        'insert into workoutClient (title, subTitle, description, idCompany, idWorkout, breakTime, series, workoutOrder, idWorkoutsheet) values (?,?,?,?,?,?,?,?,?);';

      await this.databaseService.execute(createQuery, [
        workoutClientDto.title,
        workoutClientDto.subtitle,
        workoutClientDto.description,
        workoutClientDto.idCompany,
        workoutClientDto.idWorkout,
        workoutClientDto.breakTime,
        workoutClientDto.series,
        workoutClientDto.workoutOrder,
        workoutClientDto.idWorkoutsheet,
      ]);
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
      const params = workoutMediaList
        .map(
          (item) =>
            `('${idWorkout}', '${idCompany}', '${item.id}', ${item.mediaOrder})`,
        )
        .join(',');

      const query = `
          insert into workoutMedia
              (idWorkout, idCompany, idMedia, mediaOrder)
          values ${params};
      `;

      await this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }

  async findLastInserted(workout: CreateWorkoutDto): Promise<any> {
    try {
      return this.databaseService.execute(
        `SELECT *
         FROM workout
         WHERE idCompany = '${workout.idCompany}'
           AND title = '${workout.title}'
           AND subTitle = '${workout.subtitle}'
           AND description = '${workout.description}'
           and isActive = true
         order by lastUpdate desc limit 1`,
      );
    } catch (error) {
      throw error;
    }
  }

  async update(workout: UpdateWorkoutDto): Promise<void> {
    try {
      await this.databaseService.execute(
        'UPDATE workout SET title = ?, subTitle = ?, description = ?  WHERE id = ?',
        [workout.title, workout.subtitle, workout.description, workout.id],
      );
    } catch (error) {
      throw error;
    }
  }

  async findAll(idCompany: string): Promise<any> {
    try {
      return this.databaseService.execute(
        `SELECT *
         FROM workout
         WHERE idCompany = '${idCompany}'
           and isActive = true`,
      );
    } catch (error) {
      throw error;
    }
  }

  async findManyWorkoutByIdWorkout(idWorkoutList: string[]): Promise<any> {
    try {
      const params = idWorkoutList.map((item) => `'${item}'`).join(',');

      return this.databaseService.execute(
        `SELECT *
         FROM workout
         WHERE id in (${params})
           and isActive = true`,
      );
    } catch (error) {
      throw error;
    }
  }

  async findManyWorkoutByIdWorkoutsheetList(
    idWorkoutsheetList: string[],
  ): Promise<any> {
    try {
      const params = idWorkoutsheetList.map((item) => `'${item}'`).join(',');

      return this.databaseService.execute(
        `select *
         from workout w
                  inner join workoutSheetDefaultWorkout ws on w.id = ws.idWorkout
         where ws.idWorkoutSheetDefault in (${params})
           and w.isActive = true
         order by ws.idWorkoutSheetDefault, ws.workoutOrder;`,
      );
    } catch (error) {
      throw error;
    }
  }

  async findWorkoutClientByWorkoutsheet(
    workoutsheetList: string[],
  ): Promise<any> {
    try {
      const params = workoutsheetList.map((item) => `'${item}'`).join(',');

      const query = `
          select w.*
          from workoutClient w
          where w.idWorkoutsheet in (${params})
            and w.isActive = true
          order by w.idWorkoutSheet, w.idWorkoutSheet, w.workoutOrder`;

      return this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }

  async findAllWorkoutMedia(idCompany: string): Promise<any> {
    try {
      return this.databaseService.execute(
        `SELECT *
         FROM workoutMedia
         WHERE idCompany = '${idCompany}'
         order by idWorkout, mediaOrder`,
      );
    } catch (error) {
      throw error;
    }
  }

  async findManyWorkoutMediaByIdWorkoutList(
    idWorkoutList: string[],
    idCompany: string,
  ): Promise<any> {
    try {
      const params = idWorkoutList.map((item) => `'${item}'`).join(',');

      return this.databaseService.execute(
        `SELECT *
         FROM workoutMedia
         WHERE idWorkout in (${params})
           and idCompany = '${idCompany}'`,
      );
    } catch (error) {
      throw error;
    }
  }

  async findManyMediaByIdWorkout(idWorkoutList: string[], idCompany: string) {
    const params = idWorkoutList.map((item) => `'${item}'`).join(',');

    const rows = await this.databaseService.execute(
      `SELECT m.*, w.idWorkout, w.mediaOrder
       FROM media m
                inner join workoutMedia w
                           on m.id = w.idMedia and w.idWorkout in (${params}) and m.idCompany = w.idCompany
       where m.idCompany = ?
       order by w.mediaOrder`,
      [idCompany],
    );
    return rows;
  }

  async deleteById(idWorkout: string): Promise<void> {
    try {
      await this.databaseService.execute('DELETE FROM workout WHERE id = ?', [
        idWorkout,
      ]);
    } catch (error) {
      throw error;
    }
  }

  async deleteWorkoutClientById(idWorkoutClient: string): Promise<void> {
    try {
      await this.databaseService.execute(
        'DELETE FROM workoutClient WHERE id = ?',
        [idWorkoutClient],
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteWorkoutMedia(idWorkout: string): Promise<void> {
    try {
      await this.databaseService.execute(
        'DELETE FROM workoutMedia WHERE idWorkout = ?',
        [idWorkout],
      );
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
      const querie =
        'insert into workoutFeedback (feedback, idWorkoutClient, idCompany) values (?,?,?);';

      await this.databaseService.execute(querie, [
        feedback,
        idWorkoutClient,
        idCompany,
      ]);
    } catch (error) {
      throw error;
    }
  }
}
