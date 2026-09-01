import { AppointmentAggregate } from '../../domain/appointment.aggregate';
import { AppointmentSource } from '../../domain/appointment-source.enum';
import { AppointmentStatus } from '../../domain/appointment-status.enum';
import { AppointmentStatusHistoryEntity } from '../../domain/appointment-status-history.entity';

export const APPOINTMENT_QUERY_REPOSITORY = Symbol('APPOINTMENT_QUERY_REPOSITORY');

export interface AppointmentListFilter {
    page: number;
    limit: number;

    patientId?: string;
    doctorId?: string;
    treatmentId?: string;
    status?: AppointmentStatus;
    source?: AppointmentSource;

    from?: Date;
    to?: Date;

    s?: string;
}

export interface AppointmentPageResult {
    items: AppointmentAggregate[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface BusySlot {
    appointmentId: string;
    appointmentNo: string;
    doctorId: string;
    patientId: string;
    status: AppointmentStatus;
    startAt: Date;
    endAt: Date;
}

export interface AppointmentQueryRepository {
    findMany(filter: AppointmentListFilter): Promise<AppointmentPageResult>;

    findById(id: string): Promise<AppointmentAggregate | null>;

    findByAppointmentNo(appointmentNo: string): Promise<AppointmentAggregate | null>;

    findStatusHistories(
        appointmentId: string,
    ): Promise<AppointmentStatusHistoryEntity[]>;

    findBusySlotsByDoctor(params: {
        doctorId: string;
        from: Date;
        to: Date;
    }): Promise<BusySlot[]>;
}