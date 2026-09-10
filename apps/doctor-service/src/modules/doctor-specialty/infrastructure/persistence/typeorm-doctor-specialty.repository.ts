import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorSpecialtyRepository } from '../../application/ports/doctor-specialty.repository';
import { DoctorSpecialtyEntity } from '../../domain/doctor-specialty.entity';
import { DoctorSpecialtyOrmEntity } from './doctor-specialty.orm-entity';
const toDomain = (e: DoctorSpecialtyOrmEntity) =>
  DoctorSpecialtyEntity.rehydrate({
    id: e.id,
    doctorId: e.doctorId,
    specialtyId: e.specialtyId,
    isPrimary: e.isPrimary,
    certifiedAt: e.certifiedAt
      ? new Date(`${e.certifiedAt}T00:00:00.000Z`)
      : null,
    yearsExperience: e.yearsExperience,
    createdAt: e.createdAt,
  });
const toOrm = (x: DoctorSpecialtyEntity) => {
  const s = x.snapshot;
  return Object.assign(new DoctorSpecialtyOrmEntity(), s, {
    certifiedAt: s.certifiedAt?.toISOString().slice(0, 10) ?? null,
  });
};
@Injectable()
export class TypeOrmDoctorSpecialtyRepository
  implements DoctorSpecialtyRepository
{
  constructor(
    @InjectRepository(DoctorSpecialtyOrmEntity)
    private readonly repo: Repository<DoctorSpecialtyOrmEntity>,
  ) {}
  async save(v: DoctorSpecialtyEntity) {
    await this.repo.save(toOrm(v));
  }
  async findPair(doctorId: string, specialtyId: string) {
    const e = await this.repo.findOne({ where: { doctorId, specialtyId } });
    return e ? toDomain(e) : null;
  }
  async findByDoctor(doctorId: string) {
    return (
      await this.repo.find({
        where: { doctorId },
        order: { isPrimary: 'DESC', createdAt: 'ASC' },
      })
    ).map(toDomain);
  }
  async clearPrimary(doctorId: string) {
    await this.repo.update({ doctorId }, { isPrimary: false });
  }
  async delete(doctorId: string, specialtyId: string) {
    await this.repo.delete({ doctorId, specialtyId });
  }
}
