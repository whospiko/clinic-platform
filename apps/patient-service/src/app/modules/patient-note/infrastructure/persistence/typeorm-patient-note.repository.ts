import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import {
  PatientNoteRepository,
  PatientNoteSearchCriteria,
} from '../../application/ports/patient-note.repository';
import { PatientNoteAggregate } from '../../domain/patient-note.aggregate';
import { PatientNoteMapper } from './patient-note.mapper';
import { PatientNoteOrmEntity } from './patient-note.orm-entity';

@Injectable()
export class TypeOrmPatientNoteRepository implements PatientNoteRepository {
  constructor(
    @InjectRepository(PatientNoteOrmEntity)
    private readonly repo: Repository<PatientNoteOrmEntity>,
  ) {}

  async save(note: PatientNoteAggregate): Promise<PatientNoteAggregate> {
    return PatientNoteMapper.toDomain(
      await this.repo.save(PatientNoteMapper.toOrm(note)),
    );
  }

  async findById(id: string): Promise<PatientNoteAggregate | null> {
    const orm = await this.repo.findOne({ where: { id, deletedAt: IsNull() } });
    return orm ? PatientNoteMapper.toDomain(orm) : null;
  }

  async findMany(
    criteria: PatientNoteSearchCriteria,
  ): Promise<PatientNoteAggregate[]> {
    const rows = await this.repo.find({
      where: {
        patientId: criteria.patientId,
        ...(criteria.type ? { type: criteria.type } : {}),
        deletedAt: IsNull(),
      },
      order: { createdAt: 'DESC' },
    });
    return rows.map(PatientNoteMapper.toDomain);
  }
}
