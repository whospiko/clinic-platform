import { AppointmentHoldAggregate } from '../../domain/appointment-hold.aggregate';
import { AppointmentHoldOrmEntity } from './appointment-hold.entity';

export class AppointmentHoldMapper {
    static toDomain(entity: AppointmentHoldOrmEntity): AppointmentHoldAggregate {
        return AppointmentHoldAggregate.rehydrate({
            id: entity.id,
            clinicId: entity.clinicId,
            doctorId: entity.doctorId,
            patientId: entity.patientId,
            resourceId: entity.resourceId,
            appointmentId: entity.appointmentId,
            startAt: entity.startAt,
            endAt: entity.endAt,
            expiresAt: entity.expiresAt,
            status: entity.status,
            reason: entity.reason,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }

    static toOrm(aggregate: AppointmentHoldAggregate): AppointmentHoldOrmEntity {
        const props = aggregate.toPrimitives();

        const entity = new AppointmentHoldOrmEntity();

        entity.id = props.id;
        entity.clinicId = props.clinicId ?? null;
        entity.doctorId = props.doctorId;
        entity.patientId = props.patientId ?? null;
        entity.resourceId = props.resourceId ?? null;
        entity.appointmentId = props.appointmentId ?? null;
        entity.startAt = props.startAt;
        entity.endAt = props.endAt;
        entity.expiresAt = props.expiresAt;
        entity.status = props.status;
        entity.reason = props.reason ?? null;
        entity.createdAt = props.createdAt;
        entity.updatedAt = props.updatedAt;

        return entity;
    }
}