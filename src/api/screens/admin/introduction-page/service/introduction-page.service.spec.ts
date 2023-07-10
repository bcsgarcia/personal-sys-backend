import { Test, TestingModule } from '@nestjs/testing';
import { IntroductionPageService } from './introduction-page.service';

describe('IntroductionPageService', () => {
  let service: IntroductionPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntroductionPageService],
    }).compile();

    service = module.get<IntroductionPageService>(IntroductionPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
