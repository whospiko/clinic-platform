import { AppointmentHoldAggregate } from '../../domain/appointment-hold.aggregate';

export const APPOINTMENT_HOLD_REPOSITORY = Symbol('APPOINTMENT_HOLD_REPOSITORY');

export type FindActiveOverlappingHoldInput = {
    clinicId?: string | null;
    doctorId: string;
    resourceId?: string | null;
    startAt: Date;
    endAt: Date;
    now: Date;
};

export interface AppointmentHoldRepository {
    save(hold: AppointmentHoldAggregate): Promise<AppointmentHoldAggregate>;

    findById(id: string): Promise<AppointmentHoldAggregate | null>;

    findActiveOverlapping(
        input: FindActiveOverlappingHoldInput,
    ): Promise<AppointmentHoldAggregate[]>;
}