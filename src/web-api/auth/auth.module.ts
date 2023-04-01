import { Module } from '@nestjs/common';

import { AuthController } from './controller/auth.controller';
import { DatabaseService } from 'src/database/database.service';
import { AuthRepository } from './repository/auth.repository';
import { AuthService } from './service/auth.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    DatabaseService,
    {
      provide: AuthRepository,
      useFactory: (databaseService: DatabaseService) =>
        new AuthRepository(databaseService),
      inject: [DatabaseService],
    },
  ],
})
export class AuthModule {}
