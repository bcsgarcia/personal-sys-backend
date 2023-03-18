import { Injectable } from '@nestjs/common';
import { CreateWorkoutsheetDto } from './dto/create-workoutsheet.dto';
import { UpdateWorkoutsheetDto } from './dto/update-workoutsheet.dto';

@Injectable()
export class WorkoutsheetService {
  create(createWorkoutsheetDto: CreateWorkoutsheetDto) {
    return 'This action adds a new workoutsheet';
  }

  findAll() {
    return `This action returns all workoutsheet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workoutsheet`;
  }

  update(id: number, updateWorkoutsheetDto: UpdateWorkoutsheetDto) {
    return `This action updates a #${id} workoutsheet`;
  }

  remove(id: number) {
    return `This action removes a #${id} workoutsheet`;
  }
}
