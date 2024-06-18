import { HttpException, HttpStatus, Injectable, UploadedFile } from '@nestjs/common';
import { CreatePartnershipDto } from '../dto/create-partnership.dto';
import { UpdatePartnershipDto } from '../dto/update-partnership.dto';
import { PartnershipRepository } from '../repository/parnership.repository';
import { DomainError } from 'src/api/utils/domain.error';
import { FtpService } from 'src/common-services/ftp-service.service';
import { ImageService } from 'src/common-services/image-service.service';

@Injectable()
export class PartnershipService {
  constructor(
    private readonly partnershipRepository: PartnershipRepository,
    private readonly ftpService: FtpService,
    private readonly imageService: ImageService,
  ) {}

  async create(createPartnerDto: CreatePartnershipDto) {
    try {
      createPartnerDto.idPartnershipCategory = await this.findIdCategory(
        createPartnerDto.idPartnershipCategory,
        createPartnerDto.idCompany,
      );

      const idPartnerInserted = await this.partnershipRepository.create(createPartnerDto);

      return { status: 'success', idPartnership: idPartnerInserted };
    } catch (error) {
      throw error;
    }
  }

  async update(updatePartnerDto: UpdatePartnershipDto) {
    try {
      updatePartnerDto.idPartnershipCategory = await this.findIdCategory(
        updatePartnerDto.idPartnershipCategory,
        updatePartnerDto.idCompany,
      );

      await this.partnershipRepository.update(updatePartnerDto);

      return { status: 'success' };
    } catch (error) {
      throw error;
    }
  }

  async deletePartnershipLogo(idPartnership: string) {
    try {
      await this.ftpService.removePhoto(`${idPartnership}.png`, process.env.FTP_PARTNERSHIP_LOGO_PATH);

      return { status: 'success' };
    } catch (error) {
      throw error;
    }
  }

  async uploadPartnershipLogo(@UploadedFile() file, idPartnership: string) {
    try {
      if (!file.mimetype.includes('image') || file.mimetype.includes('heic')) {
        throw new HttpException(DomainError.INTERNAL_SERVER_ERROR, HttpStatus.BAD_REQUEST);
      }

      const imageBuffer = file.mimetype.includes('png')
        ? file.buffer
        : await this.imageService.convertToPNG(file.buffer);

      const filename = `${idPartnership}.png`;

      await this.ftpService.uploadPhoto(imageBuffer, filename, process.env.FTP_PARTNERSHIP_LOGO_PATH);

      const imageUrl = `${process.env.PARTNERSHIP_LOGO_BASE_PATH}/${filename}`;

      await this.partnershipRepository.updateLogoUrl(idPartnership, imageUrl);

      return { status: 'success' };
    } catch (error) {
      await this.partnershipRepository.updateLogoUrl(idPartnership, null);
      throw error;
    }
  }

  validateFile(@UploadedFile() file): boolean {
    const imageMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];

    if (imageMimeTypes.includes(file.mimetype)) {
      return true;
    } else {
      return false;
    }
  }

  async findAll(idCompany: string) {
    try {
      const rows = await this.partnershipRepository.findAll(idCompany);

      return rows;

      // const mediaList = await this.mediaRepository.findAll(idCompany);

      // Criar um mapa de media para busca rápida
      // const mediaMap: { [key: string]: any } = {};
      // mediaList.forEach((media) => {
      //   mediaMap[media.id] = media;
      // });

      // return rows.map((row) => {
      //   const workoutModel = new WorkoutModel(row);

      //   // Obter todos os workoutMedia que correspondem ao item.id
      //   workoutModel.mediaList = workoutMediaList
      //     .filter((workoutMedia) => workoutMedia.idWorkout === workoutModel.id)
      //     .map((wm) => {
      //       const mediaCopy = { ...mediaMap[wm.idMedia] }; // Copia do objeto para evitar mutação
      //       mediaCopy.mediaOrder = wm.mediaOrder;
      //       return mediaCopy;
      //     });

      //   return workoutModel;
      // });
    } catch (error) {
      throw error;
    }
  }

  async findIdCategory(idCategoryOrName: string, idCompany: string): Promise<string> {
    try {
      const rows = await this.partnershipRepository.findCategoryByIdOrName(idCategoryOrName, idCompany);

      if (rows.length === 0) {
        const createdCategory = await this.partnershipRepository.createCategory(idCategoryOrName, idCompany);

        return createdCategory[0]['id'];
      } else {
        return rows[0]['id'];
      }
    } catch (error) {
      throw error;
    }
  }

  async findAllCategory(idCompany: string) {
    try {
      return this.partnershipRepository.findAllPartnershipCategory(idCompany);
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} partner`;
  }

  async remove(idPartner: string, idCompany: string) {
    try {
      await this.partnershipRepository.delete(idPartner, idCompany);

      return { status: 'success' };
    } catch (error) {
      throw error;
    }
  }
}
