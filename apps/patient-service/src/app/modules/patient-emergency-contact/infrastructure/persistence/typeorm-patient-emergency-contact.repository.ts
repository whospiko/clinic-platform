import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PatientEmergencyContactRepository } from '../../application/ports/patient-emergency-contact.repository';
import { PatientEmergencyContactAggregate } from '../../domain/patient-emergency-contact.aggregate';
import { PatientEmergencyContactMapper } from './patient-emergency-contact.mapper';
import { PatientEmergencyContactOrmEntity } from './patient-emergency-contact.orm-entity';

@Injectable()
export class TypeOrmPatientEmergencyContactRepository
  implements PatientEmergencyContactRepository
{
  constructor(
    @InjectRepository(PatientEmergencyContactOrmEntity)
    private readonly repo: Repository<PatientEmergencyContactOrmEntity>,
  ) {}

  async save(
    contact: PatientEmergencyContactAggregate,
  ): Promise<PatientEmergencyContactAggregate> {
    return PatientEmergencyContactMapper.toDomain(
      await this.repo.save(PatientEmergencyContactMapper.toOrm(contact)),
    );
  }

  async findById(id: string): Promise<PatientEmergencyContactAggregate | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? PatientEmergencyContactMapper.toDomain(orm) : null;
  }

  async findByPatientId(
    patientId: string,
  ): Promise<PatientEmergencyContactAggregate[]> {
    const rows = await this.repo.find({
      where: { patientId },
      order: { isPrimary: 'DESC', createdAt: 'DESC' },
    });
    return rows.map(PatientEmergencyContactMapper.toDomain);
  }

  async unsetPrimary(patientId: string, excludeId?: string): Promise<void> {
    const qb = this.repo
      .createQueryBuilder()
      .update(PatientEmergencyContactOrmEntity)
      .set({ isPrimary: false })
      .where('patient_id = :patientId', { patientId });
    if (excludeId) qb.andWhere('id != :excludeId', { excludeId });
    await qb.execute();
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete({ id });
  }
}
