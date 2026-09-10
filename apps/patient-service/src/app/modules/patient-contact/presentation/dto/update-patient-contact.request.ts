import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { PatientContactType } from '../../domain/patient-contact-type.enum';

export class UpdatePatientContactRequest {
  @ApiPropertyOptional({ enum: PatientContactType })
  @IsOptional()
  @IsEnum(PatientContactType)
  type?: PatientContactType;

  @ApiPropertyOptional({ example: '+85512345678' })
  @IsOptional()
  @IsString()
  @MaxLength(180)
  value?: string;

  @ApiPropertyOptional({ example: 'Telegram' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  label?: string | null;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
