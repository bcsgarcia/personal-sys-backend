
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Notification } from '../../../models/notification.model';

export class CreateWarningDto {
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

    constructor(warning: Notification) {
        this.date = warning.date;
        this.description = warning.description;
        this.idCompany = warning.idCompany;
    }
}