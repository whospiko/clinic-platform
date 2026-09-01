import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
    IsEnum,
    IsOptional,
    IsString,
    IsUUID,
    MinLength,
} from 'class-validator';

import { DentalChairStatus } from '../../domain/dental-chair-status.enum';

export class CreateDentalChairRequest {
    @ApiPropertyOptional({
        example: '7b8e4cb4-f418-4e1f-9d20-c0d793707d2d',
        nullable: true,
    })
    @IsOptional()
    @IsUUID()
    clinicId?: string | null;

    @ApiProperty({
        example: 'CHAIR-001',
    })
    @IsString()
    @MinLength(2)
    code!: string;

    @ApiProperty({
        example: 'Dental Chair 1',
    })
    @IsString()
    @MinLength(2)
    name!: string;

    @ApiPropertyOptional({
        example: 'Main treatment room chair',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    description?: string | null;

    @ApiPropertyOptional({
        enum: DentalChairStatus,
        example: DentalChairStatus.ACTIVE,
    })
    @IsOptional()
    @IsEnum(DentalChairStatus)
    status?: DentalChairStatus;
}