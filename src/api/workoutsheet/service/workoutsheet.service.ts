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
import { DeleteWorkoutsheetDto } from '../dto/request/delete.workoutsheet.dto';
import { CreateWorkoutsheetDto } from '../dto/request/create.workoutsheet.dto';
import { WorkoutsheetModel } from '../../../models/workoutsheet.model';
import { WorkoutClientModel } from '../../../models/workout.client.model';
import { WorkoutRepository } from '../../workout/repository/workout.repository';

@Injectable()
export class WorkoutsheetService {
  constructor(
    private readonly workoutService: WorkoutService,
    private readonly workoutsheetRepository: WorkoutsheetRepository,
    private readonly workoutRepository: WorkoutRepository,
  ) {}

  async getAllWorkoutSheetByIdClient(idClient: string, idCompany: string) {
    try {
      const workoutSheetRows =
        await this.workoutsheetRepository.getAllWorkoutsheetByIdClientAdmin(
          idClient,
          idCompany,
        );

      if (workoutSheetRows.length == 0) {
        return [];
      }

      const idWorkoutsheetDefaultList = workoutSheetRows.map(
        (item) => item.idWorkoutsheetDefault,
      );

      const workoutsheetDefaultList =
        await this.workoutsheetRepository.getWorkoutsheetDefaultByIdList(
          idCompany,
          idWorkoutsheetDefaultList,
        );

      const idWorkoutsheetList = workoutSheetRows.map((item) => item.id);

      const workoutList =
        await this.workoutService.findWorkoutClientByWorkoutSheet(
          idWorkoutsheetList,
          idCompany,
        );

      let mediaList = [];
      if (workoutList.length > 0) {
        const idWorkoutList = workoutList.map((w) => w.idWorkout);

        mediaList = await this.workoutRepository.findManyMediaByIdWorkout(
          idWorkoutList,
          idCompany,
        );
      }

      // mapeando workout no workoutSheetDefaultWorkout
      const retorno = workoutSheetRows.map((item) => {
        item.workoutClientList = workoutList
          .filter((workout) => workout.idWorkoutSheet == item.id)
          .map((w) => {
            w.mediaList = mediaList.filter((m) => m.idWorkout == w.idWorkout);
            return w;
          });

        item.workoutsheetDefault = workoutsheetDefaultList.find(
          (workoutsheetDefault) =>
            workoutsheetDefault.id == item.idWorkoutsheetDefault,
        );

        return item;
      });

      return retorno;
    } catch (error) {
      throw error;
    }
  }

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
        await this.workoutsheetRepository.createWorkoutSheetDefault(
          title,
          idCompany,
        );

      await this.workoutsheetRepository.createWorkoutSheetDefaultWorkout(
        idWorkoutSheetDefault,
        createWorkoutsheetDefaultDto.idCompany,
        createWorkoutsheetDefaultDto.workoutList,
      );

      return { status: 'success' };
    } catch (error) {
      throw error;
    }
  }

  async createWorkoutSheet(createWorkoutsheetDto: CreateWorkoutsheetDto) {
    try {
      if (hasDuplicates(createWorkoutsheetDto.workoutsheetDefaultIdList)) {
        throw new HttpException(
          DomainError.DUPLICATE_ITEMS,
          HttpStatus.BAD_REQUEST,
        );
      }

      const workoutsheetClientList =
        await this.workoutsheetRepository.getAllWorkoutsheetByIdClientAdmin(
          createWorkoutsheetDto.idClient,
          createWorkoutsheetDto.idCompany,
        );

      let order =
        workoutsheetClientList.length == 0
          ? 0
          : workoutsheetClientList[workoutsheetClientList.length - 1]
              .workoutsheetOrder + 1;

      const workoutsheetDefaultList =
        await this.workoutsheetRepository.getWorkoutsheetDefaultByIdList(
          createWorkoutsheetDto.idCompany,
          createWorkoutsheetDto.workoutsheetDefaultIdList,
        );

      const workoutsheetListToInsert: WorkoutsheetModel[] = [];

      workoutsheetDefaultList.forEach((workoutsheetDefault) => {
        const alreadyExistsToClient = workoutsheetClientList.find((w) => {
          return w.idWorkoutSheetDefault == workoutsheetDefault.id;
        });

        if (alreadyExistsToClient == undefined) {
          // create workoutsheet
          workoutsheetListToInsert.push(
            new WorkoutsheetModel({
              name: workoutsheetDefault.title,
              idCompany: createWorkoutsheetDto.idCompany,
              idClient: createWorkoutsheetDto.idClient,
              idWorkoutsheetDefault: workoutsheetDefault.id,
              workoutsheetOrder: order++,
            }),
          );
        }
      });

      if (workoutsheetListToInsert.length != 0) {
        await this.workoutsheetRepository.createWorkoutSheet(
          workoutsheetListToInsert,
        );
      }

      // retrieving all Workoutsheet by this client
      const _allWorkoutsheetClientList =
        await this.getAllWorkoutSheetByIdClient(
          createWorkoutsheetDto.idClient,
          createWorkoutsheetDto.idCompany,
        );

      // filtering just inserted workoutsheet
      const allInsertedWorkoutsheetClientList =
        _allWorkoutsheetClientList.filter((e) =>
          createWorkoutsheetDto.workoutsheetDefaultIdList.includes(
            e.workoutsheetDefault.id,
          ),
        );

      // retrieving workout by workoutsheetDefault id
      const workoutListByWorkoutsheetDefault =
        await this.workoutService.findManyWorkoutByIdWorkoutheetList(
          allInsertedWorkoutsheetClientList.map(
            (w) => w.workoutsheetDefault.id,
          ),
          createWorkoutsheetDto.idCompany,
        );

      const workoutClientToInsert: WorkoutClientModel[] = [];

      // mapping workout to workoutClient
      allInsertedWorkoutsheetClientList.forEach((workoutsheet) => {
        const workoutList = workoutListByWorkoutsheetDefault.filter(
          (w) => w.idWorkoutSheetDefault == workoutsheet.idWorkoutsheetDefault,
        );

        workoutList.forEach((w) => {
          workoutClientToInsert.push(
            new WorkoutClientModel({
              idWorkout: w.idWorkout,
              title: w.title,
              subtitle: w.subtitle,
              description: w.description,
              idWorkoutSheet: workoutsheet.id,
              idCompany: w.idCompany,
              workoutOrder: w.workoutOrder,
            }),
          );
        });
      });

      if (workoutClientToInsert.length > 0) {
        await this.workoutsheetRepository.createWorkoutClient(
          workoutClientToInsert,
        );
      }

      return { status: 'success' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteWorkoutsheet(deleteWorkoutsheetDto: DeleteWorkoutsheetDto) {
    try {
      //delete workoutsheet based on workoutsheetdefault id and id client
      await this.workoutsheetRepository.deleteWorkoutsheetByIdWorkoutsheetDefaultList(
        deleteWorkoutsheetDto.idList,
        deleteWorkoutsheetDto.idClient,
        deleteWorkoutsheetDto.idCompany,
      );

      return { status: 'success' };
    } catch (error) {
      throw error;
    }
  }

  async updateWorkoutSheetDefaultWorkout(
    updateWorkoutsheetDefaultDto: UpdateWorkoutsheetDefaultDto,
  ) {
    try {
      await this.workoutsheetRepository.updateWorkoutSheetDefault(
        updateWorkoutsheetDefaultDto.title,
        updateWorkoutsheetDefaultDto.idWorkoutSheetDefault,
      );

      await this.workoutsheetRepository.deleteWorkoutSheetDefaultWorkout(
        updateWorkoutsheetDefaultDto.idWorkoutSheetDefault,
      );

      await this.workoutsheetRepository.createWorkoutSheetDefaultWorkout(
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
        await this.workoutsheetRepository.getAllWorkoutsheetDefaultByIdCompanyAdmin(
          idCompany,
        );
      const workoutSheetDefaultWorkoutRows =
        await this.workoutsheetRepository.getAllWorkoutsheetDefaultWorkoutByIdCompanyAdmin(
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
      await this.workoutsheetRepository.deleteWorkoutSheetDefaultWorkout(
        idWorkoutSheetDefault,
      );

      await this.workoutsheetRepository.deleteById(idWorkoutSheetDefault);

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
    const rows = await this.workoutsheetRepository.getMyTrainingProgram(user);
    return this._convertRowsToMyTrainingProgramResponseDto(rows);
  }

  async getAllMyCurrentWorkoutSheetsWithWorkouts(user: AccessTokenModel) {
    const rows =
      await this.workoutsheetRepository.getAllMyCurrentWorkoutSheetsWithWorkouts(
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
          workoutsheetOrder: row.workoutSheetOrder,
          workouts: {},
        };
      }

      const workoutMediaDto = new WorkoutMediaDto({
        mediaId: row.mediaId,
        mediaTitle: row.mediaTitle,
        mediaFormat: row.mediaFormat,
        mediaType: row.mediaType,
        mediaUrl: row.mediaUrl,
        mediaOrder: row.mediaOrder,
        thumbnailUrl: row.thumbnailUrl,
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
          workoutOrder: row.workoutOrder,
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
          workoutsheetOrder: row.workoutSheetOrder,
          workouts: {},
        };
      }

      const workoutMediaDto =
        row.mediaId == null
          ? undefined
          : new WorkoutMediaDto({
              mediaId: row.mediaId,
              mediaTitle: row.mediaTitle,
              mediaFormat: row.mediaFormat,
              mediaType: row.mediaType,
              mediaUrl: row.mediaUrl,
              thumbnailUrl: row.thumbnailUrl,
              mediaOrder: row.mediaOrder,
            });

      if (!workoutSheetsMap[row.workoutSheetId].workouts[row.workoutId]) {
        workoutSheetsMap[row.workoutSheetId].workouts[row.workoutId] = {
          id: row.workoutId,
          title: row.workoutTitle,
          subtitle: row.workoutSubtitle,
          description: row.workoutDescription,
          workoutOrder: row.workoutOrder,
          breaktime: row.workoutBreakTime,
          serie: row.workoutSeries,
          media: [],
        };
      }

      if (workoutMediaDto != undefined) {
        workoutSheetsMap[row.workoutSheetId].workouts[row.workoutId].media.push(
          workoutMediaDto,
        );
      }
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
      const rows = await this.workoutsheetRepository.getUrlMediasForSync(user);
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
      await this.workoutsheetRepository.workoutSheetDone(
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
      return await this.workoutsheetRepository.createWorkoutsheetFeedback(
        feedback,
        idWorkoutsheet,
      );
    } catch (error) {
      throw error;
    }
  }
}
