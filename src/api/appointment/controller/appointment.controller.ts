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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppointmentService } from '../service/appointment.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { Request } from 'express';
import { AppointmentWithClientResponseDto } from '../dto/response/response-get-appointment.dto';
import { AccessTokenModel } from 'src/models/access-token-user.model';

@ApiTags('appointment')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an appointment' })
  @ApiResponse({
    status: 201,
    description: 'The appointment has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateAppointmentDto })
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Req() request: Request,
  ) {
    try {
      const user = new AccessTokenModel(request['user']);

      createAppointmentDto.idCompany = user.clientIdCompany;

      return this.appointmentService.create(createAppointmentDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':idAppointment')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an appointment' })
  remove(@Param('idAppointment') idAppointment: string) {
    try {
      return this.appointmentService.delete(idAppointment);
    } catch (error) {
      throw error;
    }
  }

  @Put(':idAppointment')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an appointment' })
  update(
    @Param('idAppointment') idAppointment: string,
    @Body() updateAppointment: UpdateAppointmentDto,
  ) {
    try {
      return this.appointmentService.update(idAppointment, updateAppointment);
    } catch (error) {
      throw error;
    }
  }

  @Get('all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an appointment' })
  @ApiOperation({ summary: 'Get all appointment of the company' })
  @ApiResponse({
    status: 200,
    description: 'Bad Request.',
    type: AppointmentWithClientResponseDto,
  })
  getAll(@Req() request: Request) {
    try {
      const user = new AccessTokenModel(request['user']);
      return this.appointmentService.getAll(user.clientIdCompany);
    } catch (error) {
      throw error;
    }
  }
}
