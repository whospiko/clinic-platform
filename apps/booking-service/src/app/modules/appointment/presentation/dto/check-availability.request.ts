import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDateString,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class CheckAvailabilityRequest {
    @ApiProperty({
        example: 'doctor_01HZY7QK8Z7Y9XQK9Z7Y9XQK9Z',
        description: 'Doctor ID to check appointment availability for',
    })
    @IsString()
    @IsNotEmpty()
    doctorId: string;

    @ApiProperty({
        example: '2026-09-01T09:00:00.000Z',
        description: 'Requested appointment start datetime in ISO 8601 format',
    })
    @IsDateString()
    startAt: string;

    @ApiProperty({
        example: '2026-09-01T09:30:00.000Z',
        description: 'Requested appointment end datetime in ISO 8601 format',
    })
    @IsDateString()
    endAt: string;

    @ApiPropertyOptional({
        example: 'appointment_01HZY7QK8Z7Y9XQK9Z7Y9XQK9Z',
        description: 'Appointment ID to exclude when checking availability, useful for rescheduling',
    })
    @IsString()
    @IsOptional()
    excludeAppointmentId?: string;
}