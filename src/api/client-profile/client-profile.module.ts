import { Module } from '@nestjs/common';
import { ClientProfileService } from './service/client-profile.service';
import { ClientProfileController } from './controller/client-profile.controller';
import { DatabaseService } from 'src/database/database.service';
import { ClientRepository } from '../client/repository/client.repository';
import { ClientProfileRepository } from './repository/client-profile.repository';

@Module({
  controllers: [ClientProfileController],
  providers: [
    ClientProfileService,
    DatabaseService,
    {
      provide: ClientProfileRepository,
      useFactory: (databaseService: DatabaseService) => new ClientProfileRepository(databaseService),
      inject: [DatabaseService],
    },
    {
      provide: ClientRepository,
      useFactory: (databaseService: DatabaseService) => new ClientRepository(databaseService),
      inject: [DatabaseService],
    },
  ],
})
export class ClientProfileModule {}
