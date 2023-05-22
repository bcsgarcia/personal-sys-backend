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
import { WorkoutMediaDto } from '../dto/response/workout-media.dto';
import { MediaForSyncDto } from '../dto/response/media-for-sync.dto';

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

  async getMyTrainingProgram(user: AccessTokenModel): Promise<WorkoutSheetResponseDto[]> {
    const rows = await this.workoutSheetRepository.getMyTrainingProgram(user);
    return this._convertRowsToWorkoutSheetResponseDto(rows);

  }

  async getAllMyCurrentWorkoutSheetsWithWorkouts(user: AccessTokenModel) {
    const rows = await this.workoutSheetRepository.getAllMyCurrentWorkoutSheetsWithWorkouts(user);
    return this._convertRowsToWorkoutSheetResponseDto(rows);

  }

  _convertRowsToWorkoutSheetResponseDto(rows: any): WorkoutSheetResponseDto[] {
    // Group rows by workoutSheetId as there might be multiple workouts per sheet
    const workoutSheetsMap: Record<number, any> = {};
    for (const row of rows) {
      if (!workoutSheetsMap[row.workoutSheetId]) {
        workoutSheetsMap[row.workoutSheetId] = {
          id: row.workoutSheetId,
          date: row.workoutSheedConclusionDate,
          name: row.workoutSheetName,
          order: row.workoutSheetOrder,
          workouts: {}
        };
      }

      const workoutMediaDto = new WorkoutMediaDto({
        mediaId: row.mediaId,
        mediaTitle: row.mediaTitle,
        mediaFormat: row.mediaFormat,
        mediaType: row.mediaType,
        mediaUrl: row.mediaUrl,
      });

      if (!workoutSheetsMap[row.workoutSheetId].workouts[row.workoutId]) {
        workoutSheetsMap[row.workoutSheetId].workouts[row.workoutId] = {
          id: row.workoutId,
          title: row.workoutTitle,
          subtitle: row.workoutSubtitle,
          description: row.workoutDescription,
          order: row.workoutOrder,
          breaktime: row.workoutBreakTime,
          serie: row.workoutSeries,
          media: []
        };
      }

      workoutSheetsMap[row.workoutSheetId].workouts[row.workoutId].media.push(workoutMediaDto);
    }

    // Convert each grouped workout sheet object and its workouts to DTOs
    const workoutSheetResponseDtos = Object.values(workoutSheetsMap).map(data => {
      data.workouts = Object.values(data.workouts).map(workoutData => new WorkoutResponseDto(workoutData));
      return new WorkoutSheetResponseDto(data);
    });

    return workoutSheetResponseDtos;
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

  async getUrlMidiaForSync(user: AccessTokenModel): Promise<MediaForSyncDto[]> {
    try {

      const rows = await this.workoutSheetRepository.getUrlMediasForSync(user);
      const allMidias = rows.map((media) => new MediaForSyncDto(media));

      let uniqueMedias: MediaForSyncDto[] = Array.from(
        allMidias.reduce((map, obj) => map.set(obj.id, obj), new Map<string, MediaForSyncDto>()).values()
      );

      return uniqueMedias;

    } catch (error) {
      throw error;
    }
  }

  async workoutSheetDone(idWorkoutsheet: string, user: AccessTokenModel): Promise<void> {
    try {
      return await this.workoutSheetRepository.workoutSheetDone(idWorkoutsheet, user.clientIdCompany);
    } catch (error) {
      throw error;
    }
  }


}
