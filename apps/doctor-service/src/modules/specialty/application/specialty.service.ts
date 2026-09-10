import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SpecialtyRepository } from './ports/specialty.repository';
import { SpecialtyAggregate } from '../domain/specialty.aggregate';
import { CreateSpecialtyRequest } from '../presentation/dto/create-specialty.request';
import { UpdateSpecialtyRequest } from '../presentation/dto/update-specialty.request';

@Injectable()
export class SpecialtyService {
  constructor(private readonly repository: SpecialtyRepository) {}
  async create(req: CreateSpecialtyRequest) {
    if (await this.repository.findByCode(req.code))
      throw new ConflictException('Specialty code already exists');
    const value = SpecialtyAggregate.create({
      code: req.code,
      name: req.name,
      description: req.description ?? null,
    });
    await this.repository.save(value);
    return this.map(value);
  }
  async get(id: string) {
    return this.map(await this.mustFind(id));
  }
  async list(active?: boolean) {
    return Promise.all(
      (await this.repository.findAll(active)).map((x) => this.map(x)),
    );
  }
  async update(id: string, req: UpdateSpecialtyRequest) {
    const value = await this.mustFind(id);
    value.update(req);
    await this.repository.save(value);
    return this.map(value);
  }
  async remove(id: string) {
    await this.mustFind(id);
    await this.repository.delete(id);
  }
  private async mustFind(id: string) {
    const x = await this.repository.findById(id);
    if (!x) throw new NotFoundException('Specialty not found');
    return x;
  }
  private map(x: SpecialtyAggregate) {
    const s = x.snapshot;
    return {
      ...s,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    };
  }
}
