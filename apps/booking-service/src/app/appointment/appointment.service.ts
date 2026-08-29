import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PatientClientService } from '../patient-client/patient-client.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

type Appointment = {
  id: string;
  patientId: string;
  patientSnapshot: {
    id: string;
    code: string;
    fullName: string;
    phone: string | null;
    email: string | null;
  };
  doctorId: string;
  roomId?: string;
  chairId?: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  reason?: string;
  note?: string;
  createdAt: string;
};

@Injectable()
export class AppointmentService {
  private readonly appointments: Appointment[] = [];

  constructor(private readonly patientClient: PatientClientService) {}

  findAll() {
    return this.appointments;
  }

  async create(dto: CreateAppointmentDto) {
    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);

    if (endTime <= startTime) {
      throw new BadRequestException('endTime must be after startTime');
    }

    const patient = await this.patientClient.getPatientForBooking(dto.patientId);

    const appointment: Appointment = {
      id: randomUUID(),
      patientId: patient.id,
      patientSnapshot: {
        id: patient.id,
        code: patient.code,
        fullName: patient.fullName,
        phone: patient.phone,
        email: patient.email,
      },
      doctorId: dto.doctorId,
      roomId: dto.roomId,
      chairId: dto.chairId,
      startTime: dto.startTime,
      endTime: dto.endTime,
      status: 'PENDING',
      reason: dto.reason,
      note: dto.note,
      createdAt: new Date().toISOString(),
    };

    this.appointments.push(appointment);

    return appointment;
  }
}