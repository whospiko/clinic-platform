import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDateString,
    IsEnum,
    IsOptional,
    IsString,
    IsUUID,
    Matches,
} from 'class-validator';

import { ScheduleOverrideType } from '../../domain/schedule-override-type.enum';

export class CreateScheduleOverrideRequest {
    @ApiPropertyOptional({
        example: '9d4e9ec2-7f5e-4c9c-8db7-2d6c8b8f2a11',
        nullable: true,
        description: 'Optional clinic ID. Use this when the override applies only to one clinic branch.',
    })
    @IsOptional()
    @IsUUID()
    clinicId?: string | null;

    @ApiProperty({
        example: '2026-09-02',
        description: 'Date for the schedule override in ISO 8601 date format',
    })
    @IsDateString()
    date!: string;

    @ApiProperty({
        enum: ScheduleOverrideType,
        example: ScheduleOverrideType.CLOSED_DAY,
        description: 'Type of schedule override, for example day off, custom working hours, or blocked time',
    })
    @IsEnum(ScheduleOverrideType)
    type!: ScheduleOverrideType;

    @ApiPropertyOptional({
        example: '09:00',
        pattern: '^([01]\\d|2[0-3]):[0-5]\\d$',
        nullable: true,
        description: 'Override start time in 24-hour HH:mm format. Required for partial-day override types.',
    })
    @IsOptional()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    startTime?: string | null;

    @ApiPropertyOptional({
        example: '12:00',
        pattern: '^([01]\\d|2[0-3]):[0-5]\\d$',
        nullable: true,
        description: 'Override end time in 24-hour HH:mm format. Required for partial-day override types.',
    })
    @IsOptional()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    endTime?: string | null;

    @ApiPropertyOptional({
        example: 'Doctor attending training.',
        nullable: true,
        description: 'Optional reason for this schedule override',
    })
    @IsOptional()
    @IsString()
    reason?: string | null;
}