import {
    IsDateString,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { AppointmentStatus } from '../../domain/appointment-status.enum';
import { AppointmentSource } from '../../domain/appointment-source.enum';

export class ListAppointmentsRequest {
    @ApiPropertyOptional({
        example: 1,
        default: 1,
        minimum: 1,
        description: 'Page number for pagination',
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    page?: number = 1;

    @ApiPropertyOptional({
        example: 20,
        default: 20,
        minimum: 1,
        maximum: 100,
        description: 'Number of appointments per page',
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    @IsOptional()
    limit?: number = 20;

    @ApiPropertyOptional({
        example: 'patient_01HZY7QK8Z7Y9XQK9Z7Y9XQK9Z',
        description: 'Filter appointments by patient ID',
    })
    @IsString()
    @IsOptional()
    patientId?: string;

    @ApiPropertyOptional({
        example: 'doctor_01HZY7QK8Z7Y9XQK9Z7Y9XQK9Z',
        description: 'Filter appointments by doctor ID',
    })
    @IsString()
    @IsOptional()
    doctorId?: string;

    @ApiPropertyOptional({
        example: 'treatment_01HZY7QK8Z7Y9XQK9Z7Y9XQK9Z',
        description: 'Filter appointments by treatment ID',
    })
    @IsString()
    @IsOptional()
    treatmentId?: string;

    @ApiPropertyOptional({
        enum: AppointmentStatus,
        example: AppointmentStatus.Completed,
        description: 'Filter appointments by appointment status',
    })
    @IsEnum(AppointmentStatus)
    @IsOptional()
    status?: AppointmentStatus;

    @ApiPropertyOptional({
        enum: AppointmentSource,
        example: AppointmentSource.Reception,
        description: 'Filter appointments by appointment source',
    })
    @IsEnum(AppointmentSource)
    @IsOptional()
    source?: AppointmentSource;

    @ApiPropertyOptional({
        example: '2026-09-01T00:00:00.000Z',
        description: 'Filter appointments starting from this datetime in ISO 8601 format',
    })
    @IsDateString()
    @IsOptional()
    from?: string;

    @ApiPropertyOptional({
        example: '2026-09-30T23:59:59.000Z',
        description: 'Filter appointments up to this datetime in ISO 8601 format',
    })
    @IsDateString()
    @IsOptional()
    to?: string;

    @ApiPropertyOptional({
        example: 'APT-20260901-0001',
        description: 'Search keyword, for example appointment number, patient ID, doctor ID, or note',
    })
    @IsString()
    @IsOptional()
    s?: string;
}