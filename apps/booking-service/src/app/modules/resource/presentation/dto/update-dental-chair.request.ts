import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateDentalChairRequest {
    @ApiPropertyOptional({
        example: 'CHAIR-001',
    })
    @IsOptional()
    @IsString()
    @MinLength(2)
    code?: string;

    @ApiPropertyOptional({
        example: 'Dental Chair 1',
    })
    @IsOptional()
    @IsString()
    @MinLength(2)
    name?: string;

    @ApiPropertyOptional({
        example: 'Updated description',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    description?: string | null;
}