import { Module } from '@nestjs/common';

import { AuthController } from './controller/auth.controller';
import { DatabaseService } from 'src/database/database.service';
import { AuthRepository } from './repository/auth.repository';
import { AuthService } from './service/auth.service';
import { Reflector } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    DatabaseService,
    Reflector,
    {
      provide: AuthRepository,
      useFactory: (databaseService: DatabaseService) => new AuthRepository(databaseService),
      inject: [DatabaseService],
    },
  ],
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '240m' },
    }),
    // PassportModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
