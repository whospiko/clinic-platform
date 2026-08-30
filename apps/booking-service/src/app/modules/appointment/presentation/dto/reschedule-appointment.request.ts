import {
    IsDateString,
    IsOptional,
    IsString,
} from 'class-validator';

export class RescheduleAppointmentRequest {
    @IsDateString()
    startAt: string;

    @IsDateString()
    @IsOptional()
    endAt?: string | null;

    @IsString()
    @IsOptional()
    treatmentId?: string | null;

    @IsString()
    @IsOptional()
    note?: string | null;
}