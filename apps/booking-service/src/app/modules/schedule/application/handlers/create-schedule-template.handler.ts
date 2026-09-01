import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';

import { CreateScheduleTemplateCommand } from '../commands/create-schedule-template.command';
import {
    ScheduleTemplateRepository,
    SCHEDULE_TEMPLATE_REPOSITORY,
} from '../ports/schedule-template.repository';
import { DoctorScheduleTemplate } from '../../domain/doctor-schedule-template.aggregate';

@CommandHandler(CreateScheduleTemplateCommand)
export class CreateScheduleTemplateHandler
    implements ICommandHandler<CreateScheduleTemplateCommand, { id: string }> {
    constructor(
        @Inject(SCHEDULE_TEMPLATE_REPOSITORY)
        private readonly repository: ScheduleTemplateRepository,
    ) { }

    async execute(command: CreateScheduleTemplateCommand): Promise<{ id: string }> {
        const existing = await this.repository.findActiveByDoctorId(command.doctorId);

        if (existing) {
            throw new Error('Doctor already has an active schedule template');
        }

        const template = DoctorScheduleTemplate.create({
            id: randomUUID(),
            doctorId: command.doctorId,
            clinicId: command.clinicId,
            timezone: command.timezone,
            effectiveFrom: command.effectiveFrom,
            effectiveTo: command.effectiveTo,
            isActive: true,
            workingWindows: [],
            breakTimes: [],
        });

        await this.repository.save(template);

        return { id: template.id };
    }
}