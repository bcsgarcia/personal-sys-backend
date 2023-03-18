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
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    });
  }

  async getAllRecords(tableName: string): Promise<any> {
    const [rows] = await this.connection.execute(`SELECT * FROM ${tableName}`);
    return rows;
  }
}
