import { Module } from '@nestjs/common';
import { CompanyService } from './service/company.service';
import { CompanyController } from './controllers/company.controller';
import { DatabaseService } from 'src/database/database.service';
import { CompanyRepository } from './respository/company.repository';
import { MediaRepository } from '../media/repository/media.repository';

@Module({
  controllers: [CompanyController],
  providers: [
    CompanyService,
    DatabaseService,
    {
      provide: CompanyRepository,
      useFactory: (databaseService: DatabaseService) =>
        new CompanyRepository(databaseService),
      inject: [DatabaseService],
    },
    {
      provide: MediaRepository,
      useFactory: (databaseService: DatabaseService) =>
        new CompanyRepository(databaseService),
      inject: [DatabaseService],
    },
  ],
})
export class CompanyModule {}
