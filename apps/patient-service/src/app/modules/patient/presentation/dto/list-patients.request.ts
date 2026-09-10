import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { Gender } from '../../domain/gender.enum';
import { PatientStatus } from '../../domain/patient-status.enum';
import { PageRequest } from '../../../../shared/presentation/page-request';

export class ListPatientsRequest extends PageRequest {
  @ApiPropertyOptional({ example: 'Dara' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  @ApiPropertyOptional({ example: 'PT-000001' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  @ApiPropertyOptional({ example: '+85512345678' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ example: 'dara@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ enum: PatientStatus })
  @IsOptional()
  @IsEnum(PatientStatus)
  status?: PatientStatus;
}
