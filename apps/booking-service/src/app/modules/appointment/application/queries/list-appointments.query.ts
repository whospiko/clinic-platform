import { AppointmentListFilter } from '../ports/appointment-query.repository';

export class ListAppointmentsQuery {
    constructor(
        public readonly filter: AppointmentListFilter,
    ) { }
}