import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { DatabaseService } from 'src/database/database.service';
import { CompanyRepository } from './company.repository';

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
