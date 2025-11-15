import { PartialType } from '@nestjs/mapped-types';
import { CreateProgressEntryDto } from './create-progress-entry.dto';

export class UpdateProgressEntryDto extends PartialType(CreateProgressEntryDto) {}
