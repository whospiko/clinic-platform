import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

import { AppointmentSource } from '../../domain/appointment-source.enum';

export class CreateAppointmentRequest {
    @ApiProperty({
        example: 'patient_01HZY7QK8Z7Y9XQK9Z7Y9XQK9Z',
        description: 'Patient ID who owns this appointment',
    })
    @IsString()
    @IsNotEmpty()
    patientId: string;

    @ApiProperty({
        example: 'doctor_01HZY7QK8Z7Y9XQK9Z7Y9XQK9Z',
        description: 'Doctor ID assigned to this appointment',
    })
    @IsString()
    @IsNotEmpty()
    doctorId: string;

    @ApiPropertyOptional({
        example: 'treatment_01HZY7QK8Z7Y9XQK9Z7Y9XQK9Z',
        nullable: true,
        description: 'Treatment ID for this appointment',
    })
    @IsString()
    @IsOptional()
    treatmentId?: string | null;

    @ApiProperty({
        example: '2026-09-01T09:00:00.000Z',
        description: 'Appointment start datetime in ISO 8601 format',
    })
    @IsDateString()
    startAt: string;

    @ApiPropertyOptional({
        example: '2026-09-01T09:30:00.000Z',
        nullable: true,
        description: 'Appointment end datetime in ISO 8601 format',
    })
    @IsDateString()
    @IsOptional()
    endAt?: string | null;

    @ApiPropertyOptional({
        enum: AppointmentSource,
        example: AppointmentSource.Online,
        description: 'Source where the appointment was created from',
    })
    @IsEnum(AppointmentSource)
    @IsOptional()
    source?: AppointmentSource;

    @ApiPropertyOptional({
        example: 'Patient prefers morning appointment.',
        nullable: true,
        description: 'Optional appointment note',
    })
    @IsString()
    @IsOptional()
    note?: string | null;
}