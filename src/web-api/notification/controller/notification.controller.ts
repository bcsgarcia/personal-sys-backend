import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Put,
} from '@nestjs/common';
import { NotificationService } from '../service/notification.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { ApiBadRequestResponse, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { validateHeaderApi } from '../../utils/utils';
import { CreateWarningDto } from '../dto/create-warning.dto';
import { GetNotificationDto } from '../dto/get-notification.dto';


@ApiTags('notification')
@ApiHeader({
  name: 'idCompany',
  description: 'The unique identifier of the company',
  example: '4e4d8d1e-7d4b-4ec7-a0f8-8c35647bb70c',
})
// OBS: Maybe we dont need to split in web and app.
@Controller('web/notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }


  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({ status: 201, description: 'The notification has been successfully created.' })
  @ApiBadRequestResponse({ description: 'Bad request, invalid input or missing required fields.' })

  create(@Body() createNotificationDto: CreateNotificationDto, @Req() request: Request) {
    try {
      validateHeaderApi(request);

      createNotificationDto.idCompany = request.headers['idcompany'] as string;
      createNotificationDto.date = new Date;

      return this.notificationService.create(createNotificationDto);

    } catch (error) {
      throw error;
    }
  }

  @Post('/warning')
  @ApiOperation({
    summary: 'Create and broadcast a warning to all clients',
    description:
      'This endpoint creates a new warning and sends it to all connected clients. This can be used to inform clients about important updates, maintenance, or any critical information.',
  })
  @ApiResponse({ status: 201, description: 'The warning has been successfully created and broadcasted.' })
  @ApiBadRequestResponse({ description: 'Bad request, invalid input or missing required fields.' })
  createWarning(@Body() createWarningDto: CreateWarningDto, @Req() request: Request) {
    try {

      validateHeaderApi(request);

      const createNotification: CreateNotificationDto = {
        date: new Date,
        description: createWarningDto.description,
        idCompany: request.headers['idcompany'] as string,
      };

      return this.notificationService.create(createNotification);

    } catch (error) {
      throw error;
    }
  }

  @Get(':idClient')
  @ApiOperation({
    summary: 'Get all notifications',
    description: 'This endpoint retrieves an array of notifications to be displayed on the mobile app\'s notification screen.',
  })
  @ApiResponse({
    status: 200,
    description: 'An array of notifications successfully retrieved.',
    type: [GetNotificationDto],
  })
  @ApiBadRequestResponse({ description: 'Bad request, unable to retrieve notifications.' })
  findAllByIdClient(
    @Param('idClient') idClient: string,
    @Req() request: Request) {
    try {

      validateHeaderApi(request);

      const idCompany = request.headers['idcompany'] as string;

      return this.notificationService.findAllByIdClient(idClient, idCompany);

    } catch (error) {
      throw error;
    }
  }

  @Get('/warning')
  @ApiOperation({
    summary: 'Get all warnings grouped by date',
    description:
      'This endpoint retrieves an array of all warnings grouped by the date they were sent in descending order. This is intended to be used in the web app.',
  })
  @ApiResponse({
    status: 200,
    description: 'An array of warnings grouped by date successfully retrieved.',
    type: [GetNotificationDto],
  })
  @ApiBadRequestResponse({ description: 'Bad request, unable to retrieve warnings.' })
  findAllWarningByIdCompany(
    @Req() request: Request) {
    try {

      validateHeaderApi(request);

      const idCompany = request.headers['idcompany'] as string;

      return this.notificationService.findAllWarningByIdCompany(idCompany);

    } catch (error) {
      throw error;
    }
  }

  @Put('/:idClient/read')
  @ApiOperation({
    summary: 'Update readDate for all notifications related to a client',
    description:
      'This endpoint receives an idClient and updates the readDate for all notifications related to the specified client.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated readDate for all notifications related to the client.',
  })
  @ApiBadRequestResponse({ description: 'Bad request, unable to update readDate for notifications.' })
  update(
    @Param('idClient') idClient: string,
    @Req() request: Request,
  ) {

    try {
      validateHeaderApi(request);

      const idCompany = request.headers['idcompany'] as string;

      return this.notificationService.updateUnreadNotifications(idClient, idCompany);


    } catch (error) {
      throw error;
    }
  }

  @Delete('/:idNotification/deactivate')
  @ApiOperation({
    summary: 'Deactivate a notification by setting isActivate to false',
    description:
      'This endpoint receives an idNotification and updates the isActivate column to false, effectively deactivating the notification.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully deactivated the notification by setting isActivate to false.',
  })
  @ApiBadRequestResponse({ description: 'Bad request, unable to deactivate the notification.' })
  remove(@Param('idNotification') idNotification: string) {
    try {
      return this.notificationService.detele(idNotification);
    } catch (error) {
      throw error;

    }
  }
}
