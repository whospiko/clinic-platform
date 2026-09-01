import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CancelAppointmentRequest {
    @ApiProperty({
        example: 'Patient requested to cancel the appointment.',
        description: 'Reason why the appointment is being cancelled',
    })
    @IsString()
    @IsNotEmpty()
    reason: string;
}