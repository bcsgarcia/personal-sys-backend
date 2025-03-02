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
import { FtpService } from './common-services/ftp-service.service';
import { ImageService } from './common-services/image-service.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, ApiModule],
  controllers: [AppController, RecordsController],
  providers: [
    AppService,
    DatabaseService,
    FtpService,
    ImageService,
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
    consumer
      .apply(MyMiddleware)
      .exclude('api/swagger') // Excluir o Swagger da reescrita de URL
      .forRoutes('*');
  }
}
