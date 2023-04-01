import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AuthRepository } from '../auth/repository/auth.repository';
import { AuthService } from '../auth/service/auth.service';

import { ClientController } from './controller/client.controller';
import { ClientRepository } from './repository/client.repository';
import { ClientService } from './service/client.service';

@Module({
  controllers: [ClientController],
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
export class ClientModule {}
