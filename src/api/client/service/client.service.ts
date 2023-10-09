import {
  HttpException,
  HttpStatus,
  Injectable,
  UploadedFile,
} from '@nestjs/common';
import { Auth } from 'src/models/auth.model';
import { AuthDto } from 'src/api/auth/dto/request/auth.dto';
import { AuthService } from 'src/api/auth/service/auth.service';
import { ClientDto } from '../dto/client.dto';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { ClientRepository } from '../repository/client.repository';
import { FtpService } from 'src/common-services/ftp-service.service';
import { DomainError } from 'src/api/utils/domain.error';
import { ImageService } from 'src/common-services/image-service.service';

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly authService: AuthService,
    private readonly ftpService: FtpService,
    private readonly imageService: ImageService,
  ) {}

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

      return { status: 'success' };
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

  async update(id: string, updateClientDto: UpdateClientDto) {
    try {
      await this.clientRepository.update(id, updateClientDto);

      await this.authService.updateEmailByIdClient(id, updateClientDto.email);

      return { status: 'success' };
    } catch (error) {
      throw error;
    }
  }

  async uploadPhoto(@UploadedFile() file, uuid: string) {
    try {
      if (!file.mimetype.includes('image') || file.mimetype.includes('heic')) {
        throw new HttpException(
          DomainError.INTERNAL_SERVER_ERROR,
          HttpStatus.BAD_REQUEST,
        );
      }

      const imageBuffer = file.mimetype.includes('png')
        ? file.buffer
        : await this.imageService.convertToPNG(file.buffer);

      await this.ftpService.uploadPhoto(imageBuffer, `${uuid}.png`);

      const user = await this.clientRepository.findById(uuid);

      const userDto = new UpdateClientDto(user[0]);

      userDto.photoUrl = `${process.env.CLIENT_IMAGE_BASE_PATH}/${uuid}.png`;

      await this.clientRepository.update(uuid, userDto);

      return { status: 'success' };
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
