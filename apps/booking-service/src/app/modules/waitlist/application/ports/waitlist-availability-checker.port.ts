export type CheckWaitlistSlotAvailabilityInput = {
    clinicId?: string | null;
    doctorId: string;
    resourceId?: string | null;
    startAt: Date;
    endAt: Date;
};

export interface WaitlistAvailabilityCheckerPort {
    isSlotAvailable(input: CheckWaitlistSlotAvailabilityInput): Promise<boolean>;
}