import { AppointmentHoldReadModel } from '../dto/appointment-hold-read-model';

export const HOLD_BLOCK_READER = Symbol('HOLD_BLOCK_READER');

export type FindActiveHoldBlocksInput = {
    clinicId?: string | null;
    doctorId: string;
    resourceId?: string | null;
    startAt: Date;
    endAt: Date;
    now?: Date;
};

export interface HoldBlockReaderPort {
    /**
     * Used by availability module.
     *
     * Return only holds that still block appointment availability:
     * - status = ACTIVE
     * - expiresAt > now
     * - time overlaps requested window
     */
    findActiveBlocks(input: FindActiveHoldBlocksInput): Promise<AppointmentHoldReadModel[]>;
}