import { Module } from '@nestjs/common';

import { AuthController } from './controller/auth.controller';
import { DatabaseService } from 'src/database/database.service';
import { AuthRepository } from './repository/auth.repository';
import { AuthService } from './service/auth.service';
import { Reflector } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthSupabaseService } from './service/auth-supabase.service';
import { AuthSupabaseRepository } from './repository/auth-supabase.repository';
import { AuthSupabaseController } from './controller/auth-supabase.controller';
import { ClientRepository } from '../client/repository/client.repository';

dotenv.config();

@Module({
  controllers: [AuthController, AuthSupabaseController],
  providers: [
    AuthService,
    AuthSupabaseService,
    DatabaseService,
    Reflector,
    {
      provide: AuthRepository,
      useFactory: (
        databaseService: DatabaseService,
        supabase: SupabaseClient,
      ) => new AuthRepository(databaseService, supabase),
      inject: [DatabaseService, 'SUPABASE_CLIENT'],
    },
    {
      provide: AuthSupabaseRepository,
      useFactory: () => new AuthSupabaseRepository(),
      inject: ['SUPABASE_CLIENT'],
    },
    {
      provide: ClientRepository,
      useFactory: (
        databaseService: DatabaseService,
        supabase: SupabaseClient,
      ) => new ClientRepository(databaseService, supabase),
      inject: [DatabaseService, 'SUPABASE_CLIENT'],
    },
  ],
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '240m' },
    }),
  ],
  exports: [AuthService, AuthSupabaseService],
})
export class AuthModule {}
