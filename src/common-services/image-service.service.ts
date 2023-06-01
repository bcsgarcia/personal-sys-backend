import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { promises as fs } from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

@Injectable()
export class ImageService {
  async convertToPNG(imageBuffer: Buffer): Promise<Buffer> {
    const test = await sharp(imageBuffer).toFormat('png').toBuffer();

    return test;
  }

  async convertHEICtoPNG(heicBuffer: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const tempHEICFile = path.join(__dirname, 'temp.heic');
      const tempPNGFile = path.join(__dirname, 'temp.png');

      fs.writeFile(tempHEICFile, heicBuffer)
        .then(() => {
          exec(
            `heif-convert ${tempHEICFile} ${tempPNGFile}`,
            (error, stdout, stderr) => {
              if (error) {
                reject(`Error converting HEIC to PNG: ${error}`);
              } else {
                fs.readFile(tempPNGFile)
                  .then((pngBuffer) => {
                    fs.unlink(tempHEICFile).catch((err) =>
                      console.error(`Error deleting temp HEIC file: ${err}`),
                    );
                    fs.unlink(tempPNGFile).catch((err) =>
                      console.error(`Error deleting temp PNG file: ${err}`),
                    );
                    resolve(pngBuffer);
                  })
                  .catch((err) => {
                    reject(`Error reading converted PNG file: ${err}`);
                  });
              }
            },
          );
        })
        .catch((err) => {
          reject(`Error writing HEIC file: ${err}`);
        });
    });
  }
}
