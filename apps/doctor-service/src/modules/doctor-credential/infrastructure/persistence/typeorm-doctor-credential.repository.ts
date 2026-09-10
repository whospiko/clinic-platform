import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorCredentialRepository } from '../../application/ports/doctor-credential.repository';
import { DoctorCredentialAggregate } from '../../domain/doctor-credential.aggregate';
import { DoctorCredentialOrmEntity } from './doctor-credential.orm-entity';
const toDomain = (e: DoctorCredentialOrmEntity) =>
  DoctorCredentialAggregate.rehydrate({
    id: e.id,
    doctorId: e.doctorId,
    type: e.type,
    credentialNumber: e.credentialNumber,
    issuer: e.issuer,
    issuedAt: e.issuedAt ? new Date(`${e.issuedAt}T00:00:00.000Z`) : null,
    expiresAt: e.expiresAt ? new Date(`${e.expiresAt}T00:00:00.000Z`) : null,
    documentUrl: e.documentUrl,
    verificationStatus: e.verificationStatus,
    verifiedAt: e.verifiedAt,
    verificationNote: e.verificationNote,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  });
const toOrm = (x: DoctorCredentialAggregate) => {
  const s = x.snapshot;
  return Object.assign(new DoctorCredentialOrmEntity(), s, {
    issuedAt: s.issuedAt?.toISOString().slice(0, 10) ?? null,
    expiresAt: s.expiresAt?.toISOString().slice(0, 10) ?? null,
  });
};
@Injectable()
export class TypeOrmDoctorCredentialRepository
  implements DoctorCredentialRepository
{
  constructor(
    @InjectRepository(DoctorCredentialOrmEntity)
    private readonly repo: Repository<DoctorCredentialOrmEntity>,
  ) {}
  async save(v: DoctorCredentialAggregate) {
    await this.repo.save(toOrm(v));
  }
  async findById(id: string) {
    const e = await this.repo.findOne({ where: { id } });
    return e ? toDomain(e) : null;
  }
  async findByDoctor(doctorId: string) {
    return (
      await this.repo.find({
        where: { doctorId },
        order: { createdAt: 'DESC' },
      })
    ).map(toDomain);
  }
  async findDuplicate(doctorId: string, credentialNumber: string) {
    const e = await this.repo.findOne({
      where: { doctorId, credentialNumber },
    });
    return e ? toDomain(e) : null;
  }
  async delete(id: string) {
    await this.repo.delete(id);
  }
}
