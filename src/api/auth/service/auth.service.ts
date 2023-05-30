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
import { jwtConstants } from '../constants';

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
        clientPhotoUrl: rows[0]['clientPhotoUrl'],
      };

      const accessToken = await this.jwtService.signAsync(payload);

      return new AccessTokenDto(accessToken);
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(token: string): Promise<AccessTokenDto> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
        ignoreExpiration: true, // Add this to ignore token expiration when verifying
      });

      delete payload.exp;

      const accessToken = await this.jwtService.signAsync(payload);

      return new AccessTokenDto(accessToken);
    } catch (error) {
      throw error;
    }
  }

  async adminAuth(auth: AppAuthDto): Promise<AccessTokenDto> {
    try {
      const rows = await this.authRepository.adminAuth(auth);

      if (rows.length === 0) {
        throw new HttpException(`user/pass not found`, HttpStatus.NOT_FOUND);
      }

      const payload = {
        clientId: rows[0]['clientId'],
        clientEmail: rows[0]['clientEmail'],
        clientIdAuth: rows[0]['clientIdAuth'],
        clientIdCompany: rows[0]['clientIdCompany'],
        clientName: rows[0]['clientName'],
        clientPhotoUrl: rows[0]['clientPhotoUrl'],
      };

      const accessToken = await this.jwtService.signAsync(payload);

      return new AccessTokenDto(accessToken);
    } catch (error) {
      throw error;
    }
  }

  // async refreshToken(token: AccessTokenDto): Promise<AccessTokenDto> {
  //   try {
  //     const payload = await this.jwtService.verifyAsync(token.accessToken, {
  //       secret: jwtConstants.secret,
  //       ignoreExpiration: true, // Add this to ignore token expiration when verifying
  //     });

  //     const accessToken = await this.jwtService.signAsync(payload);

  //     return new AccessTokenDto(accessToken);
  //   } catch (error) {
  //     throw new UnauthorizedException();
  //   }
  // }

  async updateEmailByIdClient(idClient: string, email: string) {
    try {
      return this.authRepository.updateEmailByIdClient(idClient, email);
    } catch (error) {
      throw error;
    }
  }

  async updatePassByIdClient(
    idClient: string,
    oldpass: string,
    newpass: string,
  ): Promise<void> {
    try {
      const currentPass = await this.authRepository.validateOldPass(idClient);

      if (oldpass == currentPass['pass']) {
        return this.authRepository.updatePassByIdClient(idClient, newpass);
      } else {
        throw new HttpException(
          'Wrong current password',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  update(authDto: AuthDto) {
    return this.authRepository.update(authDto);
  }

  remove(id: string) {
    return `This action removes a #${id} auth`;
  }
}
