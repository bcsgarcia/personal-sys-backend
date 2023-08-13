import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateWorkoutDto } from '../dto/create-workout.dto';
import { UpdateWorkoutDto } from '../dto/update-workout.dto';
import { CreateWorkoutMediaDto } from '../dto/create-workout-media.dto';

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

  async createWorkoutMedia(
    workoutMediaList: CreateWorkoutMediaDto[],
    idWorkout: string,
    idCompany: string,
  ): Promise<void> {
    try {
      const params = workoutMediaList
        .map(
          (item) =>
            `('${idWorkout}', '${idCompany}', '${item.idMedia}', ${item.mediaOrder})`,
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

  async findLastInseted(workout: CreateWorkoutDto): Promise<any> {
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

  async findAllWorkoutMedia(idCompany: string): Promise<any> {
    try {
      return this.databaseService.execute(
        `SELECT *
         FROM workoutMedia
         WHERE idCompany = '${idCompany}'`,
      );
    } catch (error) {
      throw error;
    }
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
