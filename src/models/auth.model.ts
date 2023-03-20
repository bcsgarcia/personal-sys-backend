export class Auth {
  id: string;
  isActive: boolean;
  lastUpdate: Date;
  email: string;
  pass: string;
  idCompany: string;
  isAdmin: boolean;

  constructor(data: any) {
    this.id = data.id;
    this.isActive = data.isActive;
    this.lastUpdate = data.lastUpdate;
    this.email = data.email;
    this.pass = data.pass;
    this.idCompany = data.idCompany;
    this.isAdmin = data.isAdmin;
  }
}
