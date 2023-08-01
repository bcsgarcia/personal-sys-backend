import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    });
  }

  async execute(sql: string, params?: any[]): Promise<any[]> {
    const [results] = await this.pool.execute(sql, params);
    return results as any[];
  }

  async executeMultiple(sql: string, params?: any[][]): Promise<any[]> {
    // Flatten the parameters array for the MySQL library
    const flatParams = params?.reduce((acc, val) => acc.concat(val), []);
    const [results] = await this.pool.execute(sql, flatParams);
    return results as any[];
  }
}
