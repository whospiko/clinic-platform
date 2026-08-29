import { Module } from '@nestjs/common';
import { PatientClientService } from './patient-client.service';

@Module({
  providers: [PatientClientService],
  exports: [PatientClientService],
})
export class PatientClientModule {}