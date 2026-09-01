import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';

import { CreateScheduleOverrideCommand } from '../commands/create-schedule-override.command';
import {
    ScheduleOverrideRepository,
    SCHEDULE_OVERRIDE_REPOSITORY,
} from '../ports/schedule-override.repository';
import { DoctorScheduleOverride } from '../../domain/doctor-schedule-override.aggregate';

@CommandHandler(CreateScheduleOverrideCommand)
export class CreateScheduleOverrideHandler
    implements ICommandHandler<CreateScheduleOverrideCommand, { id: string }> {
    constructor(
        @Inject(SCHEDULE_OVERRIDE_REPOSITORY)
        private readonly repository: ScheduleOverrideRepository,
    ) { }

    async execute(command: CreateScheduleOverrideCommand): Promise<{ id: string }> {
        const override = DoctorScheduleOverride.create({
            id: randomUUID(),
            doctorId: command.doctorId,
            clinicId: command.clinicId,
            date: command.date,
            type: command.type,
            startTime: command.startTime,
            endTime: command.endTime,
            reason: command.reason,
        });

        await this.repository.save(override);

        return { id: override.id };
    }
}