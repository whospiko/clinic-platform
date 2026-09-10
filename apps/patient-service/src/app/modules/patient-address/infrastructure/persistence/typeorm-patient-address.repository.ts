import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PatientAddressRepository } from '../../application/ports/patient-address.repository';
import { PatientAddressAggregate } from '../../domain/patient-address.aggregate';
import { PatientAddressMapper } from './patient-address.mapper';
import { PatientAddressOrmEntity } from './patient-address.orm-entity';

@Injectable()
export class TypeOrmPatientAddressRepository
  implements PatientAddressRepository
{
  constructor(
    @InjectRepository(PatientAddressOrmEntity)
    private readonly repo: Repository<PatientAddressOrmEntity>,
  ) {}

  async save(
    address: PatientAddressAggregate,
  ): Promise<PatientAddressAggregate> {
    return PatientAddressMapper.toDomain(
      await this.repo.save(PatientAddressMapper.toOrm(address)),
    );
  }

  async findById(id: string): Promise<PatientAddressAggregate | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? PatientAddressMapper.toDomain(orm) : null;
  }

  async findByPatientId(patientId: string): Promise<PatientAddressAggregate[]> {
    const rows = await this.repo.find({
      where: { patientId },
      order: { isPrimary: 'DESC', createdAt: 'DESC' },
    });
    return rows.map(PatientAddressMapper.toDomain);
  }

  async unsetPrimary(patientId: string, excludeId?: string): Promise<void> {
    const qb = this.repo
      .createQueryBuilder()
      .update(PatientAddressOrmEntity)
      .set({ isPrimary: false })
      .where('patient_id = :patientId', { patientId });
    if (excludeId) qb.andWhere('id != :excludeId', { excludeId });
    await qb.execute();
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete({ id });
  }
}
