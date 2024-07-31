import { Injectable } from '@nestjs/common';
import { WorkoutModel } from 'src/models/workout.model';
import { WorkoutRepository } from 'src/api/workout/repository/workout.repository';
import { CreateWorkoutDto } from '../dto/create-workout.dto';
import { UpdateWorkoutDto } from '../dto/update-workout.dto';
import { MediaRepository } from '../../media/repository/media.repository';
import { WorkoutClientModel } from '../../../models/workout.client.model';
import { CreateWorkoutClientDto } from '../dto/create-workout-client.dto';
import { UpdateWorkoutClientDto } from '../dto/update-workout-client.dto';

@Injectable()
export class WorkoutService {
  constructor(
    private readonly workoutRepository: WorkoutRepository,
    private readonly mediaRepository: MediaRepository,
  ) {}

  async create(createWorkoutDto: CreateWorkoutDto) {
    try {
      await this.workoutRepository.create(createWorkoutDto);

      const workout = await this.workoutRepository.findLastInserted(createWorkoutDto);

      await this.workoutRepository.createWorkoutMedia(
        createWorkoutDto.mediaList,
        workout[0].id,
        createWorkoutDto.idCompany,
      );

      return { status: 'success' };
    } catch (error) {
      throw error;
    }
  }

  async createFeedback(idWorkoutClient: string, idCompany: string, feedback: string): Promise<void> {
    try {
      return await this.workoutRepository.createFeedback(idWorkoutClient, idCompany, feedback);
    } catch (error) {
      throw error;
    }
  }

  async update(updateWorkoutDto: UpdateWorkoutDto) {
    try {
      await this.workoutRepository.update(updateWorkoutDto);

      await this.workoutRepository.deleteWorkoutMedia(updateWorkoutDto.id);

      if (updateWorkoutDto.mediaList.length > 0) {
        console.log(updateWorkoutDto.mediaList);

        await this.workoutRepository.createWorkoutMedia(
          updateWorkoutDto.mediaList,
          updateWorkoutDto.id,
          updateWorkoutDto.idCompany,
        );
      }

      return { status: 'success' };
    } catch (error) {
      throw error;
    }
  }

  async findAll(idCompany: string): Promise<WorkoutModel[]> {
    try {
      const rows = await this.workoutRepository.findAll(idCompany);
      const workoutMediaList = await this.workoutRepository.findAllWorkoutMedia(idCompany);
      const mediaList = await this.mediaRepository.findAll(idCompany);

      // Criar um mapa de media para busca rápida
      const mediaMap: { [key: string]: any } = {};
      mediaList.forEach((media) => {
        mediaMap[media.id] = media;
      });

      return rows.map((row) => {
        const workoutModel = new WorkoutModel(row);

        // Obter todos os workoutMedia que correspondem ao item.id
        workoutModel.mediaList = workoutMediaList
          .filter((workoutMedia) => workoutMedia.idWorkout === workoutModel.id)
          .map((wm) => {
            const mediaCopy = { ...mediaMap[wm.idMedia] }; // Copia do objeto para evitar mutação
            mediaCopy.mediaOrder = wm.mediaOrder;
            return mediaCopy;
          });

        return workoutModel;
      });
    } catch (error) {
      throw error;
    }
  }

  // async findAll(idCompany: string): Promise<WorkoutModel[]> {
  //   try {
  //     const rows = await this.workoutRepository.findAll(idCompany);
  //     const workoutMediaList = await this.workoutRepository.findAllWorkoutMedia(
  //       idCompany,
  //     );
  //     const workoutList = rows.map((row) => new WorkoutModel(row));
  //     const mediaList = await this.mediaRepository.findAll(idCompany);
  //
  //     const retorno = workoutList.map((item) => {
  //       // Obter todos os workoutMedia que correspondem ao item.id
  //       item.mediaList = workoutMediaList
  //         .filter((workoutMedia) => workoutMedia.idWorkout == item.id)
  //         .map((wm) => {
  //           if (item.title == 'Bodyweight Bootcamp') {
  //             console.log('AQUI');
  //           }
  //           wm.media = mediaList.find((m) => m.id == wm.idMedia);
  //           wm.media.mediaOrder = wm.mediaOrder;
  //           return wm.media;
  //         });
  //
  //       // Filtrar os mediaList que correspondem aos IDs obtidos
  //       if (item.title == 'Bodyweight Bootcamp') {
  //         console.log(item);
  //       }
  //       return item;
  //     });
  //
  //     return retorno;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // workoutMediaMatches.sort((a, b) => a.mediaOrder - b.mediaOrder);

  // Pegar os IDs de todos os workoutMediaMatches
  // item.workoutMediaList = workoutMediaMatches.map((wm) => {
  //   return {
  //     media: mediaList.find((media) => media.id === wm.idMedia),
  //     mediaOrder: wm.mediaOrder,
  //   };
  // });

  async findManyWorkoutByIdWorkout(idWorkoutList: string[], idCompany: string): Promise<WorkoutModel[]> {
    try {
      const rows = await this.workoutRepository.findManyWorkoutByIdWorkout(idWorkoutList);

      // Carregar todos os médias de uma vez
      const mediaList = await this.workoutRepository.findManyMediaByIdWorkout(idWorkoutList, idCompany);

      // Criar um mapa de media para busca rápida
      const mediaMap: { [key: string]: any } = {};
      mediaList.forEach((media) => {
        mediaMap[media.id] = media;
      });

      // Carregar todos os workoutMedia de uma vez
      const workoutMediaList = await this.workoutRepository.findManyWorkoutMediaByIdWorkoutList(
        idWorkoutList,
        idCompany,
      );

      const retorno = rows.map((row) => {
        const workoutModel = new WorkoutModel(row);

        // Obter todos os workoutMedia que correspondem ao workoutModel.id
        const workoutMediaMatches = workoutMediaList.filter(
          (workoutMedia) => workoutMedia.idWorkout == workoutModel.id,
        );

        // Atualizar o mediaList do workoutModel
        workoutModel.mediaList = workoutMediaMatches.map((wm) => {
          const mediaCopy = { ...mediaMap[wm.idMedia] }; // Copia do objeto para evitar mutação
          mediaCopy.mediaOrder = wm.mediaOrder;
          return mediaCopy;
        });

        return workoutModel;
      });

      return retorno;
    } catch (error) {
      throw error;
    }
  }

  // async findManyWorkoutByIdWorkout(
  //   idWorkoutList: string[],
  //   idCompany: string,
  // ): Promise<WorkoutModel[]> {
  //   try {
  //     const rows = await this.workoutRepository.findManyWorkoutByIdWorkout(
  //       idWorkoutList,
  //     );
  //     const workoutList = rows.map((row) => new WorkoutModel(row));
  //
  //     const mediaList = await this.workoutRepository.findManyMediaByIdWorkout(
  //       idWorkoutList,
  //       idCompany,
  //     );
  //
  //     // Criar um mapa de media para busca rápida
  //     const mediaMap: { [key: string]: any } = {};
  //     mediaList.forEach((media) => {
  //       mediaMap[media.id] = media;
  //     });
  //
  //     const workoutMediaList =
  //       await this.workoutRepository.findManyWorkoutMediaByIdWorkoutList(
  //         idWorkoutList,
  //         idCompany,
  //       );
  //
  //     const retorno = workoutList.map((item) => {
  //       // Obter todos os workoutMedia que correspondem ao item.id
  //       const workoutMediaMatches = workoutMediaList.filter(
  //         (workoutMedia) => workoutMedia.idWorkout == item.id,
  //       );
  //
  //       // Pegar os IDs de todos os workoutMediaMatches
  //       item.mediaList = workoutMediaMatches.map((wm) => {
  //         const mediaCopy = { ...mediaMap[wm.idMedia] }; // Copia do objeto para evitar mutação
  //         mediaCopy.mediaOrder = wm.mediaOrder;
  //         return mediaCopy;
  //       });
  //
  //       // Filtrar os mediaList que correspondem aos IDs obtidos
  //       return item;
  //     });
  //
  //     return retorno;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async findManyWorkoutByIdWorkoutheetList(idWorkoutsheetList: string[], idCompany: string): Promise<any> {
    try {
      const workoutList = await this.workoutRepository.findManyWorkoutByIdWorkoutsheetList(idWorkoutsheetList);

      if (idWorkoutsheetList.length == 0 || workoutList.length == 0) {
        return [];
      }

      const mediaList = await this.workoutRepository.findManyMediaByIdWorkout(
        workoutList.map((w) => w.id),
        idCompany,
      );

      // const workoutMediaList =
      //   await this.workoutRepository.findManyWorkoutMediaByIdWorkoutList(
      //     workoutList.map((w) => w.id),
      //     idCompany,
      //   );

      const retorno = workoutList.map((item) => {
        // Obter todos os workoutMedia que correspondem ao item.id
        // const workoutMediaMatches = workoutMediaList.filter(
        //   (workoutMedia) => workoutMedia.idWorkout == item.id,
        // );

        // Pegar os IDs de todos os workoutMediaMatches
        // item.workoutMediaList = workoutMediaMatches.map((wm) => {
        //   return {
        //     media: mediaList.find((media) => media.id === wm.idMedia),
        //     mediaOrder: wm.mediaOrder,
        //   };
        // });

        item.mediaList = mediaList.filter((media) => media.idWorkout == item.id);
        // Filtrar os mediaList que correspondem aos IDs obtidos
        return item;
      });

      return retorno;
    } catch (error) {
      throw error;
    }
  }

  async remove(idWorkout: string) {
    try {
      await this.workoutRepository.deleteWorkoutMedia(idWorkout);

      await this.workoutRepository.deleteById(idWorkout);

      return { status: 'success' };
    } catch (error) {
      throw error;
    }
  }

  // ========= WokoutClient =============================================================================================================

  async createWorkoutClient(createWorkoutClientDto: CreateWorkoutClientDto) {
    try {
      await this.workoutRepository.createWorkoutClient(createWorkoutClientDto);
      return { status: 'success' };
    } catch (error) {
      throw error;
    }
  }

  async updateWorkoutClient(updateWorkoutClientDto: UpdateWorkoutClientDto) {
    try {
      await this.workoutRepository.updateWorkoutClient(updateWorkoutClientDto);
      return { status: 'success' };
    } catch (error) {
      throw error;
    }
  }

  async removeWorkoutClient(idWorkoutClient: string) {
    try {
      await this.workoutRepository.deleteWorkoutClientById(idWorkoutClient);

      return { status: 'success' };
    } catch (error) {
      throw error;
    }
  }

  async findWorkoutClientByWorkoutSheet(idWorkoutsheet: string[], idCompany: string): Promise<WorkoutClientModel[]> {
    try {
      const rows = await this.workoutRepository.findWorkoutClientByWorkoutsheet(idWorkoutsheet);

      const workoutClientList = rows.map((row) => new WorkoutClientModel(row));

      const idWorkoutClientList = workoutClientList.map((item) => item.idWorkout);

      if (idWorkoutClientList.length == 0) {
        return [];
      }

      const workoutModelList = await this.findManyWorkoutByIdWorkout(idWorkoutClientList, idCompany);
      //
      const retorno = workoutClientList.map((item) => {
        // Obter todos os workoutMedia que correspondem ao item.id
        const workoutModel = workoutModelList.find((workout) => workout.id == item.idWorkout);

        item.workout = workoutModel;

        // Filtrar os mediaList que correspondem aos IDs obtidos
        return item;
      });

      return retorno;
    } catch (error) {
      throw error;
    }
  }
}
