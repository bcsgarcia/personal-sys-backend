import { Controller, Get, Param } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Controller('records')
export class RecordsController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get(':tableName')
  async getAllRecords(@Param('tableName') tableName: string): Promise<any> {
    try {
      return await this.databaseService.execute(`SELECT * FROM ${tableName}`);
    } catch (error) {
      throw error;
    }
  }
}
