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
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DoctorService } from '../application/doctor.service';
import { CreateDoctorRequest } from './dto/create-doctor.request';
import { UpdateDoctorRequest } from './dto/update-doctor.request';
import { ListDoctorsRequest } from './dto/list-doctors.request';
import { ChangeDoctorStatusRequest } from './dto/change-doctor-status.request';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorController {
  constructor(private readonly service: DoctorService) {}

  @Post()
  @ApiOperation({ summary: 'Create doctor profile' })
  create(@Body() body: CreateDoctorRequest) {
    return this.service.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List and search doctors' })
  list(@Query() query: ListDoctorsRequest) {
    return this.service.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get doctor by id' })
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.get(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update doctor profile' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateDoctorRequest,
  ) {
    return this.service.update(id, body);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Activate, deactivate or put doctor on leave' })
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: ChangeDoctorStatusRequest,
  ) {
    return this.service.changeStatus(id, body.status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete doctor profile' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
