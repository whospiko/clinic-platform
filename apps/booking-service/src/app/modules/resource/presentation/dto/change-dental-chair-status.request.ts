import { ApiProperty } from '@nestjs/swagger';

import { IsEnum } from 'class-validator';

import { DentalChairStatus } from '../../domain/dental-chair-status.enum';

export class ChangeDentalChairStatusRequest {
    @ApiProperty({
        enum: DentalChairStatus,
        example: DentalChairStatus.MAINTENANCE,
    })
    @IsEnum(DentalChairStatus)
    status!: DentalChairStatus;
}