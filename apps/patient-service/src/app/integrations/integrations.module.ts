import { Module } from '@nestjs/common';

import { PatientModule } from '../modules/patient/patient.module';
import { PatientIntegrationController } from './patient-integration.controller';

@Module({
  imports: [PatientModule],
  controllers: [PatientIntegrationController],
})
export class IntegrationsModule {}
