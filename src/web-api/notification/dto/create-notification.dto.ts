import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Notification } from '../../../models/notification.model';

export class CreateNotificationDto {

    @ApiProperty({
        description: 'The description of the notification',
        example: 'Your order has been shipped',
        type: String,
    })
    description: string;

    @ApiHideProperty()
    date: Date;

    @ApiHideProperty()
    idCompany: string;

    @ApiProperty({
        description: 'The unique identifier of the client associated with the notification',
        example: '9a9c5f7d-2265-4f07-a3fa-bbc5a5d72c5b',
        type: String,
        required: false,
        nullable: true,
    })
    idClient?: string | null;


    constructor(notification: Notification) {
        this.date = notification.date;
        this.description = notification.description;
        this.idCompany = notification.idCompany;
        this.idClient = notification.idClient;
    }
}

