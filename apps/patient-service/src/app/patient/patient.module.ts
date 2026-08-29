import { Module } from '@nestjs/common';
import { PatientInternalController } from './patient-internal.controller';
import { PatientStore } from './patient.store';

@Module({
  controllers: [PatientInternalController],
  providers: [PatientStore],
})
export class PatientModule {}