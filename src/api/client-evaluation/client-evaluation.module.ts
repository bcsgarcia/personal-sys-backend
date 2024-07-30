import { Module } from '@nestjs/common';
import { ClientEvaluationService } from './service/client-evaluation.service';
import { ClientEvaluationController } from './controllers/client-evaluation.controller';
import { DatabaseService } from 'src/database/database.service';
import { ClientEvaluationRepository } from './repository/client-evaluation.repository';
import { FtpService } from 'src/common-services/ftp-service.service';

@Module({
  controllers: [ClientEvaluationController],
  providers: [
    ClientEvaluationService,
    DatabaseService,
    FtpService,
    {
      provide: ClientEvaluationRepository,
      useFactory: (databaseService: DatabaseService) => new ClientEvaluationRepository(databaseService),
      inject: [DatabaseService],
    },
  ],
})
export class ClientEvaluationModule {}
