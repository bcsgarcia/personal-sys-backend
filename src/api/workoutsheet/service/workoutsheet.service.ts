import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Workout } from 'src/models/workout.model';
import { DomainError } from 'src/api/utils/domain.error';
import { hasDuplicates } from 'src/api/utils/has.duplicates';
import { CreateWorkoutsheetDefaultDto } from '../dto/request/create.workoutsheet.default.dto';
import { GetAllWorkoutSheetDefaultDto } from '../dto/request/get.all.workoutsheet.default.dto';
import { UpdateWorkoutsheetDefaultDto } from '../dto/request/update.workoutsheet.default.dto';
import { WorkoutsheetRepository } from '../respository/workoutsheet.repository';
import { AccessTokenModel } from 'src/models/access-token-user.model';
import { WorkoutResponseDto } from '../dto/response/workout-response.dto';
import { isToday } from '../../utils/is-today';
import { WorkoutSheetResponseDto } from '../dto/response/workoutsheet-response.dto';

@Injectable()
export class WorkoutsheetService {
  constructor(
    private readonly workoutSheetRepository: WorkoutsheetRepository,
  ) { }

  async createWorkoutSheetDefault(
    createWorkoutsheetDefaultDto: CreateWorkoutsheetDefaultDto,
  ): Promise<void> {
    try {
      if (hasDuplicates(createWorkoutsheetDefaultDto.workouts)) {
        throw new HttpException(
          DomainError.DUPLICATE_ITEMS,
          HttpStatus.BAD_REQUEST,
        );
      }

      const title = createWorkoutsheetDefaultDto.title;
      const idCompany = createWorkoutsheetDefaultDto.idCompany;

      const idWorkoutSheetDefault =
        await this.workoutSheetRepository.createWorkoutSheetDefault(
          title,
          idCompany,
        );

      await this._createWorkoutSheetDefaultWorkout(
        idWorkoutSheetDefault,
        createWorkoutsheetDefaultDto.workouts,
      );
    } catch (error) {
      throw error;
    }
  }

  async updateWorkoutSheetDefaultWorkout(
    updateWorkoutsheetDefaultDto: UpdateWorkoutsheetDefaultDto,
  ): Promise<void> {
    try {
      const idWorkoutSheetDefault =
        updateWorkoutsheetDefaultDto.idWorkoutSheetDefault;
      const workouts = updateWorkoutsheetDefaultDto.workouts;

      await this.workoutSheetRepository.deleteWorkoutSheetDefaultWorkout(
        updateWorkoutsheetDefaultDto.idWorkoutSheetDefault,
      );

      await this._createWorkoutSheetDefaultWorkout(
        idWorkoutSheetDefault,
        workouts,
      );
    } catch (error) {
      throw error;
    }
  }

  async getAllWorkoutSheetDefaultByIdCompany(
    idCompany: string,
  ): Promise<GetAllWorkoutSheetDefaultDto[]> {
    try {
      const rows =
        await this.workoutSheetRepository.getAllWorkoutSheetDefaultByIdCompany(
          idCompany,
        );

      const groupedByWorkousheetDefaultId = rows.reduce((acc, item) => {
        if (!acc[item.wsdId]) {
          acc[item.wsdId] = new GetAllWorkoutSheetDefaultDto({
            idWorkoutSheetDefault: item.wsdId,
            titleWorkoutSheetDefault: item.wsdTitle,
            workouts: [],
          });
        }

        const workout = new Workout({
          id: item.workoutId,
          isActive: item.wIsActive,
          lastUpdate: item.wLastUpdate,
          title: item.wTitle,
          subTitle: item.wSubTitle,
          description: item.wDesc,
          idCompany: item.wsdId,
          videoUrl: item.wVideoUrl,
          imageUrl: item.wImageUrl,
        });

        acc[item.wsdId].workouts.push(workout);
        return acc;
      }, {});

      const result = Object.values(
        groupedByWorkousheetDefaultId,
      ) as GetAllWorkoutSheetDefaultDto[];
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteWorkoutSheetDefault(
    idWorkoutSheetDefault: string,
  ): Promise<void> {
    try {
      await this.workoutSheetRepository.deleteWorkoutSheetDefaultWorkout(
        idWorkoutSheetDefault,
      );

      await this.workoutSheetRepository.deleteById(idWorkoutSheetDefault);
    } catch (error) {
      throw new HttpException(
        DomainError.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async _createWorkoutSheetDefaultWorkout(
    idWorkoutSheetDefault: string,
    workouts: string[],
  ): Promise<void> {
    try {
      for (const item of workouts) {
        await this.workoutSheetRepository.createWorkoutSheetDefaultWorkout(
          idWorkoutSheetDefault,
          item,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async getMyTrainingProgram(user: AccessTokenModel): Promise<WorkoutSheetResponseDto[]> {
    try {
      // Retrieve the user's training program and convert it to a readable format
      const rows = await this.workoutSheetRepository.getMyTrainingProgram(user);
      const myTrainingPlan = this.convertRowsToWorkoutSheetResponseDto(rows);

      // Check if the user has already completed today's workout
      const lastWorkout = myTrainingPlan[myTrainingPlan.length - 1];
      const todaysWorkoutHasBeenDone = isToday(lastWorkout.date);
      if (todaysWorkoutHasBeenDone) {
        return myTrainingPlan;
      }

      // Get the user's current workout sheets and convert them to a readable format
      const rowsCurrentWorkoutSheets = await this.workoutSheetRepository.getAllMyCurrentWorkoutSheetsWithWorkouts(user);
      const allMyCurrentWorkoutSheets = this.convertRowsToWorkoutSheetResponseDto(rowsCurrentWorkoutSheets);

      // Determine the order of the next workout sheet
      const orders = allMyCurrentWorkoutSheets.map((workoutSheet) => workoutSheet.order);
      const nextWorkoutSheetOrder = this.getNextWorkoutOrder(orders, lastWorkout.order);

      // Add the next workout sheet to the user's training plan and return it
      myTrainingPlan.push(allMyCurrentWorkoutSheets[nextWorkoutSheetOrder - 1]);
      return myTrainingPlan;

    } catch (error) {
      throw error;
    }

  }

  getNextWorkoutOrder(workoutSheets: number[], lastWorkoutDone: number): number {
    // Find the index of the last workout done in the workout sheets array
    const lastWorkoutIndex = workoutSheets.indexOf(lastWorkoutDone);

    // If the last workout is not found or is the last element in the array, return the first workout
    if (lastWorkoutIndex === -1 || lastWorkoutIndex === workoutSheets.length - 1) {
      return workoutSheets[0];
    }

    // Otherwise, return the next workout in the array
    return workoutSheets[lastWorkoutIndex + 1];
  }


  convertRowsToWorkoutSheetResponseDto(rows: any[]): WorkoutSheetResponseDto[] {
    const groupedWorkouts = new Map<number, WorkoutSheetResponseDto>();

    for (const row of rows) {
      const workout: WorkoutResponseDto = {
        title: row.workoutTitle,
        subtitle: row.workoutSubtitle,
        description: row.workoutDescription,
        imageUrl: row.workoutImageUrl,
        videoUrl: row.workoutVideoUrl,
        order: row.workoutOrder,
        breaktime: row.workoutBreakTime,
        serie: row.workoutSeries,
      };

      const workoutSheetId = row.workoutSheetId;
      let workoutSheet = groupedWorkouts.get(workoutSheetId);

      if (!workoutSheet) {
        workoutSheet = {
          id: workoutSheetId,
          date: row.workoutSheedConclusionDate === undefined ? null : new Date(row.workoutSheedConclusionDate),
          name: row.workoutSheetName,
          order: row.workoutSheetOrder,
          workouts: [],
        };
        groupedWorkouts.set(workoutSheetId, workoutSheet);
      }

      workoutSheet.workouts.push(workout);
    }

    return Array.from(groupedWorkouts.values());
  }



}
