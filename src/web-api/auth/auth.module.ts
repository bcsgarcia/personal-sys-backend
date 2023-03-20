import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseService } from 'src/database/database.service';
import { AuthRepository } from './auth.repository';

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
