import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PatientStore } from './patient.store';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('internal-patients')
@Controller('internal/patients')
export class PatientInternalController {
  constructor(private readonly patientStore: PatientStore) {}

  @Get()
  @ApiOperation({ summary: 'Get all patients' })

  findAll() {
    return this.patientStore.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get patient information for booking service' })
  @ApiParam({
    name: 'id',
    example: 'patient-001',
  })
  findForBooking(@Param('id') id: string) {
    const patient = this.patientStore.findById(id);

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return {
      id: patient.id,
      code: patient.code,
      fullName: `${patient.firstName} ${patient.lastName}`,
      phone: patient.phone,
      email: patient.email,
    };
  }
}