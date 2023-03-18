import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { RecordsController } from './records/records.controller';
import { WebModule } from './web/web.module';

@Module({
  imports: [DatabaseModule, WebModule],
  controllers: [AppController, RecordsController],
  providers: [AppService, DatabaseService],
  exports: [DatabaseService],
})
export class AppModule {}
