import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { EmploymentType } from '../../domain/employment-type.enum';
export class CreateDoctorClinicAssignmentRequest {
  @ApiProperty({ format: 'uuid' }) @IsUUID() clinicId!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string | null;
  @ApiProperty({ enum: EmploymentType })
  @IsEnum(EmploymentType)
  employmentType!: EmploymentType;
  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
  @ApiProperty({ example: '2026-09-10' }) @IsDateString() startDate!: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() endDate?: string | null;
}
