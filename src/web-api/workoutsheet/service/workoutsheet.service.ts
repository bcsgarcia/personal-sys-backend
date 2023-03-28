import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Workout } from 'src/models/workout.model';
import { DomainError } from 'src/web-api/utils/domain.error';
import { hasDuplicates } from 'src/web-api/utils/has.duplicates';
import { CreateWorkoutsheetDefaultDto } from '../dto/create.workoutsheet.default.dto';
import { GetAllWorkoutSheetDefaultDto } from '../dto/get.all.workoutsheet.default.dto';
import { UpdateWorkoutsheetDefaultDto } from '../dto/update.workoutsheet.default.dto';
import { WorkoutsheetRepository } from '../respository/workoutsheet.repository';

@Injectable()
export class WorkoutsheetService {

  constructor(private readonly workoutSheetRepository: WorkoutsheetRepository) { }


  async createWorkoutSheetDefault(createWorkoutsheetDefaultDto: CreateWorkoutsheetDefaultDto): Promise<void> {
    try {

      if (hasDuplicates(createWorkoutsheetDefaultDto.workouts)) {
        throw new HttpException(DomainError.DUPLICATE_ITEMS, HttpStatus.BAD_REQUEST);
      }

      const title = createWorkoutsheetDefaultDto.title;
      const idCompany = createWorkoutsheetDefaultDto.idCompany;

      const idWorkoutSheetDefault = await this.workoutSheetRepository.createWorkoutSheetDefault(title, idCompany);


      await this._createWorkoutSheetDefaultWorkout(idWorkoutSheetDefault, createWorkoutsheetDefaultDto.workouts);

    } catch (error) {
      throw error;
    }
  }

  async updateWorkoutSheetDefaultWorkout(updateWorkoutsheetDefaultDto: UpdateWorkoutsheetDefaultDto): Promise<void> {
    try {

      const idWorkoutSheetDefault = updateWorkoutsheetDefaultDto.idWorkoutSheetDefault;
      const workouts = updateWorkoutsheetDefaultDto.workouts;

      await this.workoutSheetRepository.deleteWorkoutSheetDefaultWorkout(updateWorkoutsheetDefaultDto.idWorkoutSheetDefault);

      await this._createWorkoutSheetDefaultWorkout(idWorkoutSheetDefault, workouts);

    } catch (error) {
      throw error;
    }
  }

  async getAllWorkoutSheetDefaultByIdCompany(idCompany: string): Promise<GetAllWorkoutSheetDefaultDto[]> {
    try {

      const rows = await this.workoutSheetRepository.getAllWorkoutSheetDefaultByIdCompany(idCompany);

      console.log(rows);

      const dtoList: GetAllWorkoutSheetDefaultDto[] = [];

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


      const result = Object.values(groupedByWorkousheetDefaultId) as GetAllWorkoutSheetDefaultDto[];

      return result;
    } catch (error) {
      throw error;
    }

  }

  async deleteWorkoutSheetDefault(idWorkoutSheetDefault: string): Promise<void> {
    try {

      await this.workoutSheetRepository.deleteWorkoutSheetDefaultWorkout(idWorkoutSheetDefault);

      await this.workoutSheetRepository.deleteById(idWorkoutSheetDefault);

    } catch (error) {
      throw new HttpException(DomainError.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async _createWorkoutSheetDefaultWorkout(idWorkoutSheetDefault: string, workouts: string[]): Promise<void> {
    try {

      for (const item of workouts) {
        await this.workoutSheetRepository.createWorkoutSheetDefaultWorkout(idWorkoutSheetDefault, item);
      }

    } catch (error) {
      throw error;
    }
  }



}
