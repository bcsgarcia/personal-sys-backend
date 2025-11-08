import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Notification } from '../../../models/notification.model';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'The title of the notification',
    example: 'Schedulle',
    type: String,
  })
  title: string;

  @ApiProperty({
    description: 'The description of the notification',
    example: 'Your order has been shipped',
    type: String,
  })
  description: string;

  @ApiProperty({
    description: 'ID do Appointment',
    example: '9a9c5f7d-2265-4f07-a3fa-bbc5a5d72c5b',
    type: String,
  })
  idAppointment: string;

  @ApiProperty({
    description: 'The date of the notification',
    example: '03/02/2024',
    type: String,
  })
  notificationDate: Date;

  @ApiHideProperty()
  idCompany: string;

  @ApiProperty({
    description:
      'The unique identifier of the client associated with the notification',
    example: '9a9c5f7d-2265-4f07-a3fa-bbc5a5d72c5b',
    type: String,
    required: false,
    nullable: true,
  })
  idClient?: string | null;

  constructor(notification: Notification) {
    this.title = notification.title;
    this.description = notification.description;
    this.notificationDate = notification.notificationDate;
    // this.appointmentStartDate = notification.appointmentStartDate;
    // this.appointmentEndDate = notification.appointmentEndDate;
    this.idCompany = notification.idCompany;
    this.idClient = notification.idClient;
  }
}
