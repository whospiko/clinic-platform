import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { PatientAddressType } from '../../domain/patient-address-type.enum';

export class CreatePatientAddressRequest {
  @ApiProperty({ enum: PatientAddressType, example: PatientAddressType.HOME })
  @IsEnum(PatientAddressType)
  type!: PatientAddressType;

  @ApiProperty({ example: 'Street 271, Toul Kork' })
  @IsString()
  @MaxLength(255)
  line1!: string;

  @ApiPropertyOptional({ example: 'Near clinic branch' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  line2?: string | null;

  @ApiPropertyOptional({ example: 'Boeng Kak 1' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  commune?: string | null;

  @ApiPropertyOptional({ example: 'Toul Kork' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  district?: string | null;

  @ApiPropertyOptional({ example: 'Phnom Penh' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  province?: string | null;

  @ApiPropertyOptional({ example: 'Cambodia' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  country?: string;

  @ApiPropertyOptional({ example: '12000' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  postalCode?: string | null;

  @ApiPropertyOptional({ example: 11.5564 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number | null;

  @ApiPropertyOptional({ example: 104.9282 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number | null;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
