import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { AppointmentRepository } from '../repository/appointment.repository';
import { CreateNotificationDto } from 'src/api/notification/dto/create-notification.dto';
import { NotificationService } from 'src/api/notification/service/notification.service';
import { DomainError } from 'src/api/utils/domain.error';
import { AppointmentWithClientResponseDto } from '../dto/response/response-get-appointment.dto';
import { ClientDto } from 'src/api/client/dto/client.dto';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<void> {
    try {
      if (createAppointmentDto.sendNotificationToClients) {
        await this._createNotificationToClient(createAppointmentDto);
      }

      const idAppointment = await this.appointmentRepository.create(createAppointmentDto);

      if (createAppointmentDto.idClients.length > 0) {
        await this._createAppointmentClient(idAppointment['id'], createAppointmentDto.idClients);
      }
    } catch (error) {
      throw error;
    }
  }

  async delete(idAppointment: string): Promise<void> {
    try {
      await this.appointmentRepository.delete(idAppointment);
    } catch (error) {
      throw error;
    }
  }

  private async _createAppointmentClient(idAppointment: string, idClients: string[]): Promise<void> {
    for (const item of idClients) {
      await this.appointmentRepository.createAppointmentClient(idAppointment, item);
    }
  }

  private async _createNotificationToClient(createAppointmentDto: CreateAppointmentDto): Promise<void> {
    try {
      if (createAppointmentDto.idClients.length <= 0) {
        throw new HttpException(`${DomainError.INVALID_INPUT} - idClients was not provided.`, HttpStatus.BAD_REQUEST);
      }

      const notification: CreateNotificationDto = {
        description: createAppointmentDto.description,
        idCompany: createAppointmentDto.idCompany,
        title: createAppointmentDto.title,
        appointmentStartDate: createAppointmentDto.appointmentStartDate,
        appointmentEndDate: createAppointmentDto.appointmentEndDate,
        notificationDate: new Date(),
      };

      for (const item of createAppointmentDto.idClients) {
        notification.idClient = item;

        await this.notificationService.create(notification);
      }
    } catch (error) {
      throw error;
    }
  }

  async update(idAppointment: string, appointment: UpdateAppointmentDto): Promise<void> {
    try {
      const resClientOfAppointment = await this.appointmentRepository.getAllClientsAssociatedWithAppointment(
        idAppointment,
      );
      const clientOfAppointment: string[] = resClientOfAppointment.map((obj) => obj.id);

      if (this._diffBetweenCurrentClientsAndUpdatedObject(clientOfAppointment, appointment.idClients)) {
        await this.appointmentRepository.deleteAppointmentClientByIdAppointment(idAppointment);

        await this._createAppointmentClient(idAppointment, appointment.idClients);
      }

      await this.appointmentRepository.update(idAppointment, appointment);
    } catch (error) {
      throw error;
    }
  }

  private _diffBetweenCurrentClientsAndUpdatedObject(originalClients: string[], newClients: string[]): boolean {
    const diffArray1: string[] = originalClients.filter((item) => !newClients.includes(item));
    const diffArray2: string[] = newClients.filter((item) => !originalClients.includes(item));

    const diffCombined: string[] = [...diffArray1, ...diffArray2];

    return diffCombined.length > 0 ? true : false;
  }

  async getAll(idCompany: string): Promise<AppointmentWithClientResponseDto[]> {
    try {
      const rawResults = await this.appointmentRepository.getAll(idCompany);

      const appoimentsMap = new Map<string, AppointmentWithClientResponseDto>();

      for (const row of rawResults) {
        let appointment = appoimentsMap.get(row.id);

        if (!appointment) {
          appointment = {
            id: row.appointment_id,
            isActive: row.appointment_isActive,
            lastUpdate: row.appointment_lastUpdate,
            appointmentStartDate: row.appointment_startDate,
            appointmentEndDate: row.appointment_endDate,
            title: row.appointment_title,
            description: row.appointment_description,
            personalObservation: row.appointment_personalObservation,
            isDone: row.appointment_isDone,
            idClient: row.appointment_idClient,
            idCompany: row.appointment_idCompany,
            clients: [],
          };

          appoimentsMap.set(row.id, appointment);
        }

        if (!row.clientId) {
          const client: ClientDto = {
            id: row.client_id,
            isActive: row.client_isActive,
            name: row.client_name,
            email: row.client_email,
            birthday: row.client_birthday,
            gender: row.client_gender,
            idCompany: row.client_idCompany,
            phone: row.client_phone,
            photoUrl: row.client_photoUrl,
          };

          appointment.clients.push(client);
        }
      }

      return Array.from(appoimentsMap.values());
    } catch (error) {
      throw error;
    }
  }
}
