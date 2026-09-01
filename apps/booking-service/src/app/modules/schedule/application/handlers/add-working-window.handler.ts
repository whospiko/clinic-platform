import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';

import { AddWorkingWindowCommand } from '../commands/add-working-window.command';
import {
    ScheduleTemplateRepository,
    SCHEDULE_TEMPLATE_REPOSITORY,
} from '../ports/schedule-template.repository';
import { DoctorWorkingWindow } from '../../domain/doctor-working-window.entity';

@CommandHandler(AddWorkingWindowCommand)
export class AddWorkingWindowHandler
    implements ICommandHandler<AddWorkingWindowCommand, { id: string }> {
    constructor(
        @Inject(SCHEDULE_TEMPLATE_REPOSITORY)
        private readonly repository: ScheduleTemplateRepository,
    ) { }

    async execute(command: AddWorkingWindowCommand): Promise<{ id: string }> {
        const template = await this.repository.findById(command.templateId);

        if (!template) {
            throw new Error('Schedule template not found');
        }

        const window = DoctorWorkingWindow.create({
            id: randomUUID(),
            templateId: template.id,
            dayOfWeek: command.dayOfWeek,
            startTime: command.startTime,
            endTime: command.endTime,
            slotDurationMinutes: command.slotDurationMinutes,
            capacity: command.capacity,
        });

        template.addWorkingWindow(window);

        await this.repository.save(template);

        return { id: window.id };
    }
}