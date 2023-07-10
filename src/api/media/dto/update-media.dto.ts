import { PartialType } from '@nestjs/mapped-types';
import { MediaDto } from './create-media.dto';

export class UpdateMediaDto extends PartialType(MediaDto) {}
