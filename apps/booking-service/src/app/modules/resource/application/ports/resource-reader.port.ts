import { DentalChairStatus } from '../../domain/dental-chair-status.enum';
import { DentalChairReadModel } from '../dto/dental-chair-read-model';

export type FindDentalChairsFilter = {
    clinicId?: string | null;
    status?: DentalChairStatus;
};

export abstract class ResourceReaderPort {
    abstract findDentalChairById(id: string): Promise<DentalChairReadModel | null>;

    abstract findDentalChairs(
        filter?: FindDentalChairsFilter,
    ): Promise<DentalChairReadModel[]>;

    abstract isDentalChairActive(id: string): Promise<boolean>;
}