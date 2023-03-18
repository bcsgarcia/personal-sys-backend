import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { RecordsController } from './records/records.controller';
import { WebApiModule } from './web-api/web-api.module';

@Module({
  imports: [DatabaseModule, WebApiModule],
  controllers: [AppController, RecordsController],
  providers: [AppService, DatabaseService],
  exports: [DatabaseService],
})
export class AppModule {}
