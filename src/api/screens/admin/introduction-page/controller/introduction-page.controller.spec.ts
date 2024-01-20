import { Test, TestingModule } from '@nestjs/testing';
import { IntroductionPageController } from './introduction-page.controller';
import { IntroductionPageService } from '../service/introduction-page.service';

describe('IntroductionPageController', () => {
  let controller: IntroductionPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntroductionPageController],
      providers: [IntroductionPageService],
    }).compile();

    controller = module.get<IntroductionPageController>(IntroductionPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
