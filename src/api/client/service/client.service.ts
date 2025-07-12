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
import { AuthSupabaseService } from '../../auth/service/auth-supabase.service';

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly authService: AuthService,
    private readonly ftpService: FtpService,
    private readonly imageService: ImageService,
    private readonly supabaseAuthService: AuthSupabaseService,
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
      const client = await this.clientRepository.create(createClientDto, auth);

      await this.supabaseAuthService.createUser({
        email: auth.email,
        password: auth.pass,
        emailConfirmed: true,
        role: 'user',
        appMetadata: { enabled: client.isActive },
        userMetadata: {
          clientId: client.id,
          clientIdAuth: auth.id,
          idCompany: client.idCompany,
          clientName: client.name,
        },
      });

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

      const retornoDto = rows.map((row) => new ClientDto(row));

      return retornoDto;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<ClientDto> {
    try {
      const rows = await this.clientRepository.findById(id);

      if (rows === undefined) {
        return null;
      }

      return new ClientDto(rows);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    try {
      const client = await this.clientRepository.findById(id);

      if (client === undefined) {
        throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
      }

      const allSUpabaseAuth = await this.supabaseAuthService.findAllUsers();

      const otherUserWithSameEmail = allSUpabaseAuth.find(
        (user) =>
          user.email === updateClientDto.email &&
          user.id !== client.idSupabaseAuth,
      );

      if (otherUserWithSameEmail) {
        throw new HttpException(
          `SQL error: 'Email already exists to another client'`,
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.clientRepository.update(id, updateClientDto);
      await this.authService.updateEmailByIdClient(id, updateClientDto.email);
      await this.supabaseAuthService.updateUser({
        email: updateClientDto.email,
        emailConfirmed: true,
        role: 'user',
        appMetadata: { enabled: updateClientDto.isActive },
        userMetadata: {
          clientId: client.id,
          clientIdAuth: client.idAuth,
          idCompany: client.idCompany,
          clientName: updateClientDto.name,
        },
        idSupabaseAuth: client.idSupabaseAuth,
      });

      if (updateClientDto.pass) {
        await this.authService.updatePassByIdClient(
          id,
          client.pass,
          updateClientDto.pass,
        );
      }

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

      await this.ftpService.uploadPhoto(
        imageBuffer,
        `${uuid}.png`,
        process.env.FTP_CLIENT_IMAGE_PATH,
      );

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
