import { Injectable } from '@nestjs/common';
import * as ftp from 'ftp';
import { Readable } from 'typeorm/platform/PlatformTools';

@Injectable()
export class FtpService {
  private client: ftp;

  constructor() {
    this.client = new ftp();
  }

  uploadPhoto(fileBuffer: Buffer, fileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Cria um stream de leitura a partir do buffer
      const stream = new Readable();
      stream.push(fileBuffer);
      stream.push(null);

      this.client.on('ready', () => {
        this.client.cwd(process.env.FTP_CLIENT_IMAGE_PATH, (err) => {
          if (err) reject(err);

          this.client.put(stream, fileName, (err) => {
            if (err) reject(err);

            this.client.end();
            resolve();
          });
        });
      });

      this.client.connect({
        host: process.env.FTP_HOST,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
      });
    });
  }
}
