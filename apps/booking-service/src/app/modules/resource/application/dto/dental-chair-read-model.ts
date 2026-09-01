import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { DentalChairStatus } from '../../domain/dental-chair-status.enum';

export class DentalChairReadModel {
    @ApiProperty()
    id!: string;

    @ApiPropertyOptional({
        nullable: true,
    })
    clinicId!: string | null;

    @ApiProperty()
    code!: string;

    @ApiProperty()
    name!: string;

    @ApiPropertyOptional({
        nullable: true,
    })
    description!: string | null;

    @ApiProperty({
        enum: DentalChairStatus,
    })
    status!: DentalChairStatus;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}