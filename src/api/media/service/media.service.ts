import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MediaDto } from '../dto/create-media.dto';
import { MediaRepository } from '../repository/media.repository';
import { FtpService } from '../../../common-services/ftp-service.service';

@Injectable()
export class MediaService {
  constructor(
    private readonly mediaRepository: MediaRepository,
    private readonly ftpService: FtpService,
  ) {}

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
        createdMediaDto.thumbnailUrl = `${process.env.THUMBNAIL_BASE_PATH}/${createdMediaDto.id}.png`;
      }

      await this.mediaRepository.updateUrlMedia(createdMediaDto);

      return createdMediaDto;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAll(idCompany: string) {
    try {
      const rows = await this.mediaRepository.findAll(idCompany);
      const mediaList = rows.map((row) => new MediaDto(row));
      return mediaList;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAllPagined(
    idCompany: string,
    page: number,
    itemsPerPage: number,
    mediaType: string,
    title: string,
  ) {
    try {
      const offset = (page - 1) * itemsPerPage;

      const rows = await this.mediaRepository.findAllPagined(
        idCompany,
        offset,
        itemsPerPage,
        mediaType,
        title,
      );
      const mediaList = rows.map((row) => new MediaDto(row));

      return mediaList;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAllPhotos(idCompany: string) {
    try {
      const mediaList = await this.findAll(idCompany);
      return (mediaList as [MediaDto]).filter(
        (media) => media.type === 'image',
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAllVideos(idCompany: string) {
    try {
      const mediaList = await this.findAll(idCompany);
      return (mediaList as [MediaDto]).filter(
        (media) => media.type === 'video',
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(mediaDto: MediaDto) {
    try {
      return await this.mediaRepository.update(mediaDto);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} media`;
  }

  async remove(idMedia: string) {
    try {
      const row = await this.mediaRepository.findById(idMedia);
      const mediaDto = new MediaDto(row);

      await this.mediaRepository.deleteById(idMedia);

      const fileName = `${mediaDto.id}.${mediaDto.fileFormat}`;

      await this.ftpService.removeFile(fileName, mediaDto.type);

      if (mediaDto.type == 'video') {
        await this.ftpService.removeFile(fileName, 'thumbnail');
      }

      return { status: 'success' };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
