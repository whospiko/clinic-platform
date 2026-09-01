import { AppointmentStatus } from '../../domain/appointment-status.enum';
import { AppointmentStatusHistoryEntity } from '../../domain/appointment-status-history.entity';

export class AppointmentStatusHistoryResponseDto {
    id: string;
    appointmentId: string;
    fromStatus: AppointmentStatus | null;
    toStatus: AppointmentStatus;
    reason: string | null;
    changedAt: string;

    static fromDomain(
        history: AppointmentStatusHistoryEntity,
    ): AppointmentStatusHistoryResponseDto {
        return {
            id: history.id,
            appointmentId: history.appointmentId,
            fromStatus: history.fromStatus,
            toStatus: history.toStatus,
            reason: history.reason,
            changedAt: history.changedAt.toISOString(),
        };
    }
}