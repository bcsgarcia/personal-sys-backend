export class Notification {
    id: string;
    isActive: boolean;
    lastUpdate: Date;
    description: string;
    date: Date;
    idCompany: string;
    idClient: string | null;

    constructor(data: any) {
        this.id = data.id;
        this.isActive = data.isActive;
        this.lastUpdate = data.lastUpdate;
        this.description = data.description;
        this.date = data.date;
        this.idCompany = data.idCompany;
        this.idClient = data.idClient;
    }

}