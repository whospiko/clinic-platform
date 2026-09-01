export class UpdateDentalChairCommand {
    constructor(
        public readonly id: string,
        public readonly code?: string,
        public readonly name?: string,
        public readonly description?: string | null,
    ) { }
}