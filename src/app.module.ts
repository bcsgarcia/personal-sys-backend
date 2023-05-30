import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { RecordsController } from './records/records.controller';
import { ApiModule } from './api/web-api.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './api/auth/auth.guard';
import { MyMiddleware } from './myMiddleware.middleware';

@Module({
  imports: [DatabaseModule, ApiModule],
  controllers: [AppController, RecordsController],
  providers: [
    AppService,
    DatabaseService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    MyMiddleware,
  ],
  exports: [DatabaseService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MyMiddleware).forRoutes('*');
  }
}
