import { AppointmentStatus } from './appointment-status.enum';

export class AppointmentStatusHistoryEntity {
    constructor(
        public readonly id: string,
        public readonly appointmentId: string,
        public readonly fromStatus: AppointmentStatus | null,
        public readonly toStatus: AppointmentStatus,
        public readonly reason: string | null,
        public readonly changedAt: Date,
    ) { }

    static create(params: {
        id: string;
        appointmentId: string;
        fromStatus: AppointmentStatus | null;
        toStatus: AppointmentStatus;
        reason?: string | null;
        changedAt?: Date;
    }): AppointmentStatusHistoryEntity {
        return new AppointmentStatusHistoryEntity(
            params.id,
            params.appointmentId,
            params.fromStatus,
            params.toStatus,
            params.reason ?? null,
            params.changedAt ?? new Date(),
        );
    }
}