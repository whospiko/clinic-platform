import { AppointmentHoldStatus } from '../../domain/appointment-hold-status.enum';

export type AppointmentHoldReadModel = {
    id: string;
    clinicId?: string | null;
    doctorId: string;
    patientId?: string | null;
    resourceId?: string | null;
    appointmentId?: string | null;
    startAt: Date;
    endAt: Date;
    expiresAt: Date;
    status: AppointmentHoldStatus;
    reason?: string | null;
    createdAt: Date;
    updatedAt: Date;
};