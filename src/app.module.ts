import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
// import { DataSourceOptions } from 'typeorm';
import { RecordsController } from './records/records.controller';

// const connectionOptions: DataSourceOptions = {
//   type: 'mysql',
//   host: '127.0.0.1',
//   username: 'root',
//   password: 'ca7ff61c-c395-11ed-afa1-0242ac120002',
//   database: 'u408558298_personal_sys',
//   entities: [__dirname + '/**/*.entity{.ts,.js}'],
//   synchronize: true,
// };
// TypeOrmModule.forRoot(connectionOptions),

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [AppController, RecordsController],
  providers: [AppService, DatabaseService],
})



export class AppModule { }
