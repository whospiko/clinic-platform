import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AcceptWaitlistOfferRequest {
    @ApiProperty({
        example: 'f8d8e0e0-1879-42ed-b276-9c4e92f3d111',
    })
    @IsUUID()
    patientId!: string;
}