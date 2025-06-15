import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { DomainError } from 'src/api/utils/domain.error';
import { convertDateToTimestamp } from 'src/api/utils/date-to-timestamp';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AppointmentRepository {
  constructor(
    private databaseService: DatabaseService,
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async create(appointment: CreateAppointmentDto): Promise<string> {
    try {
      // appointment.appointmentStartDate = new Date(appointment.appointmentStartDate);
      // appointment.appointmentEndDate = new Date(appointment.appointmentEndDate);
      //
      // const createQuery =
      //   'insert into appointment (appointmentStartDate, appointmentEndDate, title, description, personalObservation, isDone, idCompany, backgroundColor) values (?,?,?,?,?,?,?,?);';
      //
      // await this.databaseService.execute(createQuery, [
      //   convertDateToTimestamp(appointment.appointmentStartDate),
      //   convertDateToTimestamp(appointment.appointmentEndDate),
      //   appointment.title,
      //   appointment.description,
      //   appointment.personalObservation,
      //   appointment.isDone,
      //   appointment.idCompany,
      //   appointment.backgroundColor,
      // ]);
      //
      // const _appointmentStartDate = convertDateToTimestamp(appointment.appointmentStartDate);
      // const _appointmentEndDate = convertDateToTimestamp(appointment.appointmentEndDate);
      //
      // const getIdQuery = `SELECT id
      //                     FROM appointment
      //                     WHERE title = '${appointment.title}'
      //                       AND appointmentStartDate = '${_appointmentStartDate}'
      //                       AND appointmentEndDate = '${_appointmentEndDate}'
      //                       AND idCompany = '${appointment.idCompany}'`;
      //
      // const idAppointment = await this.databaseService.execute(getIdQuery);
      //
      // return idAppointment[0];
      appointment.appointmentStartDate = new Date(
        appointment.appointmentStartDate,
      );
      appointment.appointmentEndDate = new Date(appointment.appointmentEndDate);

      // Preparar os campos convertidos para string SQL
      const startTs = convertDateToTimestamp(appointment.appointmentStartDate);
      const endTs = convertDateToTimestamp(appointment.appointmentEndDate);

      // Inserir e retornar o id gerado
      const { data, error } = await this.supabase
        .from('appointment')
        .insert([
          {
            appointmentStartDate: startTs,
            appointmentEndDate: endTs,
            title: appointment.title,
            description: appointment.description,
            personalObservation: appointment.personalObservation,
            isDone: appointment.isDone,
            idCompany: appointment.idCompany,
            backgroundColor: appointment.backgroundColor,
          },
        ])
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      throw new HttpException(
        DomainError.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createAppointmentClient(
    idAppointment: string,
    idClient: string,
  ): Promise<void> {
    try {
      // const createQuery = 'insert into appointmentClient (idAppointment, idClient) values (?,?);';
      //
      // await this.databaseService.execute(createQuery, [idAppointment, idClient]);

      const { error } = await this.supabase.from('appointmentClient').insert([
        {
          idAppointment,
          idClient,
        },
      ]);

      if (error) throw error;
    } catch (error) {
      throw new HttpException(
        DomainError.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(idAppointment: string): Promise<void> {
    try {
      // await this.databaseService.execute('UPDATE appointment SET isActive = 0 WHERE id = ?', [idAppointment]);

      const { error } = await this.supabase
        .from('appointment')
        .update({ isActive: false })
        .eq('id', idAppointment);

      if (error) throw error;
    } catch (error) {
      throw new HttpException(
        DomainError.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    idAppointment: string,
    appointment: UpdateAppointmentDto,
  ): Promise<void> {
    try {
      // appointment.appointmentStartDate = new Date(appointment.appointmentStartDate);
      // appointment.appointmentEndDate = new Date(appointment.appointmentEndDate);
      //
      // await this.databaseService.execute(
      //   `UPDATE appointment
      //    SET appointmentStartDate = ?,
      //        appointmentEndDate   = ?,
      //        title                = ?,
      //        description          = ?,
      //        personalObservation  = ?,
      //        isDone               = ?,
      //        backgroundColor      = ?
      //    WHERE id = ?`,
      //   [
      //     convertDateToTimestamp(appointment.appointmentStartDate),
      //     convertDateToTimestamp(appointment.appointmentEndDate),
      //     appointment.title,
      //     appointment.description,
      //     appointment.personalObservation,
      //     appointment.isDone,
      //     appointment.backgroundColor,
      //     idAppointment,
      //   ],
      // );
      appointment.appointmentStartDate = new Date(
        appointment.appointmentStartDate,
      );
      appointment.appointmentEndDate = new Date(appointment.appointmentEndDate);

      const startTs = convertDateToTimestamp(appointment.appointmentStartDate);
      const endTs = convertDateToTimestamp(appointment.appointmentEndDate);

      const { error } = await this.supabase
        .from('appointment')
        .update({
          appointmentStartDate: startTs,
          appointmentEndDate: endTs,
          title: appointment.title,
          description: appointment.description,
          personalObservation: appointment.personalObservation,
          isDone: appointment.isDone,
          backgroundColor: appointment.backgroundColor,
        })
        .eq('id', idAppointment);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async getAllClientsAssociatedWithAppointment(
    idAppointment: string,
  ): Promise<any> {
    try {
      // const query = `
      //     SELECT c.id
      //     FROM client c
      //              INNER JOIN appointmentClient AC on AC.idClient = c.id
      //     WHERE AC.idAppointment = '${idAppointment}'`;
      //
      // return await this.databaseService.execute(query);
      // Supabase: buscar todos os idClient relacionados à appointment
      const { data, error } = await this.supabase
        .from('appointmentClient')
        .select('idClient')
        .eq('idAppointment', idAppointment);

      if (error) throw error;

      // Retornar no formato [{ id: '...' }, ...]
      return (data || []).map((row) => ({ id: row.idClient }));
    } catch (error) {}
  }

  async deleteAppointmentClientByIdAppointment(
    idAppointment: string,
  ): Promise<void> {
    try {
      // const query = `delete
      //                from appointmentClient
      //                where idAppointment = '${idAppointment}';`;
      //
      // await this.databaseService.execute(query);
      const { error } = await this.supabase
        .from('appointmentClient')
        .delete()
        .eq('idAppointment', idAppointment);

      if (error)
        throw new HttpException(
          DomainError.INTERNAL_SERVER_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    } catch (error) {
      throw new HttpException(
        DomainError.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAll(idCompany: string): Promise<any> {
    try {
      // const query = `
      //     select a.id,
      //            a.appointmentStartDate,
      //            a.appointmentEndDate,
      //            a.title,
      //            a.description,
      //            a.personalObservation,
      //            a.isDone,
      //            a.backgroundColor,
      //            ac.idClient,
      //            case when n.id is not null then true else false end notificated
      //     from appointment a
      //              left join appointmentClient ac on a.id = ac.idAppointment
      //              left join notification n on a.id = n.appointmentId and
      //                                          n.idClient = n.idClient
      //     where a.isActive = 1
      //       AND a.idCompany = '${idCompany}'
      // `;
      //
      // return await this.databaseService.execute(query);
      // Supabase: busca appointment com clientes e notificações relacionadas
      const { data: rows, error } = await this.supabase
        .from('appointment')
        .select(
          `
        id,
        appointmentStartDate,
        appointmentEndDate,
        title,
        description,
        personalObservation,
        isDone,
        backgroundColor,
        appointmentClient ( idClient ),
        notification ( id, idClient )
      `,
        )
        .eq('isActive', true)
        .eq('idCompany', idCompany);

      if (error) throw error;

      // Transformação: para cada combinação appointment x client,
      // determinamos se há notificação para aquele client
      const result = [];
      for (const appt of rows || []) {
        const clients = appt.appointmentClient || [];
        const notifs = appt.notification || [];

        // se não houver clientes, ainda retorna a consulta básica
        if (clients.length === 0) {
          result.push({
            id: appt.id,
            appointmentStartDate: appt.appointmentStartDate,
            appointmentEndDate: appt.appointmentEndDate,
            title: appt.title,
            description: appt.description,
            personalObservation: appt.personalObservation,
            isDone: appt.isDone,
            backgroundColor: appt.backgroundColor,
            idClient: null,
            notificated: false,
          });
        } else {
          for (const c of clients) {
            const notified = notifs.some((n) => n.idClient === c.idClient);
            result.push({
              id: appt.id,
              appointmentStartDate: appt.appointmentStartDate,
              appointmentEndDate: appt.appointmentEndDate,
              title: appt.title,
              description: appt.description,
              personalObservation: appt.personalObservation,
              isDone: appt.isDone,
              backgroundColor: appt.backgroundColor,
              idClient: c.idClient,
              notificated: notified,
            });
          }
        }
      }

      return result;
    } catch (error) {
      throw new HttpException(
        DomainError.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
