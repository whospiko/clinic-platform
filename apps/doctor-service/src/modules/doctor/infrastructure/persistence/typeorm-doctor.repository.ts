import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { DoctorAggregate } from '../../domain/doctor.aggregate';
import {
  DoctorRepository,
  DoctorListFilter,
} from '../../application/ports/doctor.repository';
import { PageResult } from '../../../../shared-kernel/application/page-result';
import { DoctorOrmEntity } from './doctor.orm-entity';
import { DoctorMapper } from './doctor.mapper';

@Injectable()
export class TypeOrmDoctorRepository implements DoctorRepository {
  constructor(
    @InjectRepository(DoctorOrmEntity)
    private readonly repo: Repository<DoctorOrmEntity>,
  ) {}

  async save(doctor: DoctorAggregate): Promise<void> {
    await this.repo.save(DoctorMapper.toOrm(doctor));
  }
  async findById(id: string): Promise<DoctorAggregate | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? DoctorMapper.toDomain(row) : null;
  }
  async findByEmployeeCode(
    employeeCode: string,
  ): Promise<DoctorAggregate | null> {
    const row = await this.repo.findOne({ where: { employeeCode } });
    return row ? DoctorMapper.toDomain(row) : null;
  }

  async findMany(
    filter: DoctorListFilter,
  ): Promise<PageResult<DoctorAggregate>> {
    const qb = this.repo.createQueryBuilder('d');
    if (filter.status)
      qb.andWhere('d.status = :status', { status: filter.status });
    if (filter.search) {
      qb.andWhere(
        new Brackets((q) =>
          q
            .where('d.employee_code LIKE :search', {
              search: `%${filter.search}%`,
            })
            .orWhere('d.first_name LIKE :search', {
              search: `%${filter.search}%`,
            })
            .orWhere('d.last_name LIKE :search', {
              search: `%${filter.search}%`,
            })
            .orWhere('d.display_name LIKE :search', {
              search: `%${filter.search}%`,
            })
            .orWhere('d.email LIKE :search', { search: `%${filter.search}%` }),
        ),
      );
    }
    if (filter.clinicId) {
      qb.andWhere(
        `EXISTS (SELECT 1 FROM doctor_clinic_assignments a WHERE a.doctor_id = d.id AND a.clinic_id = :clinicId AND a.status = 'ACTIVE')`,
        { clinicId: filter.clinicId },
      );
    }
    if (filter.specialtyId) {
      qb.andWhere(
        `EXISTS (SELECT 1 FROM doctor_specialties ds WHERE ds.doctor_id = d.id AND ds.specialty_id = :specialtyId)`,
        { specialtyId: filter.specialtyId },
      );
    }
    const [rows, total] = await qb
      .orderBy('d.display_name', 'ASC')
      .skip((filter.page - 1) * filter.limit)
      .take(filter.limit)
      .getManyAndCount();
    return {
      items: rows.map(DoctorMapper.toDomain),
      page: filter.page,
      limit: filter.limit,
      total,
      totalPages: Math.ceil(total / filter.limit),
    };
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
