import { Injectable, Logger } from '@nestjs/common';
import {
  createConnection,
  Connection,
  ConnectionOptions,
  OkPacket,
} from 'mysql2';
// import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  private connection: Connection;

  constructor() {
    // Configurações de conexão com o banco de dados
    const dbConfig: ConnectionOptions = {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    };

    // Cria uma nova conexão
    this.connection = createConnection(dbConfig);
  }

  async execute(sql: string, params?: any[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      // Abre a conexão
      this.connection.connect((err) => {
        if (err) {
          reject(err);
          return;
        }

        // Executa o comando SQL
        this.connection.query(sql, params, (error, results) => {
          // Fecha a conexão
          this.connection.end();

          if (error) {
            reject(error);
            return;
          }

          resolve(results as any[]);
        });
      });
    });
  }

  // private connection: mysql.Connection;
  // constructor() {
  //   this.connect();
  // }
  // async connect() {
  //   Logger.log('info testeeeeeee');
  //   this.connection = await mysql.createConnection({
  //     host: process.env.DATABASE_HOST,
  //     user: process.env.DATABASE_USERNAME,
  //     password: process.env.DATABASE_PASSWORD,
  //     database: process.env.DATABASE_NAME,
  //   });
  // }
  // async execute(sql: string, _params?: any | null): Promise<any> {
  //   try {
  //     const [rows] = await this.connection.execute(sql, _params);
  //     return rows;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  // async executeMultiple(sqlList: string[]): Promise<any> {
  //   this.connection.beginTransaction();
  //   try {
  //     sqlList.forEach(async (sql) => {
  //       await this.connection.query(sql);
  //     });
  //     this.connection.commit();
  //   } catch (error) {
  //     this.connection.rollback();
  //     throw error;
  //   }
  // }
}
