import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDateString,
    IsOptional,
    IsString,
} from 'class-validator';

export class RescheduleAppointmentRequest {
    @ApiProperty({
        example: '2026-09-01T09:00:00.000Z',
        description: 'New appointment start datetime in ISO 8601 format',
    })
    @IsDateString()
    startAt: string;

    @ApiPropertyOptional({
        example: '2026-09-01T09:30:00.000Z',
        nullable: true,
        description: 'New appointment end datetime in ISO 8601 format',
    })
    @IsDateString()
    @IsOptional()
    endAt?: string | null;

    @ApiPropertyOptional({
        example: 'treatment_01HZY7QK8Z7Y9XQK9Z7Y9XQK9Z',
        nullable: true,
        description: 'New treatment ID for this appointment',
    })
    @IsString()
    @IsOptional()
    treatmentId?: string | null;

    @ApiPropertyOptional({
        example: 'Patient requested to move appointment to morning.',
        nullable: true,
        description: 'Optional note for rescheduling this appointment',
    })
    @IsString()
    @IsOptional()
    note?: string | null;
}