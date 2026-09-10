import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

import { PatientNoteType } from '../../domain/patient-note-type.enum';
import { PatientNoteVisibility } from '../../domain/patient-note-visibility.enum';

export class UpdatePatientNoteRequest {
  @ApiPropertyOptional({ enum: PatientNoteType })
  @IsOptional()
  @IsEnum(PatientNoteType)
  type?: PatientNoteType;

  @ApiPropertyOptional({ enum: PatientNoteVisibility })
  @IsOptional()
  @IsEnum(PatientNoteVisibility)
  visibility?: PatientNoteVisibility;

  @ApiPropertyOptional({ example: 'Updated patient note.' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  content?: string;
}
