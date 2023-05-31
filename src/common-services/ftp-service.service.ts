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
      // Converte a string Base64 de volta para um buffer
      //   const buffer = Buffer.from(base64, 'base64');

      // Cria um stream de leitura a partir do buffer
      const stream = new Readable();
      stream.push(fileBuffer);
      stream.push(null);

      this.client.on('ready', () => {
        this.client.cwd(
          '/public_html/treinadoraamanda/client_image/',
          (err) => {
            if (err) reject(err);

            this.client.put(stream, fileName, (err) => {
              if (err) reject(err);

              this.client.end();
              resolve();
            });
          },
        );
      });

      this.client.connect({
        host: 'bcsgarcia.com.br',
        user: 'u408558298',
        password: 'jovZy3-gopryn-huspad',
      });
    });
  }
}
