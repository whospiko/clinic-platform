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
import { DoctorSpecialtyService } from '../application/doctor-specialty.service';
import { AssignDoctorSpecialtyRequest } from './dto/assign-doctor-specialty.request';
@ApiTags('Doctor Specialties')
@Controller('doctors/:doctorId/specialties')
export class DoctorSpecialtyController {
  constructor(private readonly service: DoctorSpecialtyService) {}
  @Post() assign(
    @Param('doctorId', ParseUUIDPipe) doctorId: string,
    @Body() body: AssignDoctorSpecialtyRequest,
  ) {
    return this.service.assign(doctorId, body);
  }
  @Get() list(@Param('doctorId', ParseUUIDPipe) doctorId: string) {
    return this.service.list(doctorId);
  }
  @Patch(':specialtyId/primary') makePrimary(
    @Param('doctorId', ParseUUIDPipe) doctorId: string,
    @Param('specialtyId', ParseUUIDPipe) specialtyId: string,
  ) {
    return this.service.makePrimary(doctorId, specialtyId);
  }
  @Delete(':specialtyId') @HttpCode(HttpStatus.NO_CONTENT) remove(
    @Param('doctorId', ParseUUIDPipe) doctorId: string,
    @Param('specialtyId', ParseUUIDPipe) specialtyId: string,
  ) {
    return this.service.remove(doctorId, specialtyId);
  }
}
