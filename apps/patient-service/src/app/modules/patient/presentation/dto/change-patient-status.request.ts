import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { PatientStatus } from '../../domain/patient-status.enum';

export class ChangePatientStatusRequest {
  @ApiProperty({ enum: PatientStatus, example: PatientStatus.ACTIVE })
  @IsEnum(PatientStatus)
  status!: PatientStatus;
}
