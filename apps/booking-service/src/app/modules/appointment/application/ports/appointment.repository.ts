import { AppointmentAggregate } from '../../domain/appointment.aggregate';

export const APPOINTMENT_REPOSITORY = Symbol('APPOINTMENT_REPOSITORY');

export interface AppointmentRepository {
    save(appointment: AppointmentAggregate): Promise<void>;

    findById(id: string): Promise<AppointmentAggregate | null>;

    findByAppointmentNo(appointmentNo: string): Promise<AppointmentAggregate | null>;
}