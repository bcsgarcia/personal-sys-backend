import { Injectable } from '@nestjs/common';
// import * as ftp from 'ftp';
import * as basicFtp from 'basic-ftp';
import { Readable } from 'typeorm/platform/PlatformTools';
import { rethrow } from '@nestjs/core/helpers/rethrow';

@Injectable()
export class FtpService {
  async uploadClientEvaluationPhoto(
    fileBuffer: Buffer,
    fileName: string,
    clientId: string,
    idClientEvaluation: string,
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

      await client.ensureDir(`${process.env.FTP_CLIENT_IMAGE_PATH}/${clientId}/${idClientEvaluation}/`);

      console.log(`upload uploadClientEvaluationPhoto - path: ${await client.pwd()} - filename: ${fileName}`);

      await client.uploadFrom(stream, fileName);
    } catch (error) {
      console.error(`uploadClientEvaluationPhoto - Erro ao fazer upload da foto: ${error}`);
      rethrow;
    } finally {
      stream.destroy();
      client.close();
    }
  }

  async uploadPartnershipLogo(fileBuffer: Buffer, fileName: string): Promise<void> {
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

      await client.ensureDir(`${process.env.FTP_PARTNERSHIP_LOGO_PATH}`);

      console.log(`upload uploadPartnershipLogo - path: ${await client.pwd()} - filename: ${fileName}`);

      await client.uploadFrom(stream, fileName);
    } catch (error) {
      console.error(`uploadPartnershipLogo - Erro ao fazer upload da foto: ${error}`);
      rethrow;
    } finally {
      stream.destroy();
      client.close();
    }
  }

  async uploadPhoto(fileBuffer: Buffer, fileName: string, path: string): Promise<void> {
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

      await client.ensureDir(path);

      console.log(`upload photo - path: ${await client.pwd()} - filename: ${fileName}`);

      await client.uploadFrom(stream, fileName);

      // return true; // Indica que o arquivo foi salvo com sucesso
    } catch (error) {
      console.error('uploadPhoto - Erro ao fazer upload da foto:', error);
      rethrow;
      // return false; // Indica que ocorreu um erro durante o processo
    } finally {
      stream.destroy();
      client.close();
    }
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, mediaType: string): Promise<void> {
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

      console.log(`upload file ${mediaType}: path: ${await client.pwd()} - filename: ${fileName}`);

      await client.uploadFrom(stream, fileName.toLowerCase());
    } catch (error) {
      console.error(`uploadFile - Erro ao fazer upload do arquivo '${mediaType}': ${error}`);
      rethrow;
    } finally {
      stream.destroy();
      client.close();
    }
  }

  async removePhoto(fileName: string, path: string): Promise<void> {
    const client = new basicFtp.Client();

    try {
      await client.access({
        host: process.env.FTP_HOST,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
      });

      await client.cd(path);

      await client.remove(fileName);
    } catch (error) {
      console.error('removePhoto - Erro ao remover foto:', error);
      rethrow;
    } finally {
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

      console.log(`remove file ${mediaType}: path: ${await client.pwd()} - filename: ${fileName}`);

      await client.remove(fileName);
    } catch (error) {
      console.error('Erro ao remover arquivo:', error);
      rethrow;
    } finally {
      client.close();
    }
  }
}
