import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { PatientNoteType } from '../../domain/patient-note-type.enum';
import { PatientNoteVisibility } from '../../domain/patient-note-visibility.enum';

export class CreatePatientNoteRequest {
  @ApiPropertyOptional({ example: 'b8d2f6ce-3ca4-45df-a621-a984e084b90e' })
  @IsOptional()
  @IsUUID()
  authorId?: string | null;

  @ApiPropertyOptional({
    enum: PatientNoteType,
    example: PatientNoteType.GENERAL,
  })
  @IsOptional()
  @IsEnum(PatientNoteType)
  type?: PatientNoteType;

  @ApiPropertyOptional({
    enum: PatientNoteVisibility,
    example: PatientNoteVisibility.INTERNAL,
  })
  @IsOptional()
  @IsEnum(PatientNoteVisibility)
  visibility?: PatientNoteVisibility;

  @ApiProperty({ example: 'Patient is afraid of dental injection.' })
  @IsString()
  @MaxLength(5000)
  content!: string;
}
