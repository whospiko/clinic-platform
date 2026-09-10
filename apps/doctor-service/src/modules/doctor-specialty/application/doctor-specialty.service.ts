import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DoctorRepository } from '../../doctor/application/ports/doctor.repository';
import { SpecialtyRepository } from '../../specialty/application/ports/specialty.repository';
import { DoctorSpecialtyRepository } from './ports/doctor-specialty.repository';
import { DoctorSpecialtyEntity } from '../domain/doctor-specialty.entity';
import { AssignDoctorSpecialtyRequest } from '../presentation/dto/assign-doctor-specialty.request';

@Injectable()
export class DoctorSpecialtyService {
  constructor(
    private readonly repository: DoctorSpecialtyRepository,
    private readonly doctors: DoctorRepository,
    private readonly specialties: SpecialtyRepository,
  ) {}
  async assign(doctorId: string, req: AssignDoctorSpecialtyRequest) {
    if (!(await this.doctors.findById(doctorId)))
      throw new NotFoundException('Doctor not found');
    if (!(await this.specialties.findById(req.specialtyId)))
      throw new NotFoundException('Specialty not found');
    if (await this.repository.findPair(doctorId, req.specialtyId))
      throw new ConflictException('Specialty already assigned');
    if (req.isPrimary) await this.repository.clearPrimary(doctorId);
    const item = DoctorSpecialtyEntity.create({
      doctorId,
      specialtyId: req.specialtyId,
      isPrimary: req.isPrimary ?? false,
      certifiedAt: req.certifiedAt ? new Date(req.certifiedAt) : null,
      yearsExperience: req.yearsExperience ?? null,
    });
    await this.repository.save(item);
    return this.map(item);
  }
  async list(doctorId: string) {
    return (await this.repository.findByDoctor(doctorId)).map((x) =>
      this.map(x),
    );
  }
  async makePrimary(doctorId: string, specialtyId: string) {
    const item = await this.repository.findPair(doctorId, specialtyId);
    if (!item) throw new NotFoundException('Doctor specialty not found');
    await this.repository.clearPrimary(doctorId);
    item.setPrimary(true);
    await this.repository.save(item);
    return this.map(item);
  }
  async remove(doctorId: string, specialtyId: string) {
    const x = await this.repository.findPair(doctorId, specialtyId);
    if (!x) throw new NotFoundException('Doctor specialty not found');
    await this.repository.delete(doctorId, specialtyId);
  }
  private map(x: DoctorSpecialtyEntity) {
    const s = x.snapshot;
    return {
      ...s,
      certifiedAt: s.certifiedAt?.toISOString().slice(0, 10) ?? null,
      createdAt: s.createdAt.toISOString(),
    };
  }
}
