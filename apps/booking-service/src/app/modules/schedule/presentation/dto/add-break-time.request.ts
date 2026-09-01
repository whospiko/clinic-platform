import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsInt,
    IsOptional,
    IsString,
    Matches,
    Max,
    Min,
} from 'class-validator';

export class AddBreakTimeRequest {
    @ApiProperty({
        example: 1,
        minimum: 1,
        maximum: 7,
        description: 'Day of week for the break time. Usually 1 = Monday and 7 = Sunday.',
    })
    @IsInt()
    @Min(1)
    @Max(7)
    dayOfWeek!: number;

    @ApiProperty({
        example: '12:00',
        pattern: '^([01]\\d|2[0-3]):[0-5]\\d$',
        description: 'Break start time in 24-hour HH:mm format',
    })
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    startTime!: string;

    @ApiProperty({
        example: '13:00',
        pattern: '^([01]\\d|2[0-3]):[0-5]\\d$',
        description: 'Break end time in 24-hour HH:mm format',
    })
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    endTime!: string;

    @ApiPropertyOptional({
        example: 'Lunch break',
        nullable: true,
        description: 'Optional reason for this break time',
    })
    @IsOptional()
    @IsString()
    reason?: string | null;
}