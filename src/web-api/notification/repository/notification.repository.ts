import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { convertDateToTimestamp } from '../../utils/utils';
import { Notification } from 'src/models/notification.model';

@Injectable()
export class NotificationRepository {
  constructor(private databaseService: DatabaseService) {}

  async create(notification: CreateNotificationDto): Promise<void> {
    try {
      const createQuery =
        'INSERT INTO notification (description, date, idClient, idCompany) VALUES (?, ?, ?, ?)';

      await this.databaseService.execute(createQuery, [
        notification.description,
        convertDateToTimestamp(notification.date),
        notification.idClient === undefined ? null : notification.idClient,
        notification.idCompany,
      ]);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAllByIdClient(idClient: string, idCompany: string): Promise<any> {
    try {
      const query = `
            SELECT n.id, n.title, n.description, n.date, rN.readDate, rN.readDate FROM notification n
            LEFT JOIN readNotification rN on n.id = rN.idNotification

            WHERE
            (n.idClient = '${idClient}' or n.idClient is null)
            AND n.idCompany = '${idCompany}'
            AND n.isActive = 1

            ORDER BY n.date desc;
            `;

      return await this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }

  async findAllWarningByIdCompany(idCompany: string): Promise<any> {
    try {
      const query = `
                SELECT * FROM notification
                    WHERE
                        idClient is null
                        AND idCompany = '${idCompany}'
                        AND isActive = 1
                    ORDER BY date desc`;

      return await this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }

  async createReadNotification(
    idNotification: string,
    idClient: string,
  ): Promise<void> {
    try {
      const createQuery =
        'insert into readNotification (readDate, idNotification, idClient) VALUES (?, ?, ?);';

      await this.databaseService.execute(createQuery, [
        convertDateToTimestamp(new Date()),
        idNotification,
        idClient,
      ]);
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id: string): Promise<void> {
    await this.databaseService.execute(
      'UPDATE notification SET isActive = 0 WHERE id = ?',
      [id],
    );

    await this.databaseService.execute(
      'UPDATE readNotification SET isActive = 0 WHERE idNotification = ?',
      [id],
    );
  }
}
