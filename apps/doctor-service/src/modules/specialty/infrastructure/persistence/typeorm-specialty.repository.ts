import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpecialtyRepository } from '../../application/ports/specialty.repository';
import { SpecialtyAggregate } from '../../domain/specialty.aggregate';
import { SpecialtyOrmEntity } from './specialty.orm-entity';

const toDomain = (e: SpecialtyOrmEntity) =>
  SpecialtyAggregate.rehydrate({ ...e });
const toOrm = (x: SpecialtyAggregate) =>
  Object.assign(new SpecialtyOrmEntity(), x.snapshot);

@Injectable()
export class TypeOrmSpecialtyRepository implements SpecialtyRepository {
  constructor(
    @InjectRepository(SpecialtyOrmEntity)
    private readonly repo: Repository<SpecialtyOrmEntity>,
  ) {}
  async save(v: SpecialtyAggregate) {
    await this.repo.save(toOrm(v));
  }
  async findById(id: string) {
    const e = await this.repo.findOne({ where: { id } });
    return e ? toDomain(e) : null;
  }
  async findByCode(code: string) {
    const e = await this.repo.findOne({ where: { code } });
    return e ? toDomain(e) : null;
  }
  async findAll(active?: boolean) {
    const rows = await this.repo.find({
      where: active === undefined ? {} : { active },
      order: { name: 'ASC' },
    });
    return rows.map(toDomain);
  }
  async delete(id: string) {
    await this.repo.delete(id);
  }
}
