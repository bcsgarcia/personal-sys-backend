import { Injectable } from '@nestjs/common';
import { Auth } from 'src/models/auth.model';
import { AuthDto } from '../dto/auth.dto';
import { AuthRepository } from '../repository/auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) { }

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
