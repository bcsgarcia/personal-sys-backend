import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AuthRepository } from '../auth/repository/auth.repository';
import { AuthService } from '../auth/service/auth.service';

import { ClientController } from './controller/client.controller';
import { ClientRepository } from './repository/client.repository';
import { ClientService } from './service/client.service';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  controllers: [ClientController],
  imports: [AuthModule, JwtModule.register({
    secret: '2^A8$sWgRz6J0E!yHv&8p@Wd3r!q3G*U4fZDh**4w',
    signOptions: { expiresIn: '60m' },
  }),],
  providers: [
    ClientService,
    DatabaseService,
    AuthService,
    AuthRepository,
    {
      provide: ClientRepository,
      useFactory: (databaseService: DatabaseService) =>
        new ClientRepository(databaseService),
      inject: [DatabaseService],
    },
  ],
})
export class ClientModule { }
