import {
    WaitlistEntryAggregate,
    WaitlistEntrySnapshot,
} from '../../domain/waitlist-entry.aggregate';
import { WaitlistEntryOrmEntity } from './waitlist-entry.entity';

export class WaitlistEntryMapper {
    static toDomain(entity: WaitlistEntryOrmEntity): WaitlistEntryAggregate {
        const snapshot: WaitlistEntrySnapshot = {
            id: entity.id,
            clinicId: entity.clinicId,
            doctorId: entity.doctorId,
            patientId: entity.patientId,
            resourceId: entity.resourceId,

            preferredStartAt: entity.preferredStartAt,
            preferredEndAt: entity.preferredEndAt,
            requestedDurationMinutes: entity.requestedDurationMinutes,

            status: entity.status,
            priority: entity.priority,
            reason: entity.reason,

            offeredStartAt: entity.offeredStartAt,
            offeredEndAt: entity.offeredEndAt,
            offeredResourceId: entity.offeredResourceId,
            appointmentHoldId: entity.appointmentHoldId,
            offerExpiresAt: entity.offerExpiresAt,

            bookedAppointmentId: entity.bookedAppointmentId,

            cancelledReason: entity.cancelledReason,
            cancelledAt: entity.cancelledAt,

            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };

        return WaitlistEntryAggregate.fromSnapshot(snapshot);
    }

    static toOrm(aggregate: WaitlistEntryAggregate): WaitlistEntryOrmEntity {
        const snapshot = aggregate.toSnapshot();

        const entity = new WaitlistEntryOrmEntity();

        entity.id = snapshot.id;
        entity.clinicId = snapshot.clinicId;
        entity.doctorId = snapshot.doctorId;
        entity.patientId = snapshot.patientId;
        entity.resourceId = snapshot.resourceId;

        entity.preferredStartAt = snapshot.preferredStartAt;
        entity.preferredEndAt = snapshot.preferredEndAt;
        entity.requestedDurationMinutes = snapshot.requestedDurationMinutes;

        entity.status = snapshot.status;
        entity.priority = snapshot.priority;
        entity.reason = snapshot.reason;

        entity.offeredStartAt = snapshot.offeredStartAt;
        entity.offeredEndAt = snapshot.offeredEndAt;
        entity.offeredResourceId = snapshot.offeredResourceId;
        entity.appointmentHoldId = snapshot.appointmentHoldId;
        entity.offerExpiresAt = snapshot.offerExpiresAt;

        entity.bookedAppointmentId = snapshot.bookedAppointmentId;

        entity.cancelledReason = snapshot.cancelledReason;
        entity.cancelledAt = snapshot.cancelledAt;

        entity.createdAt = snapshot.createdAt;
        entity.updatedAt = snapshot.updatedAt;

        return entity;
    }
}