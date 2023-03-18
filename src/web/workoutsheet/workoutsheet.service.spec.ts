import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutsheetService } from './workoutsheet.service';

describe('WorkoutsheetService', () => {
  let service: WorkoutsheetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkoutsheetService],
    }).compile();

    service = module.get<WorkoutsheetService>(WorkoutsheetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
