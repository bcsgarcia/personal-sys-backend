import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DomainError } from 'src/api/utils/domain.error';
import { hasDuplicates } from 'src/api/utils/has.duplicates';
import { CreateWorkoutsheetDefaultDto } from '../dto/request/create.workoutsheet.default.dto';
import { UpdateWorkoutsheetDefaultDto } from '../dto/request/update.workoutsheet.default.dto';
import { WorkoutsheetRepository } from '../respository/workoutsheet.repository';
import { AccessTokenModel } from 'src/models/access-token-user.model';
import { WorkoutResponseDto } from '../dto/response/workout-response.dto';
import { WorkoutSheetResponseDto } from '../dto/response/workoutsheet-response.dto';
import { WorkoutMediaDto } from '../dto/response/workout-media.dto';
import { MediaForSyncDto } from '../dto/response/media-for-sync.dto';
import { WorkoutService } from '../../workout/service/workout.service';

@Injectable()
export class WorkoutsheetService {
  constructor(
    private readonly workoutService: WorkoutService,
    private readonly workoutSheetRepository: WorkoutsheetRepository,
  ) {}

  async createWorkoutSheetDefault(
    createWorkoutsheetDefaultDto: CreateWorkoutsheetDefaultDto,
  ) {
    try {
      if (hasDuplicates(createWorkoutsheetDefaultDto.workoutList)) {
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

      await this.workoutSheetRepository.createWorkoutSheetDefaultWorkout(
        idWorkoutSheetDefault,
        createWorkoutsheetDefaultDto.idCompany,
        createWorkoutsheetDefaultDto.workoutList,
      );

      // await this._createWorkoutSheetDefaultWorkout(
      //   idWorkoutSheetDefault,
      //   createWorkoutsheetDefaultDto.workoutList,
      // );

      return { status: 'success' };
    } catch (error) {
      throw error;
    }
  }

  async updateWorkoutSheetDefaultWorkout(
    updateWorkoutsheetDefaultDto: UpdateWorkoutsheetDefaultDto,
  ) {
    try {
      await this.workoutSheetRepository.updateWorkoutSheetDefault(
        updateWorkoutsheetDefaultDto.title,
        updateWorkoutsheetDefaultDto.idWorkoutSheetDefault,
      );

      await this.workoutSheetRepository.deleteWorkoutSheetDefaultWorkout(
        updateWorkoutsheetDefaultDto.idWorkoutSheetDefault,
      );

      await this.workoutSheetRepository.createWorkoutSheetDefaultWorkout(
        updateWorkoutsheetDefaultDto.idWorkoutSheetDefault,
        updateWorkoutsheetDefaultDto.idCompany,
        updateWorkoutsheetDefaultDto.workoutList,
      );

      return { status: 'success' };
    } catch (error) {
      throw error;
    }
  }

  async getAllWorkoutSheetDefaultByIdCompany(idCompany: string) {
    try {
      const workoutSheetDefaultRows =
        await this.workoutSheetRepository.getAllWorkoutSheetDefaultByIdCompanyAdmin(
          idCompany,
        );
      const workoutSheetDefaultWorkoutRows =
        await this.workoutSheetRepository.getAllWorkoutSheetDefaultWorkoutByIdCompanyAdmin(
          idCompany,
        );

      const workoutList = await this.workoutService.findAll(idCompany);

      // mapeando workout no workoutSheetDefaultWorkout
      const workoutSheetDefaultWorkoutRowsMapped =
        workoutSheetDefaultWorkoutRows.map((item) => {
          item.workout = workoutList.find(
            (workout) => workout.id == item.idWorkout,
          );
          return item;
        });

      const retorno = workoutSheetDefaultRows.map((workoutSheetDefault) => {
        workoutSheetDefault.workoutList =
          workoutSheetDefaultWorkoutRowsMapped.filter(
            (item) => item.idWorkoutSheetDefault == workoutSheetDefault.id,
          );

        return workoutSheetDefault;
      });

      return retorno;

      // const rows =
      //   await this.workoutSheetRepository.getAllWorkoutSheetDefaultByIdCompany(
      //     idCompany,
      //   );
      //
      // const groupedByWorkousheetDefaultId = rows.reduce((acc, item) => {
      //   if (!acc[item.wsdId]) {
      //     acc[item.wsdId] = new GetAllWorkoutSheetDefaultDto({
      //       idWorkoutSheetDefault: item.wsdId,
      //       titleWorkoutSheetDefault: item.wsdTitle,
      //       workouts: [],
      //     });
      //   }
      //
      //   const workout = new Workout({
      //     id: item.workoutId,
      //     isActive: item.wIsActive,
      //     lastUpdate: item.wLastUpdate,
      //     title: item.wTitle,
      //     subTitle: item.wSubTitle,
      //     description: item.wDesc,
      //     idCompany: item.wsdId,
      //     videoUrl: item.wVideoUrl,
      //     imageUrl: item.wImageUrl,
      //   });
      //
      //   acc[item.wsdId].workouts.push(workout);
      //   return acc;
      // }, {});
      //
      // const result = Object.values(
      //   groupedByWorkousheetDefaultId,
      // ) as GetAllWorkoutSheetDefaultDto[];
      // return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteWorkoutSheetDefault(idWorkoutSheetDefault: string) {
    try {
      await this.workoutSheetRepository.deleteWorkoutSheetDefaultWorkout(
        idWorkoutSheetDefault,
      );

      await this.workoutSheetRepository.deleteById(idWorkoutSheetDefault);

      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        DomainError.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMyTrainingProgram(
    user: AccessTokenModel,
  ): Promise<WorkoutSheetResponseDto[]> {
    const rows = await this.workoutSheetRepository.getMyTrainingProgram(user);
    return this._convertRowsToMyTrainingProgramResponseDto(rows);
  }

  async getAllMyCurrentWorkoutSheetsWithWorkouts(user: AccessTokenModel) {
    const rows =
      await this.workoutSheetRepository.getAllMyCurrentWorkoutSheetsWithWorkouts(
        user,
      );
    return this._convertRowsToWorkoutSheetResponseDto(rows);
  }

  _convertRowsToMyTrainingProgramResponseDto(
    rows: any,
  ): WorkoutSheetResponseDto[] {
    // Group rows by workoutSheetId as there might be multiple workouts per sheet
    const workoutSheetsMap: Record<number, any> = {};
    for (const row of rows) {
      if (!workoutSheetsMap[row.workoutSheedConclusionDate]) {
        workoutSheetsMap[row.workoutSheedConclusionDate] = {
          id: row.workoutSheetId,
          date: row.workoutSheedConclusionDate,
          name: row.workoutSheetName,
          order: row.workoutSheetOrder,
          workouts: {},
        };
      }

      const workoutMediaDto = new WorkoutMediaDto({
        mediaId: row.mediaId,
        mediaTitle: row.mediaTitle,
        mediaFormat: row.mediaFormat,
        mediaType: row.mediaType,
        mediaUrl: row.mediaUrl,
      });

      if (
        !workoutSheetsMap[row.workoutSheedConclusionDate].workouts[
          row.workoutId
        ]
      ) {
        workoutSheetsMap[row.workoutSheedConclusionDate].workouts[
          row.workoutId
        ] = {
          id: row.workoutId,
          title: row.workoutTitle,
          subtitle: row.workoutSubtitle,
          description: row.workoutDescription,
          order: row.workoutOrder,
          breaktime: row.workoutBreakTime,
          serie: row.workoutSeries,
          media: [],
        };
      }

      workoutSheetsMap[row.workoutSheedConclusionDate].workouts[
        row.workoutId
      ].media.push(workoutMediaDto);
    }

    // Convert each grouped workout sheet object and its workouts to DTOs
    const workoutSheetResponseDtos = Object.values(workoutSheetsMap).map(
      (data) => {
        data.workouts = Object.values(data.workouts).map(
          (workoutData) => new WorkoutResponseDto(workoutData),
        );
        return new WorkoutSheetResponseDto(data);
      },
    );

    return workoutSheetResponseDtos;
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
          workouts: {},
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
          media: [],
        };
      }

      workoutSheetsMap[row.workoutSheetId].workouts[row.workoutId].media.push(
        workoutMediaDto,
      );
    }

    // Convert each grouped workout sheet object and its workouts to DTOs
    const workoutSheetResponseDtos = Object.values(workoutSheetsMap).map(
      (data) => {
        data.workouts = Object.values(data.workouts).map(
          (workoutData) => new WorkoutResponseDto(workoutData),
        );
        return new WorkoutSheetResponseDto(data);
      },
    );

    return workoutSheetResponseDtos;
  }

  // async _createWorkoutSheetDefaultWorkout(
  //   idWorkoutSheetDefault: string,
  //   workoutList: CreateWorkoutsheetDefaultWorkoutDto[],
  // ): Promise<void> {
  //   try {
  //     await this.workoutSheetRepository.createWorkoutSheetDefaultWorkout(
  //       idWorkoutSheetDefault,
  //       workoutList,
  //     );
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async getUrlMidiaForSync(user: AccessTokenModel): Promise<MediaForSyncDto[]> {
    try {
      const rows = await this.workoutSheetRepository.getUrlMediasForSync(user);
      const allMidias = rows.map((media) => new MediaForSyncDto(media));

      const uniqueMedias: MediaForSyncDto[] = Array.from(
        allMidias
          .reduce(
            (map, obj) => map.set(obj.id, obj),
            new Map<string, MediaForSyncDto>(),
          )
          .values(),
      );

      return uniqueMedias;
    } catch (error) {
      throw error;
    }
  }

  async workoutSheetDone(
    idWorkoutsheet: string,
    user: AccessTokenModel,
  ): Promise<void> {
    try {
      await this.workoutSheetRepository.workoutSheetDone(
        idWorkoutsheet,
        user.clientIdCompany,
      );
    } catch (error) {
      throw error;
    }
  }

  async createWorkoutsheetFeedback(
    feedback: string,
    idWorkoutsheet: string,
  ): Promise<void> {
    try {
      return await this.workoutSheetRepository.createWorkoutsheetFeedback(
        feedback,
        idWorkoutsheet,
      );
    } catch (error) {
      throw error;
    }
  }
}
