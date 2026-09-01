import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    AvailabilityCheckerPort,
} from '../../application/ports/availability-checker.port';
import {
    SCHEDULE_READER_PORT,
    ScheduleReaderPort,
} from '../../application/ports/schedule-reader.port';
import {
    APPOINTMENT_BLOCK_READER_PORT,
    AppointmentBlockReaderPort,
} from '../../application/ports/appointment-block-reader.port';
import {
    HOLD_BLOCK_READER_PORT,
    HoldBlockReaderPort,
} from '../../application/ports/hold-block-reader.port';
import {
    RESOURCE_READER_PORT,
    ResourceReaderPort,
} from '../../application/ports/resource-reader.port';

import { AvailabilityDomainService } from '../../domain/availability-domain.service';
import { AvailableSlotDto } from '../../application/dto/available-slot.dto';

@Injectable()
export class AvailabilityCheckerAdapter implements AvailabilityCheckerPort {
    constructor(
        private readonly availabilityDomainService: AvailabilityDomainService,

        @Inject(SCHEDULE_READER_PORT)
        private readonly scheduleReader: ScheduleReaderPort,

        @Inject(APPOINTMENT_BLOCK_READER_PORT)
        private readonly appointmentBlockReader: AppointmentBlockReaderPort,

        @Inject(HOLD_BLOCK_READER_PORT)
        private readonly holdBlockReader: HoldBlockReaderPort,

        @Inject(RESOURCE_READER_PORT)
        private readonly resourceReader: ResourceReaderPort,
    ) { }

    async getAvailableSlots(params: {
        doctorId: string;
        date: string;
        durationMinutes?: number;
        slotStepMinutes?: number;
        treatmentId?: string;
    }): Promise<AvailableSlotDto[]> {
        this.validateDate(params.date);

        const doctorExists = await this.resourceReader.doctorExists(
            params.doctorId,
        );

        if (!doctorExists) {
            throw new NotFoundException('Doctor not found');
        }

        const defaultDuration =
            await this.resourceReader.getDoctorDefaultAppointmentDurationMinutes(
                params.doctorId,
            );

        const durationMinutes =
            params.durationMinutes ?? defaultDuration ?? 30;

        const slotStepMinutes = params.slotStepMinutes ?? durationMinutes;

        const [
            workingRanges,
            breakRanges,
            scheduleBlockedRanges,
            appointmentBlockedRanges,
            holdBlockedRanges,
        ] = await Promise.all([
            this.scheduleReader.getDoctorWorkingRanges({
                doctorId: params.doctorId,
                date: params.date,
            }),
            this.scheduleReader.getDoctorBreakRanges({
                doctorId: params.doctorId,
                date: params.date,
            }),
            this.scheduleReader.getDoctorScheduleBlockedRanges({
                doctorId: params.doctorId,
                date: params.date,
            }),
            this.appointmentBlockReader.getAppointmentBlockedRanges({
                doctorId: params.doctorId,
                date: params.date,
            }),
            this.holdBlockReader.getActiveHoldBlockedRanges({
                doctorId: params.doctorId,
                date: params.date,
            }),
        ]);

        const blockedRanges = [
            ...breakRanges,
            ...scheduleBlockedRanges,
            ...appointmentBlockedRanges,
            ...holdBlockedRanges,
        ];

        const slots = this.availabilityDomainService.calculateSlots({
            doctorId: params.doctorId,
            workingRanges,
            blockedRanges,
            durationMinutes,
            slotStepMinutes,
        });

        return slots.map((slot) => ({
            doctorId: slot.doctorId,
            startAt: slot.startAt.toISOString(),
            endAt: slot.endAt.toISOString(),
            durationMinutes: slot.durationMinutes(),
        }));
    }

    private validateDate(date: string): void {
        const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date);

        if (!isValidDate) {
            throw new BadRequestException('date must use YYYY-MM-DD format');
        }
    }
}