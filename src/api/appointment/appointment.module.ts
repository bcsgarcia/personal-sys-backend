import { Module } from '@nestjs/common';
import { AppointmentService } from './service/appointment.service';
import { AppointmentController } from './controller/appointment.controller';
import { DatabaseService } from 'src/database/database.service';
import { AppointmentRepository } from './repository/appointment.repository';
import { NotificationService } from '../notification/service/notification.service';
import { NotificationModule } from '../notification/notification.module';
import { SupabaseClient } from '@supabase/supabase-js';

@Module({
  controllers: [AppointmentController],
  imports: [NotificationModule],
  providers: [
    AppointmentService,
    NotificationService,
    DatabaseService,
    {
      provide: AppointmentRepository,
      useFactory: (
        databaseService: DatabaseService,
        supabase: SupabaseClient,
      ) => new AppointmentRepository(databaseService, supabase),
      inject: [DatabaseService, 'SUPABASE_CLIENT'],
    },
  ],
})
export class AppointmentModule {}
