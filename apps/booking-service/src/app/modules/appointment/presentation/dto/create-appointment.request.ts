import {
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

import { AppointmentSource } from '../../domain/appointment-source.enum';

export class CreateAppointmentRequest {
    @IsString()
    @IsNotEmpty()
    patientId: string;

    @IsString()
    @IsNotEmpty()
    doctorId: string;

    @IsString()
    @IsOptional()
    treatmentId?: string | null;

    @IsDateString()
    startAt: string;

    @IsDateString()
    @IsOptional()
    endAt?: string | null;

    @IsEnum(AppointmentSource)
    @IsOptional()
    source?: AppointmentSource;

    @IsString()
    @IsOptional()
    note?: string | null;
}