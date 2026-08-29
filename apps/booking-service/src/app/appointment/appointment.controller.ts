import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }

  @Post()
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentService.create(dto);
  }
}