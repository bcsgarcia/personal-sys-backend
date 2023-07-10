import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateMediaDto } from '../dto/update-media.dto';
import { MediaDto } from '../dto/create-media.dto';
import { MediaRepository } from '../repository/media.repository';

@Injectable()
export class MediaService {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async create(mediaDto: MediaDto): Promise<MediaDto> {
    try {
      const row = await this.mediaRepository.create(mediaDto);
      const createdMediaDto = new MediaDto(row);

      createdMediaDto.url = `${
        mediaDto.type == 'image'
          ? process.env.IMAGE_BASE_PATH
          : process.env.VIDEO_BASE_PATH
      }/${createdMediaDto.id}.${createdMediaDto.fileFormat}`;

      if (mediaDto.type == 'video') {
        createdMediaDto.thumbnailUrl = process.env.THUMBNAIL_BASE_PATH;
      }

      await this.mediaRepository.updateUrlMedia(createdMediaDto);

      return createdMediaDto;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAll(idCompany: string) {
    const rows = await this.mediaRepository.findAll(idCompany);
    const mediaList = rows.map((row) => new MediaDto(row));
    return mediaList;
  }

  findOne(id: number) {
    return `This action returns a #${id} media`;
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
