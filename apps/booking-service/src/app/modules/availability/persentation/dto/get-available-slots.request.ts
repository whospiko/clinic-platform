import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDateString,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetAvailableSlotsRequest {
    @ApiProperty({
        example: 'doctor_01HYXK7A8VQZKJ3Q7J9F6D1A2B',
    })
    @IsString()
    doctorId!: string;

    @ApiProperty({
        example: '2026-09-02',
        description: 'Clinic local date in YYYY-MM-DD format',
    })
    @IsDateString()
    date!: string;

    @ApiPropertyOptional({
        example: 30,
        default: 30,
    })
    @Type(() => Number)
    @IsInt()
    @Min(5)
    @Max(480)
    @IsOptional()
    durationMinutes?: number;

    @ApiPropertyOptional({
        example: 15,
        description:
            'Slot interval. Example: duration 30 with step 15 creates overlapping display slots.',
    })
    @Type(() => Number)
    @IsInt()
    @Min(5)
    @Max(480)
    @IsOptional()
    slotStepMinutes?: number;

    @ApiPropertyOptional({
        example: 'treatment_01HYXK7A8VQZKJ3Q7J9F6D1A2B',
    })
    @IsString()
    @IsOptional()
    treatmentId?: string;
}