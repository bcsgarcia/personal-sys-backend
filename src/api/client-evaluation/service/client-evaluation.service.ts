import { Injectable } from '@nestjs/common';
import { CreateClientEvaluationDto } from '../dto/create-client-evaluation.dto';
import { UpdateClientEvaluationDto } from '../dto/update-client-evaluation.dto';
import { ClientEvaluationRepository } from '../repository/client-evaluation.repository';
import { ClientEvaluationDto } from '../dto/client-evaluation.dto';
import { rethrow } from '@nestjs/core/helpers/rethrow';
import { MusclePerimeterDto } from '../dto/muscle-perimeter.dto';
import { MuscoloskeletalChangeDto } from '../dto/muscoloskeletal-change.dto';
import { ClientEvaluationPhotoDto } from '../dto/client-evaluation-photo.dto';

@Injectable()
export class ClientEvaluationService {
  constructor(private readonly clientEvaluationRepository: ClientEvaluationRepository) {}

  async create(createClientEvaluationDto: CreateClientEvaluationDto) {
    try {
      const clientEvaluationMap = await this.clientEvaluationRepository.createClientEvaluation(
        createClientEvaluationDto,
      );
      const clientEvaluation = new ClientEvaluationDto(clientEvaluationMap);

      await this.clientEvaluationRepository.createMusclePerimeter(
        clientEvaluation.id,
        createClientEvaluationDto.idCompany,
      );

      await this.clientEvaluationRepository.createMuscoloskeletalChange(
        clientEvaluation.id,
        createClientEvaluationDto.idCompany,
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
          clientEvaluation.muscoloskeletalChange = new MuscoloskeletalChangeDto(row);
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

  update(id: number, updateClientEvaluationDto: UpdateClientEvaluationDto) {
    return `This action updates a #${id} clientEvaluation`;
  }

  remove(id: number) {
    return `This action removes a #${id} clientEvaluation`;
  }
}
