import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeleteScheduleOverrideCommand } from '../commands/delete-schedule-override.command';
import {
    ScheduleOverrideRepository,
    SCHEDULE_OVERRIDE_REPOSITORY,
} from '../ports/schedule-override.repository';

@CommandHandler(DeleteScheduleOverrideCommand)
export class DeleteScheduleOverrideHandler
    implements ICommandHandler<DeleteScheduleOverrideCommand, void> {
    constructor(
        @Inject(SCHEDULE_OVERRIDE_REPOSITORY)
        private readonly repository: ScheduleOverrideRepository,
    ) { }

    async execute(command: DeleteScheduleOverrideCommand): Promise<void> {
        const existing = await this.repository.findById(command.overrideId);

        if (!existing) {
            throw new Error('Schedule override not found');
        }

        await this.repository.delete(command.overrideId);
    }
}