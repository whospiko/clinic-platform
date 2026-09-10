import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateDoctorRequest } from './create-doctor.request';

export class UpdateDoctorRequest extends PartialType(
  OmitType(CreateDoctorRequest, ['employeeCode'] as const),
) {}
