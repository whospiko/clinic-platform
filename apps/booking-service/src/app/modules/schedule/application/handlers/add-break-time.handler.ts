import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';

import { AddBreakTimeCommand } from '../commands/add-break-time.command';
import {
    ScheduleTemplateRepository,
    SCHEDULE_TEMPLATE_REPOSITORY,
} from '../ports/schedule-template.repository';
import { DoctorBreakTime } from '../../domain/doctor-break-time.entity';

@CommandHandler(AddBreakTimeCommand)
export class AddBreakTimeHandler
    implements ICommandHandler<AddBreakTimeCommand, { id: string }> {
    constructor(
        @Inject(SCHEDULE_TEMPLATE_REPOSITORY)
        private readonly repository: ScheduleTemplateRepository,
    ) { }

    async execute(command: AddBreakTimeCommand): Promise<{ id: string }> {
        const template = await this.repository.findById(command.templateId);

        if (!template) {
            throw new Error('Schedule template not found');
        }

        const breakTime = DoctorBreakTime.create({
            id: randomUUID(),
            templateId: template.id,
            dayOfWeek: command.dayOfWeek,
            startTime: command.startTime,
            endTime: command.endTime,
            reason: command.reason,
        });

        template.addBreakTime(breakTime);

        await this.repository.save(template);

        return { id: breakTime.id };
    }
}