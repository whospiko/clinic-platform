import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateDoctorClinicAssignmentRequest } from './create-doctor-clinic-assignment.request';
import { AssignmentStatus } from '../../domain/assignment-status.enum';
export class UpdateDoctorClinicAssignmentRequest extends PartialType(
  OmitType(CreateDoctorClinicAssignmentRequest, ['clinicId'] as const),
) {
  @ApiPropertyOptional({ enum: AssignmentStatus })
  @IsOptional()
  @IsEnum(AssignmentStatus)
  status?: AssignmentStatus;
}
