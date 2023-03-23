import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from '../service/notification.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('AppController', () => {
  let app: INestApplication;
  let controller: NotificationController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [NotificationService],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    controller = module.get<NotificationController>(NotificationController);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('validateHeader', () => {
    it('should throw an exception if an invalid idCompany is received', async () => {
      const invalidIdCompany = '';
      const response = await request(app.getHttpServer())
        .post('web/notification')
        .set('idcompany', invalidIdCompany);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toBe('Invalid idCompany');
    });

    it('should return success if a valid idCompany is received', async () => {
      const validIdCompany = '0e71f0d1-c7da-11ed-86dc-0242ac110002';
      const response = await request(app.getHttpServer())
        .get('web/notification')
        .set('idcompany', validIdCompany);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.message).toBe('Success');
    });
  });
});

