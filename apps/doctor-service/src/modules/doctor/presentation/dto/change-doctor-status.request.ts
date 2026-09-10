import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { DoctorStatus } from '../../domain/doctor-status.enum';

export class ChangeDoctorStatusRequest {
  @ApiProperty({ enum: DoctorStatus })
  @IsEnum(DoctorStatus)
  status!: DoctorStatus;
}
