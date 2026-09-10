import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DoctorClinicAssignmentService } from '../application/doctor-clinic-assignment.service';
import { CreateDoctorClinicAssignmentRequest } from './dto/create-doctor-clinic-assignment.request';
import { UpdateDoctorClinicAssignmentRequest } from './dto/update-doctor-clinic-assignment.request';
@ApiTags('Doctor Clinic Assignments')
@Controller()
export class DoctorClinicAssignmentController {
  constructor(private readonly service: DoctorClinicAssignmentService) {}
  @Post('doctors/:doctorId/clinic-assignments') create(
    @Param('doctorId', ParseUUIDPipe) doctorId: string,
    @Body() body: CreateDoctorClinicAssignmentRequest,
  ) {
    return this.service.create(doctorId, body);
  }
  @Get('doctors/:doctorId/clinic-assignments') listDoctor(
    @Param('doctorId', ParseUUIDPipe) doctorId: string,
  ) {
    return this.service.listDoctor(doctorId);
  }
  @Get('clinics/:clinicId/doctors') listClinic(
    @Param('clinicId', ParseUUIDPipe) clinicId: string,
  ) {
    return this.service.listClinic(clinicId);
  }
  @Patch('doctor-clinic-assignments/:id') update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateDoctorClinicAssignmentRequest,
  ) {
    return this.service.update(id, body);
  }
  @Delete('doctor-clinic-assignments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
