export class Notification {
  id: string;
  isActive: boolean;
  lastUpdate: Date;
  title: string;
  description: string;
  notificationDate: Date;
  appointmentStartDate: Date | null;
  appointmentEndDate: Date | null;
  idCompany: string;
  idClient: string | null;

  constructor(data: any) {
    this.id = data.id;
    this.isActive = data.isActive;
    this.lastUpdate = data.lastUpdate;
    this.title = data.title;
    this.description = data.description;
    this.notificationDate = data.notificationDate;
    this.appointmentStartDate = data.appointmentStartDate;
    this.appointmentEndDate = data.appointmentEndDate;
    this.idCompany = data.idCompany;
    this.idClient = data.idClient;
  }
}
