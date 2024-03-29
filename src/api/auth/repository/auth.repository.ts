import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AppAuthDto } from '../dto/request/app-auth.dto';
import { AuthDto } from '../dto/request/auth.dto';

@Injectable()
export class AuthRepository {
  constructor(private databaseService: DatabaseService) {}

  findById(id: string): Promise<any> {
    try {
      return this.databaseService.execute('SELECT * FROM auth WHERE id = ?', [id]);
    } catch (error) {
      throw error;
    }
  }

  async emailAlreadyExists(email: string, idCompany: string): Promise<any> {
    try {
      return this.databaseService.execute('SELECT * FROM auth WHERE email = ? and idCompany = ? ', [email, idCompany]);
    } catch (error) {
      throw error;
    }
  }

  async findByEmailAndPass(authDto: AuthDto): Promise<any> {
    try {
      return this.databaseService.execute('SELECT * FROM auth WHERE email = ? and pass = ? and isAdmin = ?', [
        authDto.email,
        authDto.pass,
        authDto.isAdmin,
      ]);
    } catch (error) {
      throw error;
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      return this.databaseService.execute(
        `SELECT *
         FROM auth
         WHERE email = '${email}'
           and pass = '${pass}'`,
      );
    } catch (error) {
      throw error;
    }
  }

  async appAuth(authDto: AppAuthDto): Promise<any> {
    try {
      return this.databaseService.execute(
        `SELECT c.id        as clientId,
                c.name      as clientName,
                a.email     as clientEmail,
                c.idCompany as clientIdCompany,
                c.idAuth    as clientIdAuth,
                c.photoUrl  as clientPhotoUrl

         FROM auth a
                  INNER JOIN client c on a.id = c.idAuth

         WHERE a.email = '${authDto.email}'
           AND a.pass = '${authDto.password}'
           AND a.isAdmin = '0'`,
        [authDto.email, authDto.password],
      );
    } catch (error) {
      throw error;
    }
  }

  async adminAuthRefresh(authDto: AppAuthDto): Promise<any> {
    try {
      return this.databaseService.execute(
        `SELECT c.id        as clientId,
                c.name      as clientName,
                a.email     as clientEmail,
                c.idCompany as clientIdCompany,
                c.idAuth    as clientIdAuth,
                c.photoUrl  as clientPhotoUrl
         FROM auth a
                  INNER JOIN client c on a.id = c.idAuth
         WHERE a.email = ?
           AND a.isAdmin = '1'`,
        [authDto.email],
      );
    } catch (error) {
      throw error;
    }
  }

  async adminAuth(authDto: AppAuthDto): Promise<any> {
    try {
      return this.databaseService.execute(
        `SELECT c.id        as clientId,
                c.name      as clientName,
                a.email     as clientEmail,
                c.idCompany as clientIdCompany,
                c.idAuth    as clientIdAuth,
                c.photoUrl  as clientPhotoUrl
         FROM auth a
                  INNER JOIN client c on a.id = c.idAuth
         WHERE a.email = ?
           AND a.pass = ?
           AND a.isAdmin = '1'`,
        [authDto.email, authDto.password],
      );
    } catch (error) {
      throw error;
    }
  }

  async create(authDto: AuthDto): Promise<any> {
    try {
      await this.databaseService.execute('INSERT INTO auth (email, pass, idCompany) VALUES (?, ?, ?)', [
        authDto.email,
        authDto.pass,
        authDto.idCompany,
      ]);

      const [rows] = await this.databaseService.execute('SELECT * FROM auth WHERE email = ? and idCompany = ?', [
        authDto.email,
        authDto.idCompany,
      ]);

      return rows;
    } catch (error) {
      throw error;
    }
  }

  async update(authDto: AuthDto): Promise<void> {
    try {
      await this.databaseService.execute('UPDATE auth SET email = ?, pass = ? WHERE id = ?', [
        authDto.email,
        authDto.pass,
        authDto.id,
      ]);
    } catch (error) {
      throw error;
    }
  }

  async updateEmailByIdClient(idClient: string, email: string): Promise<void> {
    try {
      this.databaseService.execute('UPDATE auth SET email = ? WHERE id in (select idAuth from client where id = ?)', [
        email,
        idClient,
      ]);
    } catch (error) {
      throw error;
    }
  }

  async updatePassByIdClient(idClient: string, pass: string): Promise<void> {
    try {
      this.databaseService.execute('UPDATE auth SET pass = ? WHERE id in (select idAuth from client where id = ?)', [
        pass,
        idClient,
      ]);
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id: string): Promise<void> {
    await this.databaseService.execute('update client set isActive=false WHERE id = ?', [id]);
  }

  async validateOldPass(idClient: string): Promise<string> {
    const querie = 'SELECT pass FROM client c INNER JOIN auth a on a.id = c.idAuth WHERE c.id = ?';

    const rows = await this.databaseService.execute(querie, [idClient]);

    return rows[0];
  }
}
