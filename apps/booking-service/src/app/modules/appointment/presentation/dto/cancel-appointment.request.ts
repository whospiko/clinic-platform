import { IsNotEmpty, IsString } from 'class-validator';

export class CancelAppointmentRequest {
    @IsString()
    @IsNotEmpty()
    reason: string;
}