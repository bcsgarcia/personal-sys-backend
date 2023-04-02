import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutsheetService } from '../service/workoutsheet.service';
import { WorkoutsheetController } from './workoutsheet.controller';

describe('WorkoutsheetController', () => {
  let controller: WorkoutsheetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutsheetController],
      providers: [WorkoutsheetService],
    }).compile();

    controller = module.get<WorkoutsheetController>(WorkoutsheetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
