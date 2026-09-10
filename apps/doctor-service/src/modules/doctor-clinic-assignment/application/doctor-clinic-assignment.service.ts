import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DoctorRepository } from '../../doctor/application/ports/doctor.repository';
import { DoctorClinicAssignmentRepository } from './ports/doctor-clinic-assignment.repository';
import { DoctorClinicAssignmentAggregate } from '../domain/doctor-clinic-assignment.aggregate';
import { CreateDoctorClinicAssignmentRequest } from '../presentation/dto/create-doctor-clinic-assignment.request';
import { UpdateDoctorClinicAssignmentRequest } from '../presentation/dto/update-doctor-clinic-assignment.request';
@Injectable()
export class DoctorClinicAssignmentService {
  constructor(
    private readonly repository: DoctorClinicAssignmentRepository,
    private readonly doctors: DoctorRepository,
  ) {}
  async create(doctorId: string, req: CreateDoctorClinicAssignmentRequest) {
    if (!(await this.doctors.findById(doctorId)))
      throw new NotFoundException('Doctor not found');
    if (await this.repository.findActivePair(doctorId, req.clinicId))
      throw new ConflictException(
        'Doctor already has an active assignment in this clinic',
      );
    if (req.isPrimary) await this.repository.clearPrimary(doctorId);
    const v = DoctorClinicAssignmentAggregate.create({
      doctorId,
      clinicId: req.clinicId,
      title: req.title ?? null,
      employmentType: req.employmentType,
      isPrimary: req.isPrimary ?? false,
      startDate: new Date(req.startDate),
      endDate: req.endDate ? new Date(req.endDate) : null,
    });
    await this.repository.save(v);
    return this.map(v);
  }
  async listDoctor(doctorId: string) {
    return (await this.repository.findByDoctor(doctorId)).map((x) =>
      this.map(x),
    );
  }
  async listClinic(clinicId: string) {
    return (await this.repository.findByClinic(clinicId)).map((x) =>
      this.map(x),
    );
  }
  async update(id: string, req: UpdateDoctorClinicAssignmentRequest) {
    const v = await this.mustFind(id);
    if (req.isPrimary) await this.repository.clearPrimary(v.snapshot.doctorId);
    v.update({
      ...req,
      ...(req.startDate && { startDate: new Date(req.startDate) }),
      ...(req.endDate !== undefined && {
        endDate: req.endDate ? new Date(req.endDate) : null,
      }),
    } as any);
    await this.repository.save(v);
    return this.map(v);
  }
  async remove(id: string) {
    await this.mustFind(id);
    await this.repository.delete(id);
  }
  private async mustFind(id: string) {
    const v = await this.repository.findById(id);
    if (!v) throw new NotFoundException('Clinic assignment not found');
    return v;
  }
  private map(v: DoctorClinicAssignmentAggregate) {
    const s = v.snapshot;
    return {
      ...s,
      startDate: s.startDate.toISOString().slice(0, 10),
      endDate: s.endDate?.toISOString().slice(0, 10) ?? null,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    };
  }
}
