import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AuthDto } from '../dto/auth.dto';

@Injectable()
export class AuthRepository {
  constructor(private databaseService: DatabaseService) {}

  findById(id: string): Promise<any> {
    try {
      return this.databaseService.execute('SELECT * FROM auth WHERE id = ?', [
        id,
      ]);
    } catch (error) {
      throw error;
    }
  }

  async emailAlreadyExists(email: string, idCompany: string): Promise<any> {
    try {
      return this.databaseService.execute(
        'SELECT * FROM auth WHERE email = ? and idCompany = ? ',
        [email, idCompany],
      );
    } catch (error) {
      throw error;
    }
  }

  async findByEmailAndPass(authDto: AuthDto): Promise<any> {
    try {
      return this.databaseService.execute(
        'SELECT * FROM auth WHERE email = ? and pass = ? and isAdmin = ?',
        [authDto.email, authDto.pass, authDto.isAdmin],
      );
    } catch (error) {
      throw error;
    }
  }

  async create(authDto: AuthDto): Promise<any> {
    try {
      await this.databaseService.execute(
        'INSERT INTO auth (email, pass, idCompany) VALUES (?, ?, ?)',
        [authDto.email, authDto.pass, authDto.idCompany],
      );

      const [rows] = await this.databaseService.execute(
        'SELECT * FROM auth WHERE email = ? and idCompany = ?',
        [authDto.email, authDto.idCompany],
      );

      return rows;
    } catch (error) {
      throw error;
    }
  }

  async update(authDto: AuthDto): Promise<void> {
    try {
      return await this.databaseService.execute(
        'UPDATE auth SET email = ?, pass = ? WHERE id = ?',
        [authDto.email, authDto.pass, authDto.id],
      );
    } catch (error) {
      throw error;
    }
  }

  async updateEmailByIdClient(idClient: string, email: string): Promise<void> {
    try {
      return this.databaseService.execute(
        'UPDATE auth SET email = ? WHERE id in (select idAuth from client where id = ?)',
        [email, idClient],
      );
    } catch (error) {
      throw error;
    }
  }

  async updatePassByIdClient(idClient: string, pass: string): Promise<void> {
    try {
      return this.databaseService.execute(
        'UPDATE auth SET pass = ? WHERE id in (select idAuth from client where id = ?)',
        [pass, idClient],
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id: string): Promise<void> {
    await this.databaseService.execute(
      'update client set isActive=false WHERE id = ?',
      [id],
    );
  }
}
