import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, DatabaseService],
})
export class CompanyModule {}
