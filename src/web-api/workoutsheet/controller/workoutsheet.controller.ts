import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { WorkoutsheetService } from '../service/workoutsheet.service';
import { CreateWorkoutsheetDefaultDto } from '../dto/create.workoutsheet.default.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { validateHeaderApi } from 'src/web-api/utils/validate-header-api';
import { Request } from 'express';
import { UpdateWorkoutsheetDefaultDto } from '../dto/update.workoutsheet.default.dto';
import { GetAllWorkoutSheetDefaultDto } from '../dto/get.all.workoutsheet.default.dto';

@ApiTags('workoutsheet')
@ApiHeader({
  name: 'idCompany',
  description: 'The unique identifier of the company',
  example: '4e4d8d1e-7d4b-4ec7-a0f8-8c35647bb70c',
})
@Controller('web/workoutsheet')
export class WorkoutsheetController {
  constructor(private readonly workoutsheetService: WorkoutsheetService) {}

  @Post('default')
  @ApiOperation({ summary: 'Create a default workout sheet' })
  @ApiBody({ type: CreateWorkoutsheetDefaultDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The default workout sheet has been successfully created.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A duplicate key was found in the database.',
  })
  createWorkoutSheetDefault(
    @Body() createWorkoutsheetDto: CreateWorkoutsheetDefaultDto,
    @Req() request: Request,
  ): Promise<void> {
    try {
      validateHeaderApi(request);
      createWorkoutsheetDto.idCompany = request.headers['idcompany'] as string;

      return this.workoutsheetService.createWorkoutSheetDefault(
        createWorkoutsheetDto,
      );
    } catch (error) {
      throw error;
    }
  }

  @Put('default')
  @ApiOperation({ summary: 'Update the worksheetDefault with new workouts' })
  @ApiBody({ type: UpdateWorkoutsheetDefaultDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The default workout sheet has been successfully updated.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  updateWorkoutSheetDefault(
    @Body() updateWorkoutsheetDto: UpdateWorkoutsheetDefaultDto,
    @Req() request: Request,
  ) {
    try {
      validateHeaderApi(request);

      return this.workoutsheetService.updateWorkoutSheetDefaultWorkout(
        updateWorkoutsheetDto,
      );
    } catch (error) {
      throw error;
    }
  }

  @Get('default/all')
  @ApiOperation({
    summary: 'Get all workoutsheet default by idCompany',
    description:
      'This endpoint retrieves an array of workoutsheetDefault to be displayed web platform workoutSheetDefault screen.',
  })
  @ApiResponse({
    status: 200,
    description: 'An array of workoutSheetDefault successfully retrieved.',
    type: GetAllWorkoutSheetDefaultDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request, unable to retrieve workoutSheetDefault.',
  })
  findAllWorkoutSheetDefaultByIdCompany(@Req() request: Request) {
    try {
      validateHeaderApi(request);

      const idCompany = request.headers['idcompany'] as string;

      return this.workoutsheetService.getAllWorkoutSheetDefaultByIdCompany(
        idCompany,
      );
    } catch (error) {
      throw error;
    }
  }

  @Delete('default/:id')
  @ApiOperation({
    summary: 'Deactivate a workoutsheetdefault by setting isActivate to false',
    description:
      'This endpoint receives an workoutSheetDefault id and updates the isActivate column to false, effectively deactivating the workoutsheetdefault.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Successfully deactivated the workoutsheetdefault by setting isActivate to false.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request, unable to deactivate the workout sheet default.',
  })
  delete(@Param('id') id: string, @Req() request: Request) {
    try {
      validateHeaderApi(request);

      return this.workoutsheetService.deleteWorkoutSheetDefault(id);

    } catch (error) {
      throw error;
    }
  }
}
