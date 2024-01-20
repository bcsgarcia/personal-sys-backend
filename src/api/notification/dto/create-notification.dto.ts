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

  @ApiHideProperty()
  notificationDate: Date;

  @ApiProperty({
    description: 'The date of the appointment',
    example: '2020-09-12 12:00',
    type: Date,
  })
  appointmentStartDate?: Date | null;

  @ApiProperty({
    description: 'The end date of the appointment',
    example: '2020-09-12 13:00',
    type: Date,
  })
  appointmentEndDate?: Date | null;

  @ApiHideProperty()
  idCompany: string;

  @ApiProperty({
    description: 'The unique identifier of the client associated with the notification',
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
    this.appointmentStartDate = notification.appointmentStartDate;
    this.appointmentEndDate = notification.appointmentEndDate;
    this.idCompany = notification.idCompany;
    this.idClient = notification.idClient;
  }
}
