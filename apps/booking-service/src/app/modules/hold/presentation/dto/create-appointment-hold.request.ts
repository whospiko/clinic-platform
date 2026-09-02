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

export class CreateAppointmentHoldRequest {
    @ApiPropertyOptional({
        example: '9e87a94a-0c65-40f1-b2d8-7ed28a6d71a3',
    })
    @IsOptional()
    @IsUUID()
    clinicId?: string | null;

    @ApiProperty({
        example: '2f63cbf7-38d6-44f4-944e-bfb6f3a94411',
    })
    @IsUUID()
    doctorId!: string;

    @ApiPropertyOptional({
        example: 'c0c0ec01-6e8d-4b5c-8b36-b89ce30997ff',
    })
    @IsOptional()
    @IsUUID()
    patientId?: string | null;

    @ApiPropertyOptional({
        description: 'Dental chair/resource id. Nullable if the hold only blocks doctor time.',
        example: '68b784d7-0c86-42aa-a999-33e27f25d193',
    })
    @IsOptional()
    @IsUUID()
    resourceId?: string | null;

    @ApiProperty({
        example: '2026-09-02T09:00:00.000Z',
    })
    @IsDateString()
    startAt!: string;

    @ApiProperty({
        example: '2026-09-02T09:30:00.000Z',
    })
    @IsDateString()
    endAt!: string;

    @ApiPropertyOptional({
        description: 'How long this hold is valid. Default is 300 seconds.',
        example: 300,
        minimum: 30,
        maximum: 900,
    })
    @IsOptional()
    @IsInt()
    @Min(30)
    @Max(900)
    ttlSeconds?: number;

    @ApiPropertyOptional({
        example: 'Patient is choosing this time slot from public booking page.',
    })
    @IsOptional()
    @IsString()
    reason?: string | null;
}