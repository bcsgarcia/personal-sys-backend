import { convertTimestampToDate } from 'src/api/utils/utils';

export class GetNotificationDto {
  id: string;
  title: string;
  description: string;
  notificationDate: Date;
  readDate: Date;
  appointmentStartDate: Date | null;
  appointmentEndDate: Date | null;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.notificationDate = data.notificationDate;
    this.readDate = data.readDate;
    this.appointmentStartDate = data.appointmentStartDate;
    this.appointmentEndDate = data.appointmentEndDate;
  }
}
