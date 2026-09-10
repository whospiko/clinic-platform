import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DoctorRepository } from '../../doctor/application/ports/doctor.repository';
import { DoctorCredentialRepository } from './ports/doctor-credential.repository';
import { DoctorCredentialAggregate } from '../domain/doctor-credential.aggregate';
import { CreateDoctorCredentialRequest } from '../presentation/dto/create-doctor-credential.request';
import { VerifyDoctorCredentialRequest } from '../presentation/dto/verify-doctor-credential.request';
@Injectable()
export class DoctorCredentialService {
  constructor(
    private readonly repository: DoctorCredentialRepository,
    private readonly doctors: DoctorRepository,
  ) {}
  async create(doctorId: string, req: CreateDoctorCredentialRequest) {
    if (!(await this.doctors.findById(doctorId)))
      throw new NotFoundException('Doctor not found');
    if (await this.repository.findDuplicate(doctorId, req.credentialNumber))
      throw new ConflictException(
        'Credential number already exists for doctor',
      );
    const v = DoctorCredentialAggregate.create({
      doctorId,
      type: req.type,
      credentialNumber: req.credentialNumber,
      issuer: req.issuer,
      issuedAt: req.issuedAt ? new Date(req.issuedAt) : null,
      expiresAt: req.expiresAt ? new Date(req.expiresAt) : null,
      documentUrl: req.documentUrl ?? null,
    });
    await this.repository.save(v);
    return this.map(v);
  }
  async list(doctorId: string) {
    return (await this.repository.findByDoctor(doctorId)).map((x) =>
      this.map(x),
    );
  }
  async verify(id: string, req: VerifyDoctorCredentialRequest) {
    const v = await this.mustFind(id);
    if (req.approved) v.verify(req.note);
    else v.reject(req.note ?? 'Rejected');
    await this.repository.save(v);
    return this.map(v);
  }
  async remove(id: string) {
    await this.mustFind(id);
    await this.repository.delete(id);
  }
  private async mustFind(id: string) {
    const v = await this.repository.findById(id);
    if (!v) throw new NotFoundException('Credential not found');
    return v;
  }
  private map(v: DoctorCredentialAggregate) {
    const s = v.snapshot;
    return {
      ...s,
      issuedAt: s.issuedAt?.toISOString().slice(0, 10) ?? null,
      expiresAt: s.expiresAt?.toISOString().slice(0, 10) ?? null,
      verifiedAt: s.verifiedAt?.toISOString() ?? null,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    };
  }
}
