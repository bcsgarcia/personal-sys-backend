export class WorkoutModel {
  id: string;
  isActive: boolean;
  lastUpdate: Date;
  title: string;
  subTitle: string;
  description: string;
  idCompany: string;
  mediaList: any;

  constructor(data: any) {
    this.id = data.id;
    this.isActive = data.isActive;
    this.lastUpdate = data.lastUpdate;
    this.title = data.title;
    this.subTitle = data.subTitle;
    this.description = data.description;
    this.idCompany = data.idCompany;
    this.mediaList = data.mediaList;
  }
}
