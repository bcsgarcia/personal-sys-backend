import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkoutsheetDto } from './create-workoutsheet.dto';

export class UpdateWorkoutsheetDto extends PartialType(CreateWorkoutsheetDto) {}
