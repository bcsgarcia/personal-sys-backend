import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Notification } from 'src/models/notification.model';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { GetNotificationDto } from '../dto/get-notification.dto';
import { NotificationRepository } from '../repository/notification.repository';
import { AccessTokenModel } from 'src/models/access-token-user.model';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  create(createNotificationDto: CreateNotificationDto) {
    try {
      createNotificationDto.notificationDate = new Date();

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

  async detele(idNotification: string): Promise<void> {
    try {
      await this.notificationRepository.deleteById(idNotification);
    } catch (error) {
      throw error;
    }
  }

  async updateUnreadNotifications(user: AccessTokenModel): Promise<void> {
    try {
      await this.notificationRepository.updateReadDateForAllNotification(user.clientId, user.clientIdCompany);
    } catch (error) {
      throw error;
    }
  }
}
