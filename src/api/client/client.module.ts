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
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthSupabaseService } from '../auth/service/auth-supabase.service';
import { AuthSupabaseRepository } from '../auth/repository/auth-supabase.repository';

@Module({
  controllers: [ClientController],
  imports: [
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '240m' },
    }),
  ],
  providers: [
    ClientService,
    DatabaseService,
    AuthService,
    FtpService,
    ImageService,
    AuthSupabaseService,
    AuthRepository,
    {
      provide: ClientRepository,
      useFactory: (
        databaseService: DatabaseService,
        supabase: SupabaseClient,
      ) => new ClientRepository(databaseService, supabase),
      inject: [DatabaseService, 'SUPABASE_CLIENT'],
    },
    {
      provide: AuthSupabaseRepository,
      useFactory: () => new AuthSupabaseRepository(),
    },
  ],
})
export class ClientModule {}
