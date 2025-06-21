import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { convertDateToTimestamp } from '../../utils/utils';
import { SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotificationRepository {
  constructor(
    private databaseService: DatabaseService,
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async create(notification: CreateNotificationDto): Promise<void> {
    try {
      // const createQuery =
      //   'INSERT INTO notification (title, description, notificationDate, appointmentId, idClient, idCompany) VALUES (?, ?, ?, ?, ?, ?)';
      //
      // await this.databaseService.execute(createQuery, [
      //   notification.title,
      //   notification.description,
      //   notification.notificationDate == undefined ? null : convertDateToTimestamp(notification.notificationDate),
      //   notification.idAppointment == undefined ? null : notification.idAppointment,
      //   notification.idClient === undefined ? null : notification.idClient,
      //   notification.idCompany,
      // ]);
      const { error } = await this.supabase.from('notification').insert([
        {
          title: notification.title,
          description: notification.description,
          notificationDate: notification.notificationDate
            ? convertDateToTimestamp(notification.notificationDate)
            : null,
          appointmentId: notification.idAppointment ?? null,
          idClient: notification.idClient ?? null,
          idCompany: notification.idCompany,
        },
      ]);

      if (error) throw error;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAllByIdClient(idClient: string, idCompany: string): Promise<any> {
    try {
      // const query = `
      //     SELECT n.id,
      //            n.title,
      //            n.description,
      //            n.notificationDate,
      //            rN.readDate,
      //            rN.readDate,
      //            a.appointmentStartDate,
      //            a.appointmentEndDate,
      //            a.id as appointmentId
      //     FROM notification n
      //              LEFT JOIN readNotification rN on n.id = rN.idNotification
      //              left join appointment a on n.appointmentId = a.id
      //     WHERE (n.idClient = '${idClient}' or n.idClient is null)
      //       AND n.idCompany = '${idCompany}'
      //       AND n.notificationDate <= now()
      //       AND n.isActive = 1
      //
      //     ORDER BY n.notificationDate desc limit 50;
      // `;
      //
      // return await this.databaseService.execute(query);
      const nowIso = new Date().toISOString();
      const { data, error } = await this.supabase
        .from('notification')
        .select(
          `
        id,
        title,
        description,
        notificationDate,
        readNotification (
          idNotification,
          readDate
        ),
        appointment (
          appointmentStartDate,
          appointmentEndDate,
          id
        )
      `,
        )
        .or(`idClient.eq.${idClient},idClient.is.null`)
        .eq('idCompany', idCompany)
        .lte('notificationDate', nowIso)
        .eq('isActive', true)
        .order('notificationDate', { ascending: false })
        .limit(50);

      if (error) throw error;

      return (data || []).map((n) => ({
        id: n.id,
        title: n.title,
        description: n.description,
        notificationDate: n.notificationDate,
        readDate: n.readNotification?.[0]?.readDate ?? null,
        appointmentStartDate: n.appointment?.[0]?.appointmentStartDate ?? null,
        appointmentEndDate: n.appointment?.[0]?.appointmentEndDate ?? null,
        appointmentId: n.appointment?.[0]?.id ?? null,
      }));
    } catch (error) {
      throw error;
    }
  }

  async findAllWarningByIdCompany(idCompany: string): Promise<any> {
    try {
      // const query = `
      //     SELECT *
      //     FROM notification
      //     WHERE idClient is null
      //       AND idCompany = '${idCompany}'
      //       AND isActive = 1
      //     ORDER BY notificationDate desc`;
      //
      // return await this.databaseService.execute(query);
      const { data, error } = await this.supabase
        .from('notification')
        .select('*')
        .is('idClient', null)
        .eq('idCompany', idCompany)
        .eq('isActive', true)
        .order('notificationDate', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async createReadNotification(
    idNotification: string,
    idClient: string,
  ): Promise<void> {
    try {
      // const createQuery = 'insert into readNotification (readDate, idNotification, idClient) VALUES (?, ?, ?);';
      //
      // await this.databaseService.execute(createQuery, [convertDateToTimestamp(new Date()), idNotification, idClient]);
      const readDateTs = convertDateToTimestamp(new Date());
      const { error } = await this.supabase.from('readNotification').insert([
        {
          readDate: readDateTs,
          idNotification: idNotification,
          idClient: idClient,
        },
      ]);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      // await this.databaseService.execute('UPDATE notification SET isActive = 0 WHERE id = ?', [id]);
      //
      // await this.databaseService.execute('UPDATE readNotification SET isActive = 0 WHERE idNotification = ?', [id]);
      // Desativa notificação
      const { error: notifError } = await this.supabase
        .from('notification')
        .update({ isActive: false })
        .eq('id', id);
      if (notifError) throw notifError;

      // Desativa registros de leitura relacionados
      const { error: readError } = await this.supabase
        .from('readNotification')
        .update({ isActive: false })
        .eq('idNotification', id);
      if (readError) throw readError;
    } catch (error) {
      throw error;
    }
  }

  async updateReadDateForAllNotification(
    idClient: string,
    idCompany: string,
  ): Promise<void> {
    try {
      // const createQuery = `INSERT INTO readNotification (id, readDate, idNotification, idClient)
      //                      SELECT UUID(), CURRENT_TIMESTAMP, n.id, n.idClient
      //                      FROM notification n
      //                      WHERE n.idClient = '${idClient}'
      //                        AND n.idCompany = '${idCompany}'
      //                        AND NOT EXISTS (SELECT 1
      //                                        FROM readNotification rn
      //                                        WHERE rn.idNotification = n.id
      //                                          AND rn.idClient = n.idClient);`;
      //
      // await this.databaseService.execute(createQuery);
      // Supabase: buscar notificações pendentes de leitura
      const { data: notifications, error: notifError } = await this.supabase
        .from('notification')
        .select('id')
        .or(`idClient.eq.${idClient},idClient.is.null`)
        // .eq('idClient', idClient)
        .eq('idCompany', idCompany)
        .eq('isActive', true);

      if (notifError) throw notifError;

      // buscar já lidas
      const { data: existingReads, error: readError } = await this.supabase
        .from('readNotification')
        .select('idNotification')
        .eq('idClient', idClient);

      if (readError) throw readError;

      const readSet = new Set(existingReads.map((r) => r.idNotification));

      const toInsert = (notifications || [])
        .filter((n) => !readSet.has(n.id))
        .map((n) => ({
          id: uuidv4(),
          readDate: new Date().toISOString(),
          idNotification: n.id,
          idClient: idClient,
        }));

      if (toInsert.length === 0) return;

      const { error: insertError } = await this.supabase
        .from('readNotification')
        .insert(toInsert);

      if (insertError) throw insertError;
    } catch (error) {
      throw error;
    }
  }
}
