import { Test, TestingModule } from '@nestjs/testing';
import { ClientProfileController } from './client-profile.controller';
import { ClientProfileService } from '../service/client-profile.service';

describe('ClientProfileController', () => {
  let controller: ClientProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientProfileController],
      providers: [ClientProfileService],
    }).compile();

    controller = module.get<ClientProfileController>(ClientProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
