import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CancelWaitlistEntryRequest {
    @ApiPropertyOptional({
        example: 'Patient no longer wants to wait.',
    })
    @IsOptional()
    @IsString()
    reason?: string | null;
}