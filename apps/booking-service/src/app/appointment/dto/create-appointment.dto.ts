import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  patientId!: string;

  @IsString()
  doctorId!: string;

  @IsOptional()
  @IsString()
  roomId?: string;

  @IsOptional()
  @IsString()
  chairId?: string;

  @IsDateString()
  startTime!: string;

  @IsDateString()
  endTime!: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  note?: string;
}