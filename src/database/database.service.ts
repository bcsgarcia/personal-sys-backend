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

  async executeQuery(sql: string): Promise<any> {
    const [rows] = await this.connection.execute(sql);
    return rows;
  }

  async executeMultipleQueries(sqlList: string[]): Promise<any> {
    this.connection.beginTransaction();

    try {
      sqlList.forEach(async (sql) => {
        await this.connection.query(sql);
      });

      this.connection.commit();
    } catch (error) {
      this.connection.rollback();
      throw error;
    }
  }
}
