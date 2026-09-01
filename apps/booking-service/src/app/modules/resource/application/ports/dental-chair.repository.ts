import { DentalChairAggregate } from '../../domain/dental-chair.aggregate';

export abstract class DentalChairRepository {
    abstract save(chair: DentalChairAggregate): Promise<DentalChairAggregate>;

    abstract findById(id: string): Promise<DentalChairAggregate | null>;

    abstract findByCode(
        code: string,
        clinicId: string | null,
    ): Promise<DentalChairAggregate | null>;

    abstract existsByCode(
        code: string,
        clinicId: string | null,
        excludeId?: string,
    ): Promise<boolean>;
}