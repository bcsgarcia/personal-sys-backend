import { Module } from '@nestjs/common';
import { CompanyService } from './service/company.service';
import { CompanyController } from './controllers/company.controller';
import { DatabaseService } from 'src/database/database.service';
import { CompanyRepository } from './respository/company.repository';

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
  ],
})
export class CompanyModule {}
