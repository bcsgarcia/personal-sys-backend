import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Auth } from 'src/models/auth.model';

import { convertDateToTimestamp } from 'src/api/utils/utils';

import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';

@Injectable()
export class ClientRepository {
  constructor(private databaseService: DatabaseService) {}

  async findById(id: string): Promise<any> {
    try {
      return this.databaseService.execute(
        'SELECT c.*, a.email FROM client c inner join auth a on c.idAuth = a.id where c.id = ?',
        [id],
      );
    } catch (error) {
      throw error;
    }
  }

  async findAll(idCompany: string): Promise<any> {
    try {
      return this.databaseService.execute(
        'SELECT c.*, a.email FROM client c inner join auth a on c.idAuth = a.id where c.idCompany = ?',
        [idCompany],
      );
    } catch (error) {
      throw error;
    }
  }

  async create(createClientDto: CreateClientDto, auth: Auth): Promise<void> {
    try {
      const createQuery =
        'insert into client (name, birthday, phone, gender, idCompany, idAuth) values (?,?,?,?,?,?);';

      await this.databaseService.execute(createQuery, [
        createClientDto.name,
        convertDateToTimestamp(new Date(createClientDto.birthday)),
        createClientDto.phone,
        createClientDto.gender,
        createClientDto.idCompany,
        auth.id,
      ]);
    } catch (error) {
      throw error;
    }
  }

  async update(
    idClient: string,
    updateClientDto: UpdateClientDto,
  ): Promise<void> {
    try {
      await this.databaseService.execute(
        'UPDATE client SET name = ?, birthday = ?, phone = ?, gender = ?, photoUrl = ?, isActive = ? WHERE id = ?',
        [
          updateClientDto.name,
          convertDateToTimestamp(new Date(updateClientDto.birthday)),
          updateClientDto.phone,
          updateClientDto.gender,
          updateClientDto.photoUrl,
          updateClientDto.isActive,
          idClient,
        ],
      );
    } catch (error) {
      throw error;
    }
  }
}
