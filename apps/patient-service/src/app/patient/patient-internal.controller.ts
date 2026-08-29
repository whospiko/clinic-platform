import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PatientStore } from './patient.store';

@Controller('internal/patients')
export class PatientInternalController {
  constructor(private readonly patientStore: PatientStore) {}

  @Get()
  findAll() {
    return this.patientStore.findAll();
  }

  @Get(':id')
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