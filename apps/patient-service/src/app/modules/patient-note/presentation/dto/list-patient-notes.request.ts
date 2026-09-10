import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { PatientNoteType } from '../../domain/patient-note-type.enum';

export class ListPatientNotesRequest {
  @ApiPropertyOptional({ enum: PatientNoteType })
  @IsOptional()
  @IsEnum(PatientNoteType)
  type?: PatientNoteType;
}
