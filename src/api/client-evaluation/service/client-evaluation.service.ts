import { Injectable } from '@nestjs/common';
import { CreateClientEvaluationDto } from '../dto/create-client-evaluation.dto';
import { UpdateClientEvaluationDto } from '../dto/update-client-evaluation.dto';
import { ClientEvaluationRepository } from '../repository/client-evaluation.repository';
import { ClientEvaluationDto } from '../dto/client-evaluation.dto';
import { rethrow } from '@nestjs/core/helpers/rethrow';
import { MusclePerimeterDto } from '../dto/muscle-perimeter.dto';
import { MuscoloskeletalChangesDto } from '../dto/muscoloskeletal-change.dto';
import { CreateClientEvaluationPhotoDto } from '../dto/create-client-evaluation-photo.dto';
import { ClientEvaluationPhotoDto } from '../dto/client-evaluation-photo.dto';
import { FtpService } from 'src/common-services/ftp-service.service';

@Injectable()
export class ClientEvaluationService {
  constructor(
    private readonly clientEvaluationRepository: ClientEvaluationRepository,
    private readonly ftpService: FtpService,
  ) {}

  async create(createClientEvaluationDto: CreateClientEvaluationDto) {
    try {
      const clientEvaluationMap = await this.clientEvaluationRepository.createClientEvaluation(
        createClientEvaluationDto,
      );
      const clientEvaluation = new ClientEvaluationDto(clientEvaluationMap);

      await this.clientEvaluationRepository.createMusclePerimeter(
        clientEvaluation.id,
        createClientEvaluationDto.idCompany,
        createClientEvaluationDto.musclePerimeter,
      );

      await this.clientEvaluationRepository.createMuscoloskeletalChange(
        clientEvaluation.id,
        createClientEvaluationDto.idCompany,
        createClientEvaluationDto.muscoloskeletalChanges,
      );

      return { status: 'success' };
    } catch (error) {
      rethrow;
    }
  }

  async findAll(idClient: string, idCompany: string) {
    try {
      const rows = await this.clientEvaluationRepository.findAllByClientAndCompany(idClient, idCompany);

      const clientEvaluationMap = new Map<string, ClientEvaluationDto>();
      rows.map((row) => {
        const key = row['idClientEvaluation'];

        if (!clientEvaluationMap.has(key)) {
          const clientEvaluation = new ClientEvaluationDto(row);
          clientEvaluation.musclePerimeter = new MusclePerimeterDto(row);
          clientEvaluation.muscoloskeletalChanges = new MuscoloskeletalChangesDto(row);
          clientEvaluation.clientEvaluationPhotoList = [];
          clientEvaluationMap.set(key, clientEvaluation);
        }

        if (row['idClientEvaluationPhoto'] != undefined) {
          clientEvaluationMap.get(key).clientEvaluationPhotoList.push(new ClientEvaluationPhotoDto(row));
        }
      });

      return Array.from(clientEvaluationMap.values());
    } catch (error) {
      rethrow;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} clientEvaluation`;
  }

  async update(clientEvaluationDto: ClientEvaluationDto) {
    try {
      await this.clientEvaluationRepository.updateMusclePerimeter(
        clientEvaluationDto.id,
        clientEvaluationDto.idCompany,
        clientEvaluationDto.musclePerimeter,
      );

      await this.clientEvaluationRepository.updateMuscoloskeletalChange(
        clientEvaluationDto.id,
        clientEvaluationDto.idCompany,
        clientEvaluationDto.muscoloskeletalChanges,
      );

      return { status: 'success' };
    } catch (error) {
      throw new Error(`Erro client evaluation service: ${error}`);
    }
  }

  async remove(clientEvaluationId: string, idCompany: string) {
    try {
      const clientEvaluation = await this.clientEvaluationRepository.findOne(idCompany, clientEvaluationId);

      // removing client evaluation photos dir from ftp
      await this.ftpService.removeDir(
        `${process.env.FTP_CLIENT_IMAGE_PATH}${clientEvaluation[0].idClient}/${clientEvaluationId}`,
      );

      // removing clientEvaluation
      await this.clientEvaluationRepository.deleteClientEvaluation(idCompany, clientEvaluationId);
      return { status: 'success' };
    } catch (error) {
      throw new Error(`Erro client evaluation service: ${error}`);
    }
  }

  async addPhotoClientEvaluation(clientEvaluationPhotoDto: CreateClientEvaluationPhotoDto) {
    try {
      clientEvaluationPhotoDto.url = `${process.env.CLIENT_IMAGE_BASE_PATH}/${clientEvaluationPhotoDto.idClient}/${clientEvaluationPhotoDto.idClientEvaluation}/${clientEvaluationPhotoDto.fileName}`;

      await this.clientEvaluationRepository.createClientEvaluationPhoto(clientEvaluationPhotoDto);

      return { status: 'success' };
    } catch (error) {
      throw new Error(`error client-evaluation-service addPhotoClientEvaluation - ${error}`);
    }
  }

  async deletePhotoClientEvaluation(clientEvaluationPhotoDto: ClientEvaluationPhotoDto) {
    try {
      await this.clientEvaluationRepository.deleteClientEvaluationPhoto(clientEvaluationPhotoDto);

      return { status: 'success' };
    } catch (error) {
      throw new Error(`error client-evaluation-service addPhotoClientEvaluation - ${error}`);
    }
  }
}
