import { Module } from '@nestjs/common';

import { IntroductionPageService } from './service/introduction-page.service';
import { IntroductionPageController } from './controller/introduction-page.controller';
import { CompanyService } from 'src/api/company/service/company.service';
import { DatabaseService } from 'src/database/database.service';
import { CompanyRepository } from 'src/api/company/respository/company.repository';

import { MediaRepository } from '../../../media/repository/media.repository';

@Module({
  controllers: [IntroductionPageController],
  providers: [
    IntroductionPageService,
    CompanyService,
    DatabaseService,
    {
      provide: CompanyRepository,
      useFactory: (databaseService: DatabaseService) => new CompanyRepository(databaseService),
      inject: [DatabaseService],
    },
    {
      provide: MediaRepository,
      useFactory: (databaseService: DatabaseService) => new MediaRepository(databaseService),
      inject: [DatabaseService],
    },
  ],
})
export class IntroductionPageModule {}
