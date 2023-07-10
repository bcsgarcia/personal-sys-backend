import { Injectable } from '@nestjs/common';

// import ffmpeg from 'ffmpeg-static';
import * as mimeTypes from 'mime-types';
import {
  createReadStream,
  createWriteStream,
  promises as fsPromises,
} from 'fs';
import * as ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';

const writeFileAsync = promisify(createWriteStream);
const { readFile, unlink: unlinkAsync } = fsPromises;

@Injectable()
export class ThumbnailService {
  // constructor() {
  //   ffmpeg.setFfmpegPath('/opt/homebrew/bin/ffmpeg');
  // }

  async createThumbnail(
    videoBuffer: Buffer,
    mimeType: string,
    idMedia: string,
  ): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const videoPath = `/uploads/temp/${idMedia}.${this.getFileExtension(
          mimeType,
        )}`;
        await fsPromises.writeFile(videoPath, videoBuffer);

        const thumbnailFileName = `${idMedia}.jpg`;

        const thumbnailPath = `/uploads/temp/${thumbnailFileName}`;
        const thumbnailWriteStream = writeFileAsync(thumbnailPath, {});

        ffmpeg(createReadStream(videoPath))
          .screenshots({
            timemarks: ['00:00:05'],
            filename: thumbnailFileName,
            folder: thumbnailPath,
            size: '320x240',
          })
          .on('error', (error) => {
            console.error('Erro ao criar thumbnail:', error);
            reject(error);
          })
          .on('end', async () => {
            const thumbnailBuffer = await readFile(thumbnailPath);
            resolve(thumbnailBuffer);

            // Deleta os arquivos temporários após o uso
            await Promise.all([
              unlinkAsync(videoPath),
              unlinkAsync(thumbnailPath),
            ]);
          })
          .pipe(thumbnailWriteStream);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  // async createThumbnail(file: Buffer, mimetype: string): Promise<Buffer> {
  //   // Cria um arquivo temporário com o vídeo
  //   const videoPath = path.join(
  //     __dirname,
  //     `temp.${this.getFileExtension(mimetype)}`,
  //   );
  //   fs.writeFileSync(videoPath, file);
  //
  //   // Path para a imagem temporária
  //   const imagePath = path.join(__dirname, 'temp.jpg');
  //
  //   // Gera a imagem com o ffmpeg
  //   return new Promise((resolve, reject) => {
  //     execFile(
  //       ffmpeg.path,
  //       ['-i', videoPath, '-ss', '00:00:01', '-frames', '1', imagePath],
  //       (error) => {
  //         if (error) {
  //           reject(error);
  //           return;
  //         }
  //
  //         // Lê a imagem como um buffer
  //         const imageBuffer = fs.readFileSync(imagePath);
  //
  //         // Remove os arquivos temporários
  //         fs.unlinkSync(videoPath);
  //         fs.unlinkSync(imagePath);
  //
  //         resolve(imageBuffer);
  //       },
  //     );
  //   });
  // }

  getFileExtension(mimetype: string): string {
    const extension = mimeTypes.extension(mimetype);
    if (extension === false) {
      throw new Error('Invalid mimetype');
    }
    return extension;
  }
}
