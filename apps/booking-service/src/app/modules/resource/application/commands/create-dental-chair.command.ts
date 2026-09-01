import { DentalChairStatus } from '../../domain/dental-chair-status.enum';

export class CreateDentalChairCommand {
    constructor(
        public readonly clinicId: string | null,
        public readonly code: string,
        public readonly name: string,
        public readonly description: string | null,
        public readonly status?: DentalChairStatus,
    ) { }
}