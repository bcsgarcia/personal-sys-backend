import { Module } from '@nestjs/common';

import { NotificationModule } from './notification/notification.module';
import { WorkoutModule } from './workout/workout.module';
import { WorkoutsheetModule } from './workoutsheet/workoutsheet.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ClientModule } from './client/client.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    NotificationModule,
    WorkoutModule,
    WorkoutsheetModule,
    AppointmentModule,
    ClientModule,
    CompanyModule,
  ],
  exports: [
    NotificationModule,
    WorkoutModule,
    WorkoutsheetModule,
    AppointmentModule,
    ClientModule,
  ],
})
export class WebModule {}
