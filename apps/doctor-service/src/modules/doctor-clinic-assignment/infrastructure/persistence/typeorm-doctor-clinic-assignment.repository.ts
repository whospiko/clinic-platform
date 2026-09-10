import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorClinicAssignmentRepository } from '../../application/ports/doctor-clinic-assignment.repository';
import { DoctorClinicAssignmentAggregate } from '../../domain/doctor-clinic-assignment.aggregate';
import { AssignmentStatus } from '../../domain/assignment-status.enum';
import { DoctorClinicAssignmentOrmEntity } from './doctor-clinic-assignment.orm-entity';
const toDomain = (e: DoctorClinicAssignmentOrmEntity) =>
  DoctorClinicAssignmentAggregate.rehydrate({
    id: e.id,
    doctorId: e.doctorId,
    clinicId: e.clinicId,
    title: e.title,
    employmentType: e.employmentType,
    isPrimary: e.isPrimary,
    startDate: new Date(`${e.startDate}T00:00:00.000Z`),
    endDate: e.endDate ? new Date(`${e.endDate}T00:00:00.000Z`) : null,
    status: e.status,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  });
const toOrm = (x: DoctorClinicAssignmentAggregate) => {
  const s = x.snapshot;
  return Object.assign(new DoctorClinicAssignmentOrmEntity(), s, {
    startDate: s.startDate.toISOString().slice(0, 10),
    endDate: s.endDate?.toISOString().slice(0, 10) ?? null,
  });
};
@Injectable()
export class TypeOrmDoctorClinicAssignmentRepository
  implements DoctorClinicAssignmentRepository
{
  constructor(
    @InjectRepository(DoctorClinicAssignmentOrmEntity)
    private readonly repo: Repository<DoctorClinicAssignmentOrmEntity>,
  ) {}
  async save(v: DoctorClinicAssignmentAggregate) {
    await this.repo.save(toOrm(v));
  }
  async findById(id: string) {
    const e = await this.repo.findOne({ where: { id } });
    return e ? toDomain(e) : null;
  }
  async findActivePair(doctorId: string, clinicId: string) {
    const e = await this.repo.findOne({
      where: { doctorId, clinicId, status: AssignmentStatus.ACTIVE },
    });
    return e ? toDomain(e) : null;
  }
  async findByDoctor(doctorId: string) {
    return (
      await this.repo.find({
        where: { doctorId },
        order: { isPrimary: 'DESC', startDate: 'DESC' },
      })
    ).map(toDomain);
  }
  async findByClinic(clinicId: string) {
    return (
      await this.repo.find({
        where: { clinicId, status: AssignmentStatus.ACTIVE },
        order: { createdAt: 'DESC' },
      })
    ).map(toDomain);
  }
  async clearPrimary(doctorId: string) {
    await this.repo.update({ doctorId }, { isPrimary: false });
  }
  async delete(id: string) {
    await this.repo.delete(id);
  }
}
