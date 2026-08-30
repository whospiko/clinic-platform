import { AppointmentAggregate } from '../../domain/appointment.aggregate';
import { AppointmentStatusHistoryEntity } from '../../domain/appointment-status-history.entity';

import { AppointmentOrmEntity } from './appointment.entity';
import { AppointmentStatusHistoryOrmEntity } from './appointment-status-history.orm-entity';

export class AppointmentMapper {
    static toDomain(entity: AppointmentOrmEntity): AppointmentAggregate {
        return AppointmentAggregate.rehydrate({
            id: entity.id,
            appointmentNo: entity.appointmentNo,
            patientId: entity.patientId,
            doctorId: entity.doctorId,
            treatmentId: entity.treatmentId,
            source: entity.source,
            status: entity.status,
            startAt: entity.startAt,
            endAt: entity.endAt,
            note: entity.note,
            cancelReason: entity.cancelReason,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            histories: entity.histories?.map(this.historyToDomain) ?? [],
        });
    }

    static toOrm(appointment: AppointmentAggregate): AppointmentOrmEntity {
        const entity = new AppointmentOrmEntity();

        entity.id = appointment.getId();
        entity.appointmentNo = appointment.getAppointmentNo();
        entity.patientId = appointment.getPatientId();
        entity.doctorId = appointment.getDoctorId();
        entity.treatmentId = appointment.getTreatmentId();
        entity.source = appointment.getSource();
        entity.status = appointment.getStatus();
        entity.startAt = appointment.getStartAt();
        entity.endAt = appointment.getEndAt();
        entity.note = appointment.getNote();
        entity.cancelReason = appointment.getCancelReason();
        entity.createdAt = appointment.getCreatedAt();
        entity.updatedAt = appointment.getUpdatedAt();
        entity.histories = appointment
            .getHistories()
            .map(history => this.historyToOrm(history, appointment.getId()));

        return entity;
    }

    private static historyToDomain(
        entity: AppointmentStatusHistoryOrmEntity,
    ): AppointmentStatusHistoryEntity {
        return new AppointmentStatusHistoryEntity(
            entity.id,
            entity.appointmentId,
            entity.fromStatus,
            entity.toStatus,
            entity.reason,
            entity.changedAt,
        );
    }

    private static historyToOrm(
        history: AppointmentStatusHistoryEntity,
        appointmentId: string,
    ): AppointmentStatusHistoryOrmEntity {
        const entity = new AppointmentStatusHistoryOrmEntity();

        entity.id = history.id;
        entity.appointmentId = appointmentId;
        entity.fromStatus = history.fromStatus;
        entity.toStatus = history.toStatus;
        entity.reason = history.reason;
        entity.changedAt = history.changedAt;

        return entity;
    }
}