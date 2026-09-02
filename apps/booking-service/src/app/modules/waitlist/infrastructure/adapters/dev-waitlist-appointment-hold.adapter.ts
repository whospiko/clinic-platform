import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import {
    ConfirmWaitlistAppointmentHoldInput,
    ConfirmWaitlistAppointmentHoldResult,
    CreateWaitlistAppointmentHoldInput,
    CreateWaitlistAppointmentHoldResult,
    WaitlistAppointmentHoldPort,
} from '../../application/ports/waitlist-appointment-hold.port';

@Injectable()
export class DevWaitlistAppointmentHoldAdapter
    implements WaitlistAppointmentHoldPort {
    async createHold(
        input: CreateWaitlistAppointmentHoldInput,
    ): Promise<CreateWaitlistAppointmentHoldResult> {
        const expiresAt = new Date(
            Date.now() + input.ttlMinutes * 60 * 1000,
        );

        return {
            holdId: randomUUID(),
            expiresAt,
        };
    }

    async confirmHold(
        _input: ConfirmWaitlistAppointmentHoldInput,
    ): Promise<ConfirmWaitlistAppointmentHoldResult> {
        return {
            appointmentId: randomUUID(),
        };
    }

    async cancelHold(_holdId: string): Promise<void> {
        return;
    }
}