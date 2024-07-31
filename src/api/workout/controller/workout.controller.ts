import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { WorkoutService } from '../service/workout.service';
import { CreateWorkoutDto } from '../dto/create-workout.dto';
import { UpdateWorkoutDto } from '../dto/update-workout.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AccessTokenModel } from 'src/models/access-token-user.model';
import { CreateWorkoutClientDto } from '../dto/create-workout-client.dto';
import { UpdateWorkoutClientDto } from '../dto/update-workout-client.dto';

@ApiTags('workout')
@Controller('workout')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new workout' })
  @ApiResponse({
    status: 201,
    description: 'The workout has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid or missing data in the header/request.',
  })
  create(@Body() createWorkoutDto: CreateWorkoutDto, @Req() request: Request) {
    try {
      const user = new AccessTokenModel(request['user']);
      createWorkoutDto.idCompany = user.clientIdCompany;

      return this.workoutService.create(createWorkoutDto);
    } catch (error) {
      throw error;
    }
  }

  @Post('feedback')
  @ApiOperation({ summary: 'Create a new feedback' })
  @ApiResponse({
    status: 201,
    description: 'The feedback has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid or missing data in the header/request.',
  })
  createFeedback(@Body() body: any, @Req() request: Request) {
    try {
      const idWorkout = body['idworkout'];
      const feedback = body['feedback'];
      const user = new AccessTokenModel(request['user']);

      return this.workoutService.createFeedback(idWorkout, user.clientIdCompany, feedback);
    } catch (error) {
      throw error;
    }
  }

  @Put()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing workout' })
  @ApiResponse({
    status: 200,
    description: 'The workout has been successfully updated.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid or missing data in the request.',
  })
  update(@Req() request: Request, @Body() updateWorkoutDto: UpdateWorkoutDto) {
    try {
      const user = new AccessTokenModel(request['user']);

      updateWorkoutDto.idCompany = user.clientIdCompany;

      return this.workoutService.update(updateWorkoutDto);
    } catch (error) {
      throw error;
    }
  }

  @Get('all')
  @ApiBearerAuth()
  findAll(@Req() request: Request) {
    try {
      const user = new AccessTokenModel(request['user']);

      return this.workoutService.findAll(user.clientIdCompany);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':idWorkout')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Deactivate a workout by setting isActive to false',
  })
  @ApiResponse({
    status: 200,
    description: 'The workout has been successfully deactivated.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid or missing data in the request.',
  })
  remove(@Req() request: Request, @Param('idWorkout') idWorkout: string) {
    try {
      const user = new AccessTokenModel(request['user']);
      return this.workoutService.remove(idWorkout);
    } catch (error) {
      throw error;
    }
  }

  // ---------- WORKOUT CLIENT --------------
  @Post('/client')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new workoutClient' })
  @ApiResponse({
    status: 201,
    description: 'The workout has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid or missing data in the header/request.',
  })
  createWorkoutClient(@Body() createWorkoutClientDto: CreateWorkoutClientDto, @Req() request: Request) {
    try {
      const user = new AccessTokenModel(request['user']);
      createWorkoutClientDto.idCompany = user.clientIdCompany;

      return this.workoutService.createWorkoutClient(createWorkoutClientDto);
    } catch (error) {
      throw error;
    }
  }

  @Put('/client')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update existing workoutClient' })
  @ApiResponse({
    status: 200,
    description: 'The workout has been successfully updated.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid or missing data in the header/request.',
  })
  updateWorkoutClient(@Body() updateWorkoutClientDto: UpdateWorkoutClientDto, @Req() request: Request) {
    try {
      const user = new AccessTokenModel(request['user']);
      updateWorkoutClientDto.idCompany = user.clientIdCompany;

      return this.workoutService.updateWorkoutClient(updateWorkoutClientDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete('/client/:idWorkoutClient')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Deactivate a workout by setting isActive to false',
  })
  @ApiResponse({
    status: 200,
    description: 'The workout has been successfully deactivated.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid or missing data in the request.',
  })
  removeWorkoutClient(@Req() request: Request, @Param('idWorkoutClient') idWorkout: string) {
    try {
      const user = new AccessTokenModel(request['user']);
      return this.workoutService.removeWorkoutClient(idWorkout);
    } catch (error) {
      throw error;
    }
  }
}
