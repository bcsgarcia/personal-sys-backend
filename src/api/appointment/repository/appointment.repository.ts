import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { DomainError } from 'src/api/utils/domain.error';
import { convertDateToTimestamp } from 'src/api/utils/date-to-timestamp';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';

@Injectable()
export class AppointmentRepository {
  constructor(private databaseService: DatabaseService) {}

  async create(appointment: CreateAppointmentDto): Promise<string> {
    try {
      appointment.appointmentStartDate = new Date(appointment.appointmentStartDate);
      appointment.appointmentEndDate = new Date(appointment.appointmentEndDate);

      const createQuery =
        'insert into appointment (appointmentStartDate, appointmentEndDate, title, description, personalObservation, isDone, idCompany, backgroundColor) values (?,?,?,?,?,?,?,?);';

      await this.databaseService.execute(createQuery, [
        convertDateToTimestamp(appointment.appointmentStartDate),
        convertDateToTimestamp(appointment.appointmentEndDate),
        appointment.title,
        appointment.description,
        appointment.personalObservation,
        appointment.isDone,
        appointment.idCompany,
        appointment.backgroundColor,
      ]);

      const _appointmentStartDate = convertDateToTimestamp(appointment.appointmentStartDate);
      const _appointmentEndDate = convertDateToTimestamp(appointment.appointmentEndDate);

      const getIdQuery = `SELECT id
                          FROM appointment
                          WHERE title = '${appointment.title}'
                            AND appointmentStartDate = '${_appointmentStartDate}'
                            AND appointmentEndDate = '${_appointmentEndDate}'
                            AND idCompany = '${appointment.idCompany}'`;

      const idAppointment = await this.databaseService.execute(getIdQuery);

      return idAppointment[0];
    } catch (error) {
      throw new HttpException(DomainError.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createAppointmentClient(idAppointment: string, idClient: string): Promise<void> {
    try {
      const createQuery = 'insert into appointmentClient (idAppointment, idClient) values (?,?);';

      await this.databaseService.execute(createQuery, [idAppointment, idClient]);
    } catch (error) {
      throw new HttpException(DomainError.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(idAppointment: string): Promise<void> {
    try {
      await this.databaseService.execute('UPDATE appointment SET isActive = 0 WHERE id = ?', [idAppointment]);
    } catch (error) {
      throw new HttpException(DomainError.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(idAppointment: string, appointment: UpdateAppointmentDto): Promise<void> {
    try {
      appointment.appointmentStartDate = new Date(appointment.appointmentStartDate);
      appointment.appointmentEndDate = new Date(appointment.appointmentEndDate);

      await this.databaseService.execute(
        `UPDATE appointment
         SET appointmentStartDate = ?,
             appointmentEndDate   = ?,
             title                = ?,
             description          = ?,
             personalObservation  = ?,
             isDone               = ?,
             backgroundColor      = ?
         WHERE id = ?`,
        [
          convertDateToTimestamp(appointment.appointmentStartDate),
          convertDateToTimestamp(appointment.appointmentEndDate),
          appointment.title,
          appointment.description,
          appointment.personalObservation,
          appointment.isDone,
          appointment.backgroundColor,
          idAppointment,
        ],
      );
    } catch (error) {
      throw error;
    }
  }

  async getAllClientsAssociatedWithAppointment(idAppointment: string): Promise<any> {
    try {
      const query = `
          SELECT c.id
          FROM client c
                   INNER JOIN appointmentClient AC on AC.idClient = c.id
          WHERE AC.idAppointment = '${idAppointment}'`;

      return await this.databaseService.execute(query);
    } catch (error) {}
  }

  async deleteAppointmentClientByIdAppointment(idAppointment: string): Promise<void> {
    try {
      const query = `delete
                     from appointmentClient
                     where idAppointment = '${idAppointment}';`;

      await this.databaseService.execute(query);
    } catch (error) {
      throw new HttpException(DomainError.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAll(idCompany: string): Promise<any> {
    try {
      // const query = `
      //       SELECT
      //           a.id AS appointment_id,
      //           a.isActive AS appointment_isActive,
      //           a.lastUpdate AS appointment_lastUpdate,
      //           a.appointmentStartDate AS appointment_startDate,
      //           a.appointmentEndDate AS appointment_endDate,
      //           a.title AS appointment_title,
      //           a.description AS appointment_description,
      //           a.personalObservation AS appointment_personalObservation,
      //           a.isDone AS appointment_isDone,
      //           a.idClient AS appointment_idClient,
      //           a.idCompany AS appointment_idCompany,
      //           c.id AS client_id,
      //           c.idCompany AS client_idCompany,
      //           c.name AS client_name,
      //           c.birthday AS client_birthday,
      //           c.gender AS client_gender,
      //           c.phone AS client_phone,
      //           c.isActive AS client_isActive,
      //           c.photoUrl AS client_photoUrl,
      //           auth.email AS client_email
      //       FROM
      //             appointment a
      //       LEFT JOIN
      //             appointmentClient ac ON a.id = ac.idAppointment
      //       LEFT JOIN
      //             client c ON ac.idClient = c.id
      //       LEFT JOIN
      //             auth ON c.idAuth = auth.id
      //       WHERE
      //           a.isActive = 1 AND
      //           a.idCompany = '${idCompany}'
      //       ORDER BY
      //           a.appointmentStartDate;`;

      // const query = `select *
      //                from appointment a
      //                         left join appointmentClient ac on a.id = ac.idAppointment
      //                where a.isActive = 1
      //                  AND a.idCompany = '${idCompany}';`;

      const query = `select a.id,
                            a.appointmentStartDate,
                            a.appointmentEndDate,
                            a.title,
                            a.description,
                            a.personalObservation,
                            a.isDone,
                            a.backgroundColor,
                            ac.idClient,
                            case when n.id is not null then true else false end notificated
                     from appointment a
                              left join appointmentClient ac on a.id = ac.idAppointment
                              left join notification n on a.id = n.appointmentId and n.idClient = n.idClient
                     where a.isActive = 1
                       AND a.idCompany = '${idCompany}'`;

      return await this.databaseService.execute(query);
    } catch (error) {
      throw new HttpException(DomainError.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
