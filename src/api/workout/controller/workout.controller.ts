import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Put,
  UseGuards,
} from '@nestjs/common';
import { WorkoutService } from '../service/workout.service';
import { CreateWorkoutDto } from '../dto/create-workout.dto';
import { UpdateWorkoutDto } from '../dto/update-workout.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { validateHeaderApi } from 'src/api/utils/utils';
import { Request } from 'express';
import { AccessTokenModel } from 'src/models/access-token-user.model';


@ApiTags('workout')
@Controller('workout')
export class WorkoutController {

  constructor(private readonly workoutService: WorkoutService) { }

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

      createWorkoutDto.idCompany = request.headers['idcompany'] as string;

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

  @Put(':idWorkout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing workout' })
  @ApiResponse({
    status: 200,
    description: 'The workout has been successfully updated.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid or missing data in the request.',
  })
  update(
    @Req() request: Request,
    @Param('idWorkout') idWorkout: string,
    @Body() updateWorkoutDto: UpdateWorkoutDto,
  ) {
    try {

      return this.workoutService.update(idWorkout, updateWorkoutDto);
    } catch (error) {
      throw error;
    }

  }

  @Get('all')
  @ApiBearerAuth()
  findAll(@Req() request: Request) {
    try {

      const idCompany = request.headers['idcompany'] as string;

      return this.workoutService.findAll(idCompany);

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

      return this.workoutService.remove(idWorkout);
    } catch (error) {
      throw error;
    }
  }
}
