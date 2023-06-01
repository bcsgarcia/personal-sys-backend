import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AuthRepository } from '../auth/repository/auth.repository';
import { AuthService } from '../auth/service/auth.service';

import { ClientController } from './controller/client.controller';
import { ClientRepository } from './repository/client.repository';
import { ClientService } from './service/client.service';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { FtpService } from 'src/common-services/ftp-service.service';
import { ImageService } from 'src/common-services/image-service.service';

@Module({
  controllers: [ClientController],
  imports: [
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [
    ClientService,
    DatabaseService,
    AuthService,
    FtpService,
    ImageService,
    AuthRepository,
    {
      provide: ClientRepository,
      useFactory: (databaseService: DatabaseService) =>
        new ClientRepository(databaseService),
      inject: [DatabaseService],
    },
  ],
})
export class ClientModule {}
