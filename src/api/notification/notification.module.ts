import { Module } from '@nestjs/common';
import { NotificationService } from './service/notification.service';
import { NotificationController } from './controller/notification.controller';
import { DatabaseService } from 'src/database/database.service';
import { NotificationRepository } from './repository/notification.repository';

@Module({
  controllers: [NotificationController],
  exports: [NotificationRepository, NotificationService],
  providers: [
    NotificationService,
    DatabaseService,
    {
      provide: NotificationRepository,
      useFactory: (databaseService: DatabaseService) =>
        new NotificationRepository(databaseService),
      inject: [DatabaseService],
    },
  ],
})
export class NotificationModule {}
