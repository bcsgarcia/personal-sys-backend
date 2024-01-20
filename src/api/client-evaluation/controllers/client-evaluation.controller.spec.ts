import { Test, TestingModule } from '@nestjs/testing';
import { ClientEvaluationController } from './client-evaluation.controller';
import { ClientEvaluationService } from '../service/client-evaluation.service';

describe('ClientEvaluationController', () => {
  let controller: ClientEvaluationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientEvaluationController],
      providers: [ClientEvaluationService],
    }).compile();

    controller = module.get<ClientEvaluationController>(ClientEvaluationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
