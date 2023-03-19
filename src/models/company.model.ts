export class Company {
  id: string;
  isActive: boolean;
  lastUpdate: Date;
  name: string;
  about: string;
  photo: string | null;
  video: string | null;
  whatsapp: string | null;
  instagram: string | null;

  constructor(data: any) {
    this.id = data.id;
    this.isActive = data.isActive;
    this.lastUpdate = data.lastUpdate;
    this.name = data.name;
    this.about = data.about;
    this.photo = data.photo;
    this.video = data.video;
    this.whatsapp = data.whatsapp;
    this.instagram = data.instagram;
  }
}
