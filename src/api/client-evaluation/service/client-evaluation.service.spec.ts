import { Test, TestingModule } from '@nestjs/testing';
import { ClientEvaluationService } from './client-evaluation.service';

describe('ClientEvaluationService', () => {
  let service: ClientEvaluationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientEvaluationService],
    }).compile();

    service = module.get<ClientEvaluationService>(ClientEvaluationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
