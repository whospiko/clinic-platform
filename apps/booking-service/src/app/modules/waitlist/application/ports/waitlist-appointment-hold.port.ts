export type CreateWaitlistAppointmentHoldInput = {
    clinicId?: string | null;
    doctorId: string;
    patientId: string;
    resourceId?: string | null;
    startAt: Date;
    endAt: Date;
    reason?: string | null;
    ttlMinutes: number;
};

export type CreateWaitlistAppointmentHoldResult = {
    holdId: string;
    expiresAt: Date;
};

export type ConfirmWaitlistAppointmentHoldInput = {
    holdId: string;
    patientId: string;
};

export type ConfirmWaitlistAppointmentHoldResult = {
    appointmentId: string;
};

export interface WaitlistAppointmentHoldPort {
    createHold(
        input: CreateWaitlistAppointmentHoldInput,
    ): Promise<CreateWaitlistAppointmentHoldResult>;

    confirmHold(
        input: ConfirmWaitlistAppointmentHoldInput,
    ): Promise<ConfirmWaitlistAppointmentHoldResult>;

    cancelHold(holdId: string): Promise<void>;
}