import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Notification } from 'src/models/notification.model';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { GetNotificationDto } from '../dto/get-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { NotificationRepository } from '../repository/notification.repository';

@Injectable()
export class NotificationService {

  constructor(private readonly notificationRepository: NotificationRepository) { }


  create(createNotificationDto: CreateNotificationDto) {
    try {
      return this.notificationRepository.create(createNotificationDto);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAllByIdClient(idClient: string, idCompany: string): Promise<GetNotificationDto[]> {
    try {
      const rows = await this.notificationRepository.findAllByIdClient(idClient, idCompany);

      return rows.map((row) => new GetNotificationDto(row));

    } catch (error) {
      throw error;
    }
  }

  async findAllWarningByIdCompany(idCompany: string): Promise<Notification[]> {
    try {

      const rows = await this.notificationRepository.findAllWarningByIdCompany(idCompany);

      return rows.map((row) => new Notification(row));

    } catch (error) {
      throw error;
    }
  }

  async updateUnreadNotifications(idClient: string, idCompany: string): Promise<void> {
    // pegar todas notifications do client
    // fazer insert na tabela de read com a data now
    try {

      const allNotifications = await this.notificationRepository.findAllByIdClient(idClient, idCompany);


      const allNotificationsUnread = allNotifications.filter((notification) => notification.readDate === null);

      if (allNotificationsUnread.length > 0) {
        for (const item of allNotificationsUnread) {
          await this.notificationRepository.createReadNotification(item.id, idClient);
          console.log('done');
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async detele(idNotification: string): Promise<void> {
    try {
      await this.notificationRepository.deleteById(idNotification);
    } catch (error) {
      throw error;
    }
  }
}
