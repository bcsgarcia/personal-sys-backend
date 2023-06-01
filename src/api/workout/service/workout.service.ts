import { Injectable } from '@nestjs/common';
import { Workout } from 'src/models/workout.model';
import { WorkoutRepository } from 'src/api/workout/repository/workout.repository';
import { CreateWorkoutDto } from '../dto/create-workout.dto';
import { UpdateWorkoutDto } from '../dto/update-workout.dto';

@Injectable()
export class WorkoutService {
  constructor(private readonly workoutRepository: WorkoutRepository) {}

  async create(createWorkoutDto: CreateWorkoutDto): Promise<void> {
    try {
      return await this.workoutRepository.create(createWorkoutDto);
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

  async update(
    idWorkout: string,
    updateWorkoutDto: UpdateWorkoutDto,
  ): Promise<void> {
    try {
      return await this.workoutRepository.update(idWorkout, updateWorkoutDto);
    } catch (error) {
      throw error;
    }
  }

  async findAll(idCompany: string): Promise<Workout[]> {
    try {
      const rows = await this.workoutRepository.findAll(idCompany);

      return rows.map((row) => new Workout(row));
    } catch (error) {
      throw error;
    }
  }

  async remove(idWorkout: string): Promise<void> {
    try {
      return await this.workoutRepository.deleteById(idWorkout);
    } catch (error) {
      throw error;
    }
  }
}
