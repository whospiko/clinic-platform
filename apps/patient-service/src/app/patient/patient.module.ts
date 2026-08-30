import { Module } from '@nestjs/common';
import { PatientInternalController } from './patient-internal.controller';
import { PatientStore } from './patient.store';
import { PatientRpcController } from './patient-rpc.controller';

@Module({
  controllers: [PatientInternalController, PatientRpcController],
  providers: [PatientStore],
})
export class PatientModule {}