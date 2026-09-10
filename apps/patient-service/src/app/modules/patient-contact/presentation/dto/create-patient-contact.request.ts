import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { PatientContactType } from '../../domain/patient-contact-type.enum';

export class CreatePatientContactRequest {
  @ApiProperty({ enum: PatientContactType, example: PatientContactType.PHONE })
  @IsEnum(PatientContactType)
  type!: PatientContactType;

  @ApiProperty({ example: '+85512345678' })
  @IsString()
  @MaxLength(180)
  value!: string;

  @ApiPropertyOptional({ example: 'Personal phone' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  label?: string | null;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
