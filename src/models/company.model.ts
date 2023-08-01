export class Company {
  id: string;
  isActive: boolean;
  lastUpdate: Date;
  name: string;
  about: string;
  photoMediaId: string | null;
  firstVideoMediaId: string | null;
  secondVideoMediaId: string | null;
  whatsapp: string | null;
  instagram: string | null;

  constructor(data: any) {
    this.id = data.id ?? '';
    this.isActive = data.isActive;
    this.lastUpdate = data.lastUpdate;
    this.name = data.name;
    this.about = data.about;
    this.photoMediaId = data.photoMediaId;
    this.firstVideoMediaId = data.firstVideoMediaId;
    this.secondVideoMediaId = data.secondVideoMediaId;
    this.whatsapp = data.whatsapp;
    this.instagram = data.instagram;
  }
}
