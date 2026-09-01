import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ChangeDentalChairStatusCommand } from '../commands/change-dental-chair-status.command';
import { DentalChairReadModel } from '../dto/dental-chair-read-model';
import { DentalChairRepository } from '../ports/dental-chair.repository';

@CommandHandler(ChangeDentalChairStatusCommand)
export class ChangeDentalChairStatusHandler
    implements ICommandHandler<ChangeDentalChairStatusCommand, DentalChairReadModel> {
    constructor(private readonly repository: DentalChairRepository) { }

    async execute(
        command: ChangeDentalChairStatusCommand,
    ): Promise<DentalChairReadModel> {
        const chair = await this.repository.findById(command.id);

        if (!chair) {
            throw new NotFoundException('Dental chair not found.');
        }

        chair.changeStatus(command.status);

        const saved = await this.repository.save(chair);

        return {
            id: saved.id,
            clinicId: saved.clinicId,
            code: saved.code,
            name: saved.name,
            description: saved.description,
            status: saved.status,
            createdAt: saved.createdAt,
            updatedAt: saved.updatedAt,
        };
    }
}