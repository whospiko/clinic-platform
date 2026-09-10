import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PatientContactRepository } from '../../application/ports/patient-contact.repository';
import { PatientContactAggregate } from '../../domain/patient-contact.aggregate';
import { PatientContactMapper } from './patient-contact.mapper';
import { PatientContactOrmEntity } from './patient-contact.orm-entity';

@Injectable()
export class TypeOrmPatientContactRepository
  implements PatientContactRepository
{
  constructor(
    @InjectRepository(PatientContactOrmEntity)
    private readonly repo: Repository<PatientContactOrmEntity>,
  ) {}

  async save(
    contact: PatientContactAggregate,
  ): Promise<PatientContactAggregate> {
    const saved = await this.repo.save(PatientContactMapper.toOrm(contact));
    return PatientContactMapper.toDomain(saved);
  }

  async findById(id: string): Promise<PatientContactAggregate | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? PatientContactMapper.toDomain(orm) : null;
  }

  async findByPatientId(patientId: string): Promise<PatientContactAggregate[]> {
    const rows = await this.repo.find({
      where: { patientId },
      order: { isPrimary: 'DESC', createdAt: 'DESC' },
    });
    return rows.map(PatientContactMapper.toDomain);
  }

  async unsetPrimary(patientId: string, excludeId?: string): Promise<void> {
    const qb = this.repo
      .createQueryBuilder()
      .update(PatientContactOrmEntity)
      .set({ isPrimary: false })
      .where('patient_id = :patientId', { patientId });
    if (excludeId) qb.andWhere('id != :excludeId', { excludeId });
    await qb.execute();
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete({ id });
  }
}
