import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Auth } from 'src/models/auth.model';
import { AuthDto } from '../dto/request/auth.dto';
import { AuthRepository } from '../repository/auth.repository';
import { AccessTokenDto } from '../dto/response/access-token-dto';
import { AppAuthDto } from '../dto/request/app-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async create(authDto: AuthDto): Promise<Auth> {
    try {
      const row = await this.authRepository.create(authDto);

      if (row == undefined) {
        return null;
      }

      return new Auth(row);
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Auth> {
    try {
      const rows = await this.authRepository.findById(id);

      if (rows.length === 0) {
        return null;
      }

      return new Auth(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  async emailAlreadyExists(email: string, idCompany: string): Promise<boolean> {
    try {
      const rows = await this.authRepository.emailAlreadyExists(
        email,
        idCompany,
      );

      if (rows.length > 0) {
        return true;
      }

      return false;
    } catch (error) {
      throw error;
    }
  }

  async findByEmailAndPass(authDto: AuthDto) {
    try {
      const rows = await this.authRepository.findByEmailAndPass(authDto);

      if (rows.length === 0) {
        return null;
      }

      return new Auth(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  async validateUser(email: string, pass: string): Promise<boolean> {
    try {
      const user = await this.authRepository.validateUser(email, pass);
      if (!user) {
        throw new UnauthorizedException();
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async appAuth(auth: AppAuthDto): Promise<AccessTokenDto> {
    try {
      const rows = await this.authRepository.appAuth(auth);

      if (rows.length === 0) {
        throw new HttpException(`user/pass not found`, HttpStatus.NOT_FOUND);
      }

      const payload = {
        clientId: rows[0]['clientId'],
        clientEmail: rows[0]['clientEmail'],
        clientIdAuth: rows[0]['clientIdAuth'],
        clientIdCompany: rows[0]['clientIdCompany'],
        clientName: rows[0]['clientName'],
      };

      const accessToken = await this.jwtService.signAsync(payload);

      return new AccessTokenDto(accessToken);
    } catch (error) {
      throw error;
    }
  }

  async updateEmailByIdClient(idClient: string, email: string) {
    try {
      return this.authRepository.updateEmailByIdClient(idClient, email);
    } catch (error) {
      throw error;
    }
  }

  updatePassByIdClient(idClient: string, pass: string) {
    return this.authRepository.updatePassByIdClient(idClient, pass);
  }

  update(authDto: AuthDto) {
    return this.authRepository.update(authDto);
  }

  remove(id: string) {
    return `This action removes a #${id} auth`;
  }
}
