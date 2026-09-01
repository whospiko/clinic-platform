export const AVAILABILITY_CHECKER = Symbol('AVAILABILITY_CHECKER');

export interface AvailabilityCheckerPort {
    assertDoctorAvailable(params: {
        doctorId: string;
        startAt: Date;
        endAt: Date;
        excludeAppointmentId?: string;
    }): Promise<void>;

    isDoctorAvailable(params: {
        doctorId: string;
        startAt: Date;
        endAt: Date;
        excludeAppointmentId?: string;
    }): Promise<boolean>;
}