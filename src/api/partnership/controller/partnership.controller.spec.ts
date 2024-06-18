import { Test, TestingModule } from '@nestjs/testing';
import { PartnershipController } from './partnership.controller';
import { PartnershipService } from '../service/partnership.service';

describe('PartnershipController', () => {
  let controller: PartnershipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnershipController],
      providers: [PartnershipService],
    }).compile();

    controller = module.get<PartnershipController>(PartnershipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
