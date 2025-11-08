import { PartialType } from '@nestjs/mapped-types';
import { CreateClientEvaluationDto } from './create-client-evaluation.dto';

export class UpdateClientEvaluationDto extends PartialType(
  CreateClientEvaluationDto,
) {}
