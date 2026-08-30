import { Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { RescheduleAppointmentCommand } from '../commands/reschedule-appointment.command';
import { AppointmentResponseDto } from '../dto/appointment-response.dto';

import {
    APPOINTMENT_REPOSITORY,
    AppointmentRepository,
} from '../ports/appointment.repository';

import {
    AVAILABILITY_CHECKER,
    AvailabilityCheckerPort,
} from '../ports/availability-checker.port';

import {
    TREATMENT_READER,
    TreatmentReaderPort,
} from '../ports/treatment-reader.port';

@CommandHandler(RescheduleAppointmentCommand)
export class RescheduleAppointmentHandler
    implements ICommandHandler<RescheduleAppointmentCommand, AppointmentResponseDto> {
    constructor(
        @Inject(APPOINTMENT_REPOSITORY)
        private readonly appointmentRepository: AppointmentRepository,

        @Inject(AVAILABILITY_CHECKER)
        private readonly availabilityChecker: AvailabilityCheckerPort,

        @Inject(TREATMENT_READER)
        private readonly treatmentReader: TreatmentReaderPort,
    ) { }

    async execute(command: RescheduleAppointmentCommand): Promise<AppointmentResponseDto> {
        const appointment = await this.appointmentRepository.findById(command.appointmentId);

        if (!appointment) {
            throw new NotFoundException('Appointment not found.');
        }

        const endAt = await this.resolveEndAt(command);

        await this.availabilityChecker.assertDoctorAvailable({
            doctorId: appointment.getDoctorId(),
            startAt: command.startAt,
            endAt,
            excludeAppointmentId: appointment.getId(),
        });

        try {
            appointment.reschedule({
                newStartAt: command.startAt,
                newEndAt: endAt,
                treatmentId: command.treatmentId,
                note: command.note,
            });
        } catch (error) {
            throw new BadRequestException((error as Error).message);
        }

        await this.appointmentRepository.save(appointment);

        return AppointmentResponseDto.fromDomain(appointment);
    }

    private async resolveEndAt(command: RescheduleAppointmentCommand): Promise<Date> {
        if (command.endAt) {
            return command.endAt;
        }

        if (command.treatmentId) {
            const treatment = await this.treatmentReader.getTreatment(command.treatmentId);

            if (!treatment) {
                throw new BadRequestException('Treatment does not exist.');
            }

            return new Date(command.startAt.getTime() + treatment.durationMinutes * 60_000);
        }

        return new Date(command.startAt.getTime() + 30 * 60_000);
    }
}