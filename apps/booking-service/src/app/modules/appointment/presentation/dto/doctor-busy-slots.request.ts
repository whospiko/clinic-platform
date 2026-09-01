import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class DoctorBusySlotsRequest {
    @ApiProperty({
        example: '2026-09-01T00:00:00.000Z',
        description: 'Start datetime range to search doctor busy slots in ISO 8601 format',
    })
    @IsDateString()
    from: string;

    @ApiProperty({
        example: '2026-09-01T23:59:59.000Z',
        description: 'End datetime range to search doctor busy slots in ISO 8601 format',
    })
    @IsDateString()
    to: string;
}