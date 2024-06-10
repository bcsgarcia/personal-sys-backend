export class GetNotificationDto {
  id: string;
  title: string;
  description: string;
  notificationDate: Date;
  readDate: Date;
  appointmentId: string;
  appointmentStartDate: Date | null;
  appointmentEndDate: Date | null;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.notificationDate = data.notificationDate;
    this.readDate = data.readDate;
    this.appointmentId = data.appointmentId;
    this.appointmentStartDate = data.appointmentStartDate;
    this.appointmentId = data.appointmentId != undefined ? data.appointmentId : null;
    this.appointmentEndDate = data.appointmentEndDate != undefined ? data.appointmentEndDate : null;
    this.appointmentStartDate = data.appointmentStartDate != undefined ? data.appointmentStartDate : null;
  }
}
