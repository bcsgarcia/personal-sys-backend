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
  UseGuards,
} from '@nestjs/common';
import { WorkoutsheetService } from '../service/workoutsheet.service';
import { CreateWorkoutsheetDefaultDto } from '../dto/request/create.workoutsheet.default.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { validateHeaderApi } from 'src/api/utils/validate-header-api';
import { Request } from 'express';
import { UpdateWorkoutsheetDefaultDto } from '../dto/request/update.workoutsheet.default.dto';
import { GetAllWorkoutSheetDefaultDto } from '../dto/request/get.all.workoutsheet.default.dto';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenModel } from 'src/models/access-token-user.model';
import { WorkoutSheetResponseDto } from '../dto/response/workoutsheet-response.dto';

@ApiTags('workoutsheet')
@ApiHeader({
  name: 'idCompany',
  description: 'The unique identifier of the company',
  example: '4e4d8d1e-7d4b-4ec7-a0f8-8c35647bb70c',
})
@Controller('workoutsheet')
export class WorkoutsheetController {
  constructor(private readonly workoutsheetService: WorkoutsheetService) { }

  @Post('default')
  @ApiBearerAuth()
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
      const user = new AccessTokenModel(request['user']);
      createWorkoutsheetDto.idCompany = user.clientIdCompany


      return this.workoutsheetService.createWorkoutSheetDefault(
        createWorkoutsheetDto,
      );
    } catch (error) {
      throw error;
    }
  }

  @Put('default')
  @ApiBearerAuth()
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

      const user = new AccessTokenModel(request['user']);

      updateWorkoutsheetDto.idCompany = user.clientIdCompany;

      return this.workoutsheetService.updateWorkoutSheetDefaultWorkout(
        updateWorkoutsheetDto,
      );
    } catch (error) {
      throw error;
    }
  }

  @Get('default/all')
  @ApiBearerAuth()
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
      const user = new AccessTokenModel(request['user']);

      return this.workoutsheetService.getAllWorkoutSheetDefaultByIdCompany(
        user.clientIdCompany,
      );
    } catch (error) {
      throw error;
    }
  }

  @Delete('default/:id')
  @ApiBearerAuth()
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
  delete(@Param('id') id: string) {
    try {

      return this.workoutsheetService.deleteWorkoutSheetDefault(id);

    } catch (error) {
      throw error;
    }
  }

  @Get('all/medias-sync')
  @ApiBearerAuth()
  getAllUrlMediaForSync(@Req() request: Request) {
    try {
      const user = new AccessTokenModel(request['user']);

      return this.workoutsheetService.getUrlMidiaForSync(user);
    } catch (error) {
      throw error;
    }
  }

  @Post('done')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark as done a workoutsheet' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The default workout sheet has been successfully created.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  workoutsheetDone(
    @Body() body: any,
    @Req() request: Request,
  ): Promise<void> {
    try {
      const user = new AccessTokenModel(request['user']);

      const idWorkoutsheet = body['idworkoutsheet'];

      return this.workoutsheetService.workoutSheetDone(idWorkoutsheet, user);
    } catch (error) {
      throw error;
    }
  }


}
