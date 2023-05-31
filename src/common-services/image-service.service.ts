import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ImageService {
  async convertToPNG(imageBuffer: Buffer): Promise<Buffer> {
    const test = await sharp(imageBuffer).toFormat('png').toBuffer();

    return test;
  }
}
