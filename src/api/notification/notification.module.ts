import { Module } from '@nestjs/common';
import { NotificationService } from './service/notification.service';
import { NotificationController } from './controller/notification.controller';
import { DatabaseService } from 'src/database/database.service';
import { NotificationRepository } from './repository/notification.repository';
import { SupabaseClient } from '@supabase/supabase-js';

@Module({
  controllers: [NotificationController],
  exports: [NotificationRepository, NotificationService],
  providers: [
    NotificationService,
    DatabaseService,
    {
      provide: NotificationRepository,
      useFactory: (
        databaseService: DatabaseService,
        supabase: SupabaseClient,
      ) => new NotificationRepository(databaseService, supabase),
      inject: [DatabaseService, 'SUPABASE_CLIENT'],
    },
  ],
})
export class NotificationModule {}
