import { DentalChairStatus } from '../../domain/dental-chair-status.enum';

export class ChangeDentalChairStatusCommand {
    constructor(
        public readonly id: string,
        public readonly status: DentalChairStatus,
    ) { }
}