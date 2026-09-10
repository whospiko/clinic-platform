import { SpecialtyAggregate } from '../../domain/specialty.aggregate';
export abstract class SpecialtyRepository {
  abstract save(value: SpecialtyAggregate): Promise<void>;
  abstract findById(id: string): Promise<SpecialtyAggregate | null>;
  abstract findByCode(code: string): Promise<SpecialtyAggregate | null>;
  abstract findAll(active?: boolean): Promise<SpecialtyAggregate[]>;
  abstract delete(id: string): Promise<void>;
}
