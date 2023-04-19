import { Module } from '@nestjs/common';

import { AuthController } from './controller/auth.controller';
import { DatabaseService } from 'src/database/database.service';
import { AuthRepository } from './repository/auth.repository';
import { AuthService } from './service/auth.service';
import { Reflector } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './constants';


@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    DatabaseService,
    Reflector,
    {
      provide: AuthRepository,
      useFactory: (databaseService: DatabaseService) =>
        new AuthRepository(databaseService),
      inject: [DatabaseService],
    },
  ],
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
    // PassportModule,
  ],
  exports: [AuthService]
})
export class AuthModule { }
