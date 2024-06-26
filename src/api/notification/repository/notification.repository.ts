import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { convertDateToTimestamp } from '../../utils/utils';

@Injectable()
export class NotificationRepository {
  constructor(private databaseService: DatabaseService) {}

  async create(notification: CreateNotificationDto): Promise<void> {
    try {
      const createQuery =
        'INSERT INTO notification (title, description, notificationDate, appointmentId, idClient, idCompany) VALUES (?, ?, ?, ?, ?, ?)';

      await this.databaseService.execute(createQuery, [
        notification.title,
        notification.description,
        notification.notificationDate == undefined ? null : convertDateToTimestamp(notification.notificationDate),
        notification.idAppointment == undefined ? null : notification.idAppointment,
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
          SELECT n.id,
                 n.title,
                 n.description,
                 n.notificationDate,
                 rN.readDate,
                 rN.readDate,
                 a.appointmentStartDate,
                 a.appointmentEndDate,
                 a.id as appointmentId
          FROM notification n
                   LEFT JOIN readNotification rN on n.id = rN.idNotification
                   left join appointment a on n.appointmentId = a.id
          WHERE (n.idClient = '${idClient}' or n.idClient is null)
            AND n.idCompany = '${idCompany}'
            AND n.notificationDate <= now()
            AND n.isActive = 1

          ORDER BY n.notificationDate desc limit 50;
      `;

      return await this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }

  async findAllWarningByIdCompany(idCompany: string): Promise<any> {
    try {
      const query = `
          SELECT *
          FROM notification
          WHERE idClient is null
            AND idCompany = '${idCompany}'
            AND isActive = 1
          ORDER BY notificationDate desc`;

      return await this.databaseService.execute(query);
    } catch (error) {
      throw error;
    }
  }

  async createReadNotification(idNotification: string, idClient: string): Promise<void> {
    try {
      const createQuery = 'insert into readNotification (readDate, idNotification, idClient) VALUES (?, ?, ?);';

      await this.databaseService.execute(createQuery, [convertDateToTimestamp(new Date()), idNotification, idClient]);
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      await this.databaseService.execute('UPDATE notification SET isActive = 0 WHERE id = ?', [id]);

      await this.databaseService.execute('UPDATE readNotification SET isActive = 0 WHERE idNotification = ?', [id]);
    } catch (error) {
      throw error;
    }
  }

  async updateReadDateForAllNotification(idClient: string, idCompany: string): Promise<void> {
    try {
      const createQuery = `INSERT INTO readNotification (id, readDate, idNotification, idClient)
                           SELECT UUID(), CURRENT_TIMESTAMP, n.id, n.idClient
                           FROM notification n
                           WHERE n.idClient = '${idClient}'
                             AND n.idCompany = '${idCompany}'
                             AND NOT EXISTS (SELECT 1
                                             FROM readNotification rn
                                             WHERE rn.idNotification = n.id
                                               AND rn.idClient = n.idClient);`;

      await this.databaseService.execute(createQuery);
    } catch (error) {
      throw error;
    }
  }
}
