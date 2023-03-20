import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WorkoutsheetService } from './workoutsheet.service';
import { CreateWorkoutsheetDto } from './dto/create-workoutsheet.dto';
import { UpdateWorkoutsheetDto } from './dto/update-workoutsheet.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('workoutsheet')
@Controller('web/workoutsheet')
export class WorkoutsheetController {
  constructor(private readonly workoutsheetService: WorkoutsheetService) { }

  @Post()
  create(@Body() createWorkoutsheetDto: CreateWorkoutsheetDto) {
    return this.workoutsheetService.create(createWorkoutsheetDto);
  }

  @Get()
  findAll() {
    return this.workoutsheetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workoutsheetService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkoutsheetDto: UpdateWorkoutsheetDto,
  ) {
    return this.workoutsheetService.update(+id, updateWorkoutsheetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workoutsheetService.remove(+id);
  }
}
