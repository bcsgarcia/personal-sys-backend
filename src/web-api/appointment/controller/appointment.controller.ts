import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppointmentService } from '../service/appointment.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { validateHeaderApi } from 'src/web-api/utils/validate-header-api';
import { Request } from 'express';
import { AppointmentWithClientResponseDto, appointmentWithClientResponseDto } from '../dto/response/response-get-appointment.dto';




@ApiTags('appointment')
@ApiHeader({
  name: 'idCompany',
  description: 'The unique identifier of the company',
  example: '4e4d8d1e-7d4b-4ec7-a0f8-8c35647bb70c',
})
@Controller('web/appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) { }

  @Post()
  @ApiOperation({ summary: 'Create an appointment' })
  @ApiResponse({
    status: 201,
    description: 'The appointment has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateAppointmentDto })
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Req() request: Request
  ) {
    try {

      validateHeaderApi(request);
      createAppointmentDto.idCompany = request.headers['idcompany'] as string;

      return this.appointmentService.create(createAppointmentDto);

    } catch (error) {
      throw error;
    }
  }

  @Delete(':idAppointment')
  remove(
    @Param('idAppointment') idAppointment: string,
    @Req() request: Request
  ) {
    try {
      validateHeaderApi(request);
      return this.appointmentService.delete(idAppointment);
    } catch (error) {
      throw error;
    }
  }

  @Put(':idAppointment')
  update(
    @Param('idAppointment') idAppointment: string,
    @Body() updateAppointment: UpdateAppointmentDto,
    @Req() request: Request
  ) {

    try {
      validateHeaderApi(request);
      return this.appointmentService.update(idAppointment, updateAppointment);
    } catch (error) {
      throw error;
    }

  }

  @Get('all')
  @ApiOperation({ summary: 'Get all appointment of the company' })
  @ApiResponse({ status: 200, description: 'Bad Request.', type: AppointmentWithClientResponseDto })
  getAll(
    @Req() request: Request
  ) {
    try {
      validateHeaderApi(request);
      return this.appointmentService.getAll(request.headers['idcompany'] as string);
    } catch (error) {
      throw error;
    }
  }
}
