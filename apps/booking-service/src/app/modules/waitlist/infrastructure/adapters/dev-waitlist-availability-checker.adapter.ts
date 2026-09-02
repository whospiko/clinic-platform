import { Injectable } from '@nestjs/common';

import {
    CheckWaitlistSlotAvailabilityInput,
    WaitlistAvailabilityCheckerPort,
} from '../../application/ports/waitlist-availability-checker.port';

@Injectable()
export class DevWaitlistAvailabilityCheckerAdapter
    implements WaitlistAvailabilityCheckerPort {
    async isSlotAvailable(
        _input: CheckWaitlistSlotAvailabilityInput,
    ): Promise<boolean> {
        return true;
    }
}