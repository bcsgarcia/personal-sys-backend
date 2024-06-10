import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificationDto } from './create-notification.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @ApiProperty({
    description: 'The ID of the notification',
    example: 'dghjagdhk-djhgdhjadfgj',
    type: String,
  })
  id: string;

  constructor(warning: Notification, id: string) {
    super(warning);
    this.id = id;
  }
}
