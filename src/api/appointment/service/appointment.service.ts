import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { AppointmentRepository } from '../repository/appointment.repository';
import { CreateNotificationDto } from 'src/api/notification/dto/create-notification.dto';
import { NotificationService } from 'src/api/notification/service/notification.service';
import { AppointmentWithClientResponseDto } from '../dto/response/response-get-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    try {
      const idAppointment = await this.appointmentRepository.create(createAppointmentDto);

      if (createAppointmentDto.sendNotificationToClients && createAppointmentDto.clients.length > 0) {
        await this._createNotificationToClient(createAppointmentDto, idAppointment['id']);
      }

      for (const clientId of createAppointmentDto.clients) {
        await this.appointmentRepository.createAppointmentClient(idAppointment['id'], clientId);
      }

      return { status: 'success', message: 'Appointment created successfully!' };
    } catch (error) {
      throw error;
    }
  }

  async delete(idAppointment: string) {
    try {
      await this.appointmentRepository.delete(idAppointment);

      return { status: 'success', message: 'Appointment deleted successfully!' };
    } catch (error) {
      throw error;
    }
  }

  async update(idAppointment: string, appointment: UpdateAppointmentDto) {
    try {
      const resClientOfAppointment = await this.appointmentRepository.getAllClientsAssociatedWithAppointment(
        idAppointment,
      );
      const clientOfAppointment: string[] = resClientOfAppointment.map((obj) => obj.id);

      if (this._diffBetweenCurrentClientsAndUpdatedObject(clientOfAppointment, appointment.clients)) {
        await this.appointmentRepository.deleteAppointmentClientByIdAppointment(idAppointment);

        await this._createAppointmentClient(idAppointment, appointment.clients);
      }

      await this.appointmentRepository.update(idAppointment, appointment);

      return { status: 'success', message: 'Appointment updated successfully!' };
    } catch (error) {
      throw error;
    }
  }

  async getAll(idCompany: string): Promise<AppointmentWithClientResponseDto[]> {
    try {
      const rawResults = await this.appointmentRepository.getAll(idCompany);

      const appoimentsMap = new Map<string, any>();

      console.log(rawResults);

      for (const row of rawResults) {
        let appointment = appoimentsMap.get(row.id);

        if (!appointment) {
          appointment = {
            id: row.id,
            appointmentStartDate: row.appointmentStartDate,
            appointmentEndDate: row.appointmentEndDate,
            title: row.title,
            description: row.description,
            personalObservation: row.personalObservation,
            isDone: row.isDone === 1 ? true : false,
            clients: [],
            backgroundColor: row.backgroundColor,
            notificated: row.notificated,
          };

          appoimentsMap.set(row.id, appointment);
        }

        if (row.idClient != null && row.idClient !== '') {
          appointment.clients.push(row.idClient);
        }
      }

      return Array.from(appoimentsMap.values());
    } catch (error) {
      throw error;
    }
  }

  private async _createAppointmentClient(idAppointment: string, idClients: string[]): Promise<void> {
    for (const item of idClients) {
      await this.appointmentRepository.createAppointmentClient(idAppointment, item);
    }
  }

  private async _createNotificationToClient(
    createAppointmentDto: CreateAppointmentDto,
    idAppointment: string,
  ): Promise<void> {
    try {
      const notification: CreateNotificationDto = {
        description: createAppointmentDto.description,
        idCompany: createAppointmentDto.idCompany,
        title: createAppointmentDto.title,
        notificationDate: new Date(),
        idAppointment: idAppointment,
      };

      for (const item of createAppointmentDto.clients) {
        notification.idClient = item;

        await this.notificationService.create(notification);
      }
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
}
