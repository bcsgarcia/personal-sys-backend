import { Module } from '@nestjs/common';

import { NotificationModule } from './notification/notification.module';
import { WorkoutModule } from './workout/workout.module';
import { WorkoutsheetModule } from './workoutsheet/workoutsheet.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ClientModule } from './client/client.module';
import { CompanyModule } from './company/company.module';
import { AuthModule } from './auth/auth.module';
import { AppHomeScreenModule } from './screens/app/home/screen-home.module';

@Module({
  imports: [
    NotificationModule,
    WorkoutModule,
    WorkoutsheetModule,
    AppointmentModule,
    ClientModule,
    CompanyModule,
    AuthModule,
    AppHomeScreenModule,
  ],
  exports: [
    NotificationModule,
    WorkoutModule,
    WorkoutsheetModule,
    AppointmentModule,
    ClientModule,
    AppHomeScreenModule,
  ],
})
export class ApiModule { }
