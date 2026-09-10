import { Injectable, NotFoundException } from '@nestjs/common';
import { DoctorRepository } from '../modules/doctor/application/ports/doctor.repository';
import { DoctorSpecialtyRepository } from '../modules/doctor-specialty/application/ports/doctor-specialty.repository';
import { DoctorClinicAssignmentRepository } from '../modules/doctor-clinic-assignment/application/ports/doctor-clinic-assignment.repository';
import { AssignmentStatus } from '../modules/doctor-clinic-assignment/domain/assignment-status.enum';
import { DoctorStatus } from '../modules/doctor/domain/doctor-status.enum';
import { DoctorBookingProfileDto } from './dto/doctor-booking-profile.dto';
@Injectable()
export class DoctorIntegrationService {
  constructor(
    private readonly doctors: DoctorRepository,
    private readonly specialties: DoctorSpecialtyRepository,
    private readonly assignments: DoctorClinicAssignmentRepository,
  ) {}
  async bookingProfile(doctorId: string): Promise<DoctorBookingProfileDto> {
    const doctor = await this.doctors.findById(doctorId);
    if (!doctor) throw new NotFoundException('Doctor not found');
    const [specs, assigns] = await Promise.all([
      this.specialties.findByDoctor(doctorId),
      this.assignments.findByDoctor(doctorId),
    ]);
    return {
      doctorId,
      displayName: doctor.snapshot.displayName,
      status: doctor.snapshot.status,
      activeClinicIds: assigns
        .filter((x) => x.snapshot.status === AssignmentStatus.ACTIVE)
        .map((x) => x.snapshot.clinicId),
      specialtyIds: specs.map((x) => x.snapshot.specialtyId),
      primarySpecialtyId:
        specs.find((x) => x.snapshot.isPrimary)?.snapshot.specialtyId ?? null,
    };
  }
  async canBook(doctorId: string, clinicId?: string) {
    const doctor = await this.doctors.findById(doctorId);
    if (!doctor)
      return { exists: false, active: false, assignedToClinic: false };
    const active = doctor.snapshot.status === DoctorStatus.ACTIVE;
    if (!clinicId) return { exists: true, active, assignedToClinic: true };
    const assignment = await this.assignments.findActivePair(
      doctorId,
      clinicId,
    );
    return { exists: true, active, assignedToClinic: !!assignment };
  }
}
