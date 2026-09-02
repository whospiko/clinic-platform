import { WaitlistEntryStatus } from '../../domain/waitlist-entry-status.enum';

export type WaitlistEntryReadModel = {
    id: string;
    clinicId: string | null;
    doctorId: string;
    patientId: string;
    resourceId: string | null;

    preferredStartAt: Date;
    preferredEndAt: Date;
    requestedDurationMinutes: number;

    status: WaitlistEntryStatus;
    priority: number;
    reason: string | null;

    offeredStartAt: Date | null;
    offeredEndAt: Date | null;
    offeredResourceId: string | null;
    appointmentHoldId: string | null;
    offerExpiresAt: Date | null;

    bookedAppointmentId: string | null;

    cancelledReason: string | null;
    cancelledAt: Date | null;

    createdAt: Date;
    updatedAt: Date;
};