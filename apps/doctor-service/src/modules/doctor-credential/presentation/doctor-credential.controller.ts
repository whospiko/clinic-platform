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
import { DoctorCredentialService } from '../application/doctor-credential.service';
import { CreateDoctorCredentialRequest } from './dto/create-doctor-credential.request';
import { VerifyDoctorCredentialRequest } from './dto/verify-doctor-credential.request';
@ApiTags('Doctor Credentials')
@Controller()
export class DoctorCredentialController {
  constructor(private readonly service: DoctorCredentialService) {}
  @Post('doctors/:doctorId/credentials') create(
    @Param('doctorId', ParseUUIDPipe) doctorId: string,
    @Body() body: CreateDoctorCredentialRequest,
  ) {
    return this.service.create(doctorId, body);
  }
  @Get('doctors/:doctorId/credentials') list(
    @Param('doctorId', ParseUUIDPipe) doctorId: string,
  ) {
    return this.service.list(doctorId);
  }
  @Patch('doctor-credentials/:id/verification') verify(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: VerifyDoctorCredentialRequest,
  ) {
    return this.service.verify(id, body);
  }
  @Delete('doctor-credentials/:id') @HttpCode(HttpStatus.NO_CONTENT) remove(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.service.remove(id);
  }
}
