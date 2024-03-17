export class GetNotificationDto {
  id: string;
  title: string;
  description: string;
  notificationDate: Date;
  readDate: Date;
  appointmentId: string;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.notificationDate = data.notificationDate;
    this.readDate = data.readDate;
    this.appointmentId = data.appointmentId;
  }
}
