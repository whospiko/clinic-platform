export class GetDoctorBusySlotsQuery {
    constructor(
        public readonly doctorId: string,
        public readonly from: Date,
        public readonly to: Date,
    ) { }
}