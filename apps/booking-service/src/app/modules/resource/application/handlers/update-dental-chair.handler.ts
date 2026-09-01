import { ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateDentalChairCommand } from '../commands/update-dental-chair.command';
import { DentalChairReadModel } from '../dto/dental-chair-read-model';
import { DentalChairRepository } from '../ports/dental-chair.repository';

@CommandHandler(UpdateDentalChairCommand)
export class UpdateDentalChairHandler
    implements ICommandHandler<UpdateDentalChairCommand, DentalChairReadModel> {
    constructor(private readonly repository: DentalChairRepository) { }

    async execute(command: UpdateDentalChairCommand): Promise<DentalChairReadModel> {
        const chair = await this.repository.findById(command.id);

        if (!chair) {
            throw new NotFoundException('Dental chair not found.');
        }

        if (command.code && command.code !== chair.code) {
            const exists = await this.repository.existsByCode(
                command.code,
                chair.clinicId,
                chair.id,
            );

            if (exists) {
                throw new ConflictException('Dental chair code already exists.');
            }
        }

        chair.update({
            code: command.code,
            name: command.name,
            description: command.description,
        });

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