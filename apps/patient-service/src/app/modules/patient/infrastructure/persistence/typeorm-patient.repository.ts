import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Repository } from 'typeorm';

import { PatientSummaryReadModel } from '../../application/dto/patient-read-model';
import {
  PatientRepository,
  PatientSearchCriteria,
} from '../../application/ports/patient.repository';
import { PatientAggregate } from '../../domain/patient.aggregate';
import { PatientMapper } from './patient.mapper';
import { PatientOrmEntity } from './patient.orm-entity';
import {
  buildPaginated,
  Paginated,
} from '../../../../shared/pagination/paginated';

@Injectable()
export class TypeOrmPatientRepository implements PatientRepository {
  constructor(
    @InjectRepository(PatientOrmEntity)
    private readonly repo: Repository<PatientOrmEntity>,
  ) {}

  async save(patient: PatientAggregate): Promise<PatientAggregate> {
    const orm = PatientMapper.toOrm(patient);
    const saved = await this.repo.save(orm);
    return PatientMapper.toDomain(saved);
  }

  async findById(id: string): Promise<PatientAggregate | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? PatientMapper.toDomain(orm) : null;
  }

  async findByCode(code: string): Promise<PatientAggregate | null> {
    const orm = await this.repo.findOne({ where: { code } });
    return orm ? PatientMapper.toDomain(orm) : null;
  }

  async existsById(id: string): Promise<boolean> {
    return this.repo.exists({ where: { id } });
  }

  async findSummaryById(id: string): Promise<PatientSummaryReadModel | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? PatientMapper.toSummary(orm) : null;
  }

  async findSummariesByIds(ids: string[]): Promise<PatientSummaryReadModel[]> {
    if (ids.length === 0) return [];
    const rows = await this.repo.find({ where: { id: In(ids) } });
    return rows.map(PatientMapper.toSummary);
  }

  async findMany(
    criteria: PatientSearchCriteria,
  ): Promise<Paginated<PatientAggregate>> {
    const qb = this.repo.createQueryBuilder('patient');

    if (criteria.q) {
      const q = `%${criteria.q.trim()}%`;
      qb.andWhere(
        new Brackets((sub) => {
          sub
            .where('patient.fullName LIKE :q', { q })
            .orWhere('patient.code LIKE :q', { q })
            .orWhere('patient.phone LIKE :q', { q })
            .orWhere('patient.email LIKE :q', { q });
        }),
      );
    }
    if (criteria.code)
      qb.andWhere('patient.code = :code', { code: criteria.code });
    if (criteria.phone)
      qb.andWhere('patient.phone = :phone', { phone: criteria.phone });
    if (criteria.email)
      qb.andWhere('patient.email = :email', { email: criteria.email });
    if (criteria.gender)
      qb.andWhere('patient.gender = :gender', { gender: criteria.gender });
    if (criteria.status)
      qb.andWhere('patient.status = :status', { status: criteria.status });

    const page = criteria.page;
    const limit = criteria.limit;
    const [rows, total] = await qb
      .orderBy('patient.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return buildPaginated(rows.map(PatientMapper.toDomain), page, limit, total);
  }
}
