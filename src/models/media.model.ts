export class MediaModel {
  id: string;
  isActive: boolean;
  lastUpdate: Date;
  title: string;
  url: string;
  fileFormat: string;
  type: string;
  thumbnailUrl: string;
  idCompany: string;

  constructor(data: any) {
    this.id = data.id;
    this.isActive = data.isActive;
    this.lastUpdate = data.lastUpdate;
    this.title = data.title;
    this.url = data.url;
    this.fileFormat = data.fileFormat;
    this.type = data.type;
    this.thumbnailUrl = data.thumbnailUrl;
    this.idCompany = data.idCompany;
  }
}
