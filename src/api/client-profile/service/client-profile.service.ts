import { Injectable } from '@nestjs/common';
import { CreateClientProfileDto } from '../dto/create-client-profile.dto';
import { UpdateClientProfileDto } from '../dto/update-client-profile.dto';
import { ClientRepository } from 'src/api/client/repository/client.repository';
import { ClientProfileRepository } from '../repository/client-profile.repository';
import { CreateGoalsDto } from '../dto/create-goals.dto';
import { DeleteGoalsDto } from '../dto/delete-goals.dto';

@Injectable()
export class ClientProfileService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly clientProfileRepository: ClientProfileRepository,
  ) {}

  async getProfileScreenInfo(idClient: string, idCompany: string) {
    const client = await this.clientRepository.findById(idClient);

    if (client.length === 0) {
      return { status: 'error', message: 'Client not found' };
    }

    const clientGoals = await this.clientProfileRepository.findGoalsByClientId(idClient, idCompany);
    const clientFeedbacks = await this.clientProfileRepository.findFeedbacksByClientId(idClient, idCompany);

    return {
      status: 'success',
      client: client[0],
      clientGoals: clientGoals,
      clientFeedbacks: clientFeedbacks,
    };
  }

  async addClientGoals(goalDto: CreateGoalsDto) {
    try {
      await this.clientProfileRepository.createClientGoals(goalDto);
      return { status: 'success' };
    } catch (error) {
      throw error;
    }
  }

  async deleteClientGoals(goalDto: DeleteGoalsDto) {
    try {
      await this.clientProfileRepository.deleteClientGoals(goalDto.goalIdList);
      return { status: 'success' };
    } catch (error) {
      throw error;
    }
  }

  create(createClientProfileDto: CreateClientProfileDto) {
    return 'This action adds a new clientProfile';
  }

  findAll() {
    return `This action returns all clientProfile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clientProfile`;
  }

  update(id: number, updateClientProfileDto: UpdateClientProfileDto) {
    return `This action updates a #${id} clientProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} clientProfile`;
  }
}
