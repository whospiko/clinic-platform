import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDateString,
    IsInt,
    IsOptional,
    IsString,
    IsUUID,
    Max,
    Min,
} from 'class-validator';

export class JoinWaitlistRequest {
    @ApiPropertyOptional({
        example: '9c07d15c-3e30-4c22-8c90-d2d6d709a111',
    })
    @IsOptional()
    @IsUUID()
    clinicId?: string | null;

    @ApiProperty({
        example: 'bda11b4c-7714-4e43-a7ef-e30e4ef3c111',
    })
    @IsUUID()
    doctorId!: string;

    @ApiProperty({
        example: 'f8d8e0e0-1879-42ed-b276-9c4e92f3d111',
    })
    @IsUUID()
    patientId!: string;

    @ApiPropertyOptional({
        example: '3af9cf7d-4e37-4cc1-9973-cdb51e8e9111',
    })
    @IsOptional()
    @IsUUID()
    resourceId?: string | null;

    @ApiProperty({
        example: '2026-09-03T01:00:00.000Z',
    })
    @IsDateString()
    preferredStartAt!: string;

    @ApiProperty({
        example: '2026-09-10T10:00:00.000Z',
    })
    @IsDateString()
    preferredEndAt!: string;

    @ApiProperty({
        example: 30,
    })
    @IsInt()
    @Min(5)
    @Max(480)
    requestedDurationMinutes!: number;

    @ApiPropertyOptional({
        example: 0,
        description: 'Higher value means higher priority.',
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    priority?: number;

    @ApiPropertyOptional({
        example: 'Patient wants the earliest available cleaning appointment.',
    })
    @IsOptional()
    @IsString()
    reason?: string | null;
}