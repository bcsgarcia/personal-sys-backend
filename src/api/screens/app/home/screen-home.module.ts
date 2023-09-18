import { Module } from '@nestjs/common';
import { AppHomeScreenController } from './controllers/home-screen.controller';
import { AppHomeScreenService } from './service/home-screen.service';
import { WorkoutsheetService } from 'src/api/workoutsheet/service/workoutsheet.service';
import { WorkoutsheetRepository } from 'src/api/workoutsheet/respository/workoutsheet.repository';
import { DatabaseService } from 'src/database/database.service';
import { CompanyService } from 'src/api/company/service/company.service';
import { CompanyRepository } from 'src/api/company/respository/company.repository';
import { ClientService } from 'src/api/client/service/client.service';
import { AuthService } from 'src/api/auth/service/auth.service';
import { ClientRepository } from 'src/api/client/repository/client.repository';
import { AuthRepository } from 'src/api/auth/repository/auth.repository';
import { NotificationService } from 'src/api/notification/service/notification.service';
import { NotificationRepository } from 'src/api/notification/repository/notification.repository';
import { FtpService } from 'src/common-services/ftp-service.service';
import { ImageService } from 'src/common-services/image-service.service';
import { MediaRepository } from '../../../media/repository/media.repository';
import { WorkoutService } from '../../../workout/service/workout.service';
import { WorkoutRepository } from '../../../workout/repository/workout.repository';

@Module({
  controllers: [AppHomeScreenController],
  providers: [
    AppHomeScreenService,
    WorkoutService,
    WorkoutsheetService,
    DatabaseService,
    CompanyService,
    ClientService,
    AuthService,
    NotificationService,
    FtpService,
    ImageService,
    AuthRepository,
    ClientRepository,
    CompanyRepository,
    WorkoutsheetRepository,
    WorkoutRepository,
    NotificationRepository,
    MediaRepository,
  ],
})
export class AppHomeScreenModule {}
