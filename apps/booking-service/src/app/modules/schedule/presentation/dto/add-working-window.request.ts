import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Matches, Max, Min } from 'class-validator';

export class AddWorkingWindowRequest {
    @ApiProperty({
        example: 1,
        minimum: 1,
        maximum: 7,
        description: 'Day of week for the working window. Usually 1 = Monday and 7 = Sunday.',
    })
    @IsInt()
    @Min(1)
    @Max(7)
    dayOfWeek!: number;

    @ApiProperty({
        example: '08:00',
        pattern: '^([01]\\d|2[0-3]):[0-5]\\d$',
        description: 'Working window start time in 24-hour HH:mm format',
    })
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    startTime!: string;

    @ApiProperty({
        example: '17:00',
        pattern: '^([01]\\d|2[0-3]):[0-5]\\d$',
        description: 'Working window end time in 24-hour HH:mm format',
    })
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    endTime!: string;

    @ApiProperty({
        example: 30,
        minimum: 1,
        description: 'Duration of each appointment slot in minutes',
    })
    @IsInt()
    @Min(1)
    slotDurationMinutes!: number;

    @ApiProperty({
        example: 1,
        minimum: 1,
        description: 'Maximum number of appointments allowed in the same slot',
    })
    @IsInt()
    @Min(1)
    capacity!: number;
}