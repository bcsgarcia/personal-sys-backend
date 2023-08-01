import { Injectable } from '@nestjs/common';
// import * as ftp from 'ftp';
import * as basicFtp from 'basic-ftp';
import { Readable } from 'typeorm/platform/PlatformTools';
import { rethrow } from '@nestjs/core/helpers/rethrow';

@Injectable()
export class FtpService {
  // private client: ftp;

  constructor() {
    // this.client = new ftp();
  }

  async uploadPhoto(fileBuffer: Buffer, fileName: string): Promise<void> {
    const client = new basicFtp.Client();
    const stream = new Readable();
    stream.push(fileBuffer);
    stream.push(null);

    try {
      await client.access({
        host: process.env.FTP_HOST,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
      });

      await client.cd(process.env.FTP_CLIENT_IMAGE_PATH);

      await client.uploadFrom(stream, fileName);

      // return true; // Indica que o arquivo foi salvo com sucesso
    } catch (error) {
      console.error('Erro ao fazer upload do vídeo:', error);
      rethrow;
      // return false; // Indica que ocorreu um erro durante o processo
    } finally {
      stream.destroy();
      client.close();
    }

    // return new Promise((resolve, reject) => {
    //   // Cria um stream de leitura a partir do buffer
    //   const stream = new Readable();
    //   stream.push(fileBuffer);
    //   stream.push(null);
    //
    //   this.client.on('ready', () => {
    //     this.client.cwd(process.env.FTP_CLIENT_IMAGE_PATH, (err) => {
    //       if (err) reject(err);
    //
    //       this.client.put(stream, fileName, (err) => {
    //         if (err) reject(err);
    //
    //         this.client.end();
    //         resolve();
    //       });
    //     });
    //   });
    //
    //   this.client.connect({
    //     host: process.env.FTP_HOST,
    //     user: process.env.FTP_USER,
    //     password: process.env.FTP_PASSWORD,
    //   });
    // });
  }

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mediaType: string,
  ): Promise<void> {
    const client = new basicFtp.Client();
    const stream = new Readable();
    stream.push(fileBuffer);
    stream.push(null);

    try {
      await client.access({
        host: process.env.FTP_HOST,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
      });

      switch (mediaType) {
        case 'image':
          await client.cd(process.env.FTP_IMAGE_PATH);
          break;
        case 'video':
          await client.cd(process.env.FTP_VIDEO_PATH);
          break;
        case 'thumbnail':
          await client.cd(process.env.FTP_THUMBNAIL_PATH);
          break;
        default:
          return;
      }

      await client.uploadFrom(stream, fileName.toLowerCase());
    } catch (error) {
      console.error('Erro ao fazer upload do vídeo:', error);
      rethrow;
    } finally {
      stream.destroy();
      client.close();
    }
  }

  async removeFile(fileName: string, mediaType: string): Promise<void> {
    const client = new basicFtp.Client();

    try {
      await client.access({
        host: process.env.FTP_HOST,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
      });

      switch (mediaType) {
        case 'image':
          await client.cd(process.env.FTP_IMAGE_PATH);
          break;
        case 'video':
          await client.cd(process.env.FTP_VIDEO_PATH);
          break;
        case 'thumbnail':
          await client.cd(process.env.FTP_THUMBNAIL_PATH);
          break;
        default:
          return;
      }

      await client.remove(fileName);
    } catch (error) {
      console.error('Erro ao fazer upload do vídeo:', error);
      rethrow;
    } finally {
      client.close();
    }
  }
}
