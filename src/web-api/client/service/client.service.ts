import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Auth } from 'src/models/auth.model';
import { AuthDto } from 'src/web-api/auth/dto/auth.dto';
import { AuthService } from 'src/web-api/auth/service/auth.service';
import { ClientDto } from '../dto/client.dto';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { ClientRepository } from '../repository/client.repository';

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly authService: AuthService,
  ) { }

  async create(createClientDto: CreateClientDto) {
    try {
      if (
        await this.authService.emailAlreadyExists(
          createClientDto.email,
          createClientDto.idCompany,
        )
      ) {
        throw new HttpException(
          `SQL error: 'Email already exists'`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const auth = await this.createAuth(createClientDto);

      await this.clientRepository.create(createClientDto, auth);
    } catch (error) {
      throw error;
    }
  }

  async findAll(idCompany: string): Promise<ClientDto[]> {
    try {
      const rows = await this.clientRepository.findAll(idCompany);

      if (rows.length === 0) {
        return [];
      }

      return rows.map((row) => new ClientDto(row));
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<ClientDto> {
    try {
      const rows = await this.clientRepository.findById(id);

      if (rows.length === 0) {
        return null;
      }

      return new ClientDto(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<any> {
    try {
      await this.clientRepository.update(id, updateClientDto);

      await this.authService.updateEmailByIdClient(id, updateClientDto.email);
    } catch (error) {
      throw error;
    }
  }

  private async createAuth(createClientDto: CreateClientDto): Promise<Auth> {
    const authDto = new AuthDto();

    authDto.email = createClientDto.email;
    authDto.pass = createClientDto.pass;
    authDto.idCompany = createClientDto.idCompany;

    return await this.authService.create(authDto);
  }
}
