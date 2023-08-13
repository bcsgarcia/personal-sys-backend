import { Injectable } from '@nestjs/common';
import { Workout } from 'src/models/workout.model';
import { WorkoutRepository } from 'src/api/workout/repository/workout.repository';
import { CreateWorkoutDto } from '../dto/create-workout.dto';
import { UpdateWorkoutDto } from '../dto/update-workout.dto';
import { MediaRepository } from '../../media/repository/media.repository';

@Injectable()
export class WorkoutService {
  constructor(
    private readonly workoutRepository: WorkoutRepository,
    private readonly mediaRepository: MediaRepository,
  ) {}

  async create(createWorkoutDto: CreateWorkoutDto) {
    try {
      await this.workoutRepository.create(createWorkoutDto);

      const workout = await this.workoutRepository.findLastInseted(
        createWorkoutDto,
      );

      await this.workoutRepository.createWorkoutMedia(
        createWorkoutDto.workoutMediaList,
        workout[0].id,
        createWorkoutDto.idCompany,
      );

      return { status: 'success' };
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
      return await this.workoutRepository.createFeedback(
        idWorkoutClient,
        idCompany,
        feedback,
      );
    } catch (error) {
      throw error;
    }
  }

  async update(updateWorkoutDto: UpdateWorkoutDto) {
    try {
      await this.workoutRepository.update(updateWorkoutDto);

      await this.workoutRepository.deleteWorkoutMedia(updateWorkoutDto.id);

      if (updateWorkoutDto.workoutMediaList.length > 0) {
        await this.workoutRepository.createWorkoutMedia(
          updateWorkoutDto.workoutMediaList,
          updateWorkoutDto.id,
          updateWorkoutDto.idCompany,
        );
      }

      return { status: 'success' };
    } catch (error) {
      throw error;
    }
  }

  async findAll(idCompany: string): Promise<Workout[]> {
    try {
      const rows = await this.workoutRepository.findAll(idCompany);
      const workoutMediaList = await this.workoutRepository.findAllWorkoutMedia(
        idCompany,
      );
      const workoutList = rows.map((row) => new Workout(row));
      const mediaList = await this.mediaRepository.findAll(idCompany);

      const retorno = workoutList.map((item) => {
        // Obter todos os workoutMedia que correspondem ao item.id
        const workoutMediaMatches = workoutMediaList.filter(
          (workoutMedia) => workoutMedia.idWorkout == item.id,
        );

        // Pegar os IDs de todos os workoutMediaMatches
        item.workoutMediaList = workoutMediaMatches.map((wm) => {
          return {
            media: mediaList.find((media) => media.id === wm.idMedia),
            mediaOrder: wm.mediaOrder,
          };
        });

        // Filtrar os mediaList que correspondem aos IDs obtidos
        return item;
      });

      return retorno;
    } catch (error) {
      throw error;
    }
  }

  async remove(idWorkout: string) {
    try {
      await this.workoutRepository.deleteWorkoutMedia(idWorkout);

      await this.workoutRepository.deleteById(idWorkout);

      return { status: 'success' };
    } catch (error) {
      throw error;
    }
  }
}
