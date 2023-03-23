import { convertTimestampToDate } from "src/web-api/utils/utils";

export class GetNotificationDto {
    id: string;
    title: string;
    description: string;
    date: Date;
    readDate: Date;

    constructor(data: any) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.date = data.date;
        this.readDate = data.readDate;
    }

}