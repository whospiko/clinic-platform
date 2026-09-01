import { Injectable } from '@nestjs/common';

import { BlockedTimeRange } from './blocked-time-range';
import { AvailabilitySlot } from './availability-slot';

export interface WorkingTimeRange {
    startAt: Date;
    endAt: Date;
}

export interface CalculateAvailabilityInput {
    doctorId: string;
    workingRanges: WorkingTimeRange[];
    blockedRanges: BlockedTimeRange[];
    durationMinutes: number;
    slotStepMinutes: number;
}

@Injectable()
export class AvailabilityDomainService {
    calculateSlots(input: CalculateAvailabilityInput): AvailabilitySlot[] {
        if (input.durationMinutes <= 0) {
            throw new Error('durationMinutes must be greater than 0');
        }

        if (input.slotStepMinutes <= 0) {
            throw new Error('slotStepMinutes must be greater than 0');
        }

        const slots: AvailabilitySlot[] = [];

        for (const workingRange of input.workingRanges) {
            let cursor = new Date(workingRange.startAt);

            while (true) {
                const slotStart = new Date(cursor);
                const slotEnd = this.addMinutes(slotStart, input.durationMinutes);

                if (slotEnd > workingRange.endAt) {
                    break;
                }

                const isBlocked = input.blockedRanges.some((blockedRange) =>
                    blockedRange.overlaps(slotStart, slotEnd),
                );

                if (!isBlocked) {
                    slots.push(
                        AvailabilitySlot.create({
                            doctorId: input.doctorId,
                            startAt: slotStart,
                            endAt: slotEnd,
                        }),
                    );
                }

                cursor = this.addMinutes(cursor, input.slotStepMinutes);
            }
        }

        return slots;
    }

    private addMinutes(date: Date, minutes: number): Date {
        return new Date(date.getTime() + minutes * 60_000);
    }
}