import { AvailableSlotDto } from '../dto/available-slot.dto';

export const AVAILABILITY_CHECKER_PORT = Symbol('AVAILABILITY_CHECKER_PORT');

export interface AvailabilityCheckerPort {
    getAvailableSlots(params: {
        doctorId: string;
        date: string;
        durationMinutes?: number;
        slotStepMinutes?: number;
        treatmentId?: string;
    }): Promise<AvailableSlotDto[]>;
}