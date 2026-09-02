import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDateString,
    IsInt,
    IsOptional,
    IsUUID,
    Max,
    Min,
} from 'class-validator';

export class OfferWaitlistSlotRequest {
    @ApiProperty({
        example: '2026-09-04T02:00:00.000Z',
    })
    @IsDateString()
    startAt!: string;

    @ApiProperty({
        example: '2026-09-04T02:30:00.000Z',
    })
    @IsDateString()
    endAt!: string;

    @ApiPropertyOptional({
        example: '3af9cf7d-4e37-4cc1-9973-cdb51e8e9111',
    })
    @IsOptional()
    @IsUUID()
    resourceId?: string | null;

    @ApiPropertyOptional({
        example: 15,
        description: 'How many minutes the patient has to accept this offer.',
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(120)
    ttlMinutes?: number;
}