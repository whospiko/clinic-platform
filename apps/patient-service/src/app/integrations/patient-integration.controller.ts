import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PatientSummaryReadModel } from '../modules/patient/application/dto/patient-read-model';
import { PatientReaderPort } from '../modules/patient/application/ports/patient-reader.port';
import { PATIENT_READER } from '../modules/patient/patient.tokens';
import { BatchPatientSummaryRequest } from './dto/batch-patient-summary.request';

@ApiTags('Internal Patient Integration')
@Controller('internal/patients')
export class PatientIntegrationController {
  constructor(
    @Inject(PATIENT_READER) private readonly patients: PatientReaderPort,
  ) {}

  @Get(':id/summary')
  @ApiOperation({ summary: 'Get patient summary for service-to-service use' })
  @ApiOkResponse({ description: 'Patient summary' })
  async getSummary(@Param('id') id: string): Promise<PatientSummaryReadModel> {
    const patient = await this.patients.findSummaryById(id);
    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }

  @Post('summaries/batch')
  @ApiOperation({
    summary: 'Get many patient summaries for service-to-service use',
  })
  @ApiOkResponse({ description: 'Patient summaries' })
  getSummaries(
    @Body() body: BatchPatientSummaryRequest,
  ): Promise<PatientSummaryReadModel[]> {
    return this.patients.findSummariesByIds([...new Set(body.ids)]);
  }
}
