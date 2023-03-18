import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  private connection: mysql.Connection;

  constructor() {
    this.connect();
  }

  async connect() {
    this.connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'ca7ff61c-c395-11ed-afa1-0242ac120002',
      database: 'u408558298_personal_sys',
    });
  }

  async getAllRecords(tableName: string): Promise<any> {
    const [rows] = await this.connection.execute(`SELECT * FROM ${tableName}`);
    return rows;
  }
}
