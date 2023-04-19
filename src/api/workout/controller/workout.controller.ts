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


@ApiTags('workout')
@ApiHeader({
  name: 'idCompany',
  description: 'The unique identifier of the company',
  example: '4e4d8d1e-7d4b-4ec7-a0f8-8c35647bb70c',
})
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
      validateHeaderApi(request);

      createWorkoutDto.idCompany = request.headers['idcompany'] as string;

      return this.workoutService.create(createWorkoutDto);
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
      validateHeaderApi(request);

      return this.workoutService.update(idWorkout, updateWorkoutDto);
    } catch (error) {
      throw error;
    }

  }

  @Get('all')
  @ApiBearerAuth()

  findAll(@Req() request: Request) {
    try {

      validateHeaderApi(request);

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

      validateHeaderApi(request);

      return this.workoutService.remove(idWorkout);
    } catch (error) {
      throw error;
    }
  }
}
