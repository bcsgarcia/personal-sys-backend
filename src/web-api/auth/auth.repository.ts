import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Auth } from 'src/models/auth.model';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthRepository {
  constructor(private databaseService: DatabaseService) {}

  async findById(id: string): Promise<Auth> {
    const [rows] = await this.databaseService.execute(
      'SELECT * FROM auth WHERE id = ?',
      [id],
    );
    if (rows.length === 0) {
      return null;
    }
    const row = rows[0];
    const auth = new Auth(row);
    return auth;
  }

  async findByEmailAndPass(authDto: AuthDto): Promise<Auth> {
    const [rows] = await this.databaseService.execute(
      'SELECT * FROM auth WHERE email = ? and pass = ? and isAdmin = ?',
      [authDto.email, authDto.pass, authDto.isAdmin],
    );
    if (rows.length === 0) {
      return null;
    }
    const row = rows[0];
    const auth = new Auth(row);
    return auth;
  }

  async findAll(): Promise<Auth[]> {
    const rows = await this.databaseService.execute('SELECT * FROM auth');
    const authList = rows.map((row) => new Auth(row));
    return authList;
  }

  async create(authDTO: AuthDto): Promise<void> {
    try {
      await this.databaseService.execute(
        'INSERT INTO auth (email, pass, idCompany) VALUES (?, ?, ?)',
        [authDTO.email, authDTO.pass, authDTO.idCompany],
      );
    } catch (error) {
      throw error;
    }
  }

  async update(authDto: AuthDto): Promise<void> {
    try {
      await this.databaseService.execute(
        'UPDATE auth SET email = ?, pass = ? WHERE id = ?',
        [authDto.email, authDto.pass, authDto.id],
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id: string): Promise<void> {
    await this.databaseService.execute('delete from auth WHERE id = ?', [id]);
  }
}
