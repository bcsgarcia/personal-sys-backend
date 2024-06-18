import { Module } from '@nestjs/common';

import { NotificationModule } from './notification/notification.module';
import { WorkoutModule } from './workout/workout.module';
import { WorkoutsheetModule } from './workoutsheet/workoutsheet.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ClientModule } from './client/client.module';
import { CompanyModule } from './company/company.module';
import { AuthModule } from './auth/auth.module';
import { AppHomeScreenModule } from './screens/app/home/screen-home.module';

import { IntroductionPageModule } from './screens/admin/introduction-page/introduction-page.module';
import { MediaModule } from './media/media.module';
import { UploadModule } from './upload/upload.module';
import { ClientEvaluationModule } from './client-evaluation/client-evaluation.module';
import { ClientProfileModule } from './client-profile/client-profile.module';
import { PartnershipModule } from './partnership/partnership.module';

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
    IntroductionPageModule,
    MediaModule,
    UploadModule,
    ClientEvaluationModule,
    ClientProfileModule,
    PartnershipModule,
  ],
  exports: [
    NotificationModule,
    WorkoutModule,
    WorkoutsheetModule,
    AppointmentModule,
    ClientModule,
    AppHomeScreenModule,
    IntroductionPageModule,
  ],
})
export class ApiModule {}
