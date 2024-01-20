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

  // async execute(sql: string, params?: any[]): Promise<any[]> {
  //   const [results] = await this.pool.execute(sql, params);
  //   return results as any[];
  // }

  async execute(sql: string, params?: any[], conn?: mysql.PoolConnection): Promise<any[]> {
    const connection = conn || this.pool;
    const [results] = await connection.execute(sql, params);
    return results as any[];
  }

  async transaction<T>(callback: (conn: mysql.PoolConnection) => Promise<T>): Promise<T> {
    const conn = await this.pool.getConnection();

    try {
      await conn.beginTransaction();

      const result = await callback(conn);

      await conn.commit();

      return result;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
}
