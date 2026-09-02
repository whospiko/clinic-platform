import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ConfirmAppointmentHoldRequest {
    @ApiProperty({
        example: '5e87a8a1-d13e-4e58-b097-90ce15fae927',
    })
    @IsUUID()
    appointmentId!: string;
}