import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Notification } from '../../../models/notification.model';

export class CreateWarningDto {
  @ApiProperty({
    description: 'The title of the notification',
    example: 'Holiday',
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

  @ApiHideProperty()
  idCompany: string;

  constructor(warning: Notification) {
    this.title = warning.title;
    this.notificationDate = warning.notificationDate;
    this.description = warning.description;
    this.idCompany = warning.idCompany;
  }
}
