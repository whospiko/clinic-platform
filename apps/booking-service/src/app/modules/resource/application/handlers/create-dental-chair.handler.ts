import { ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateDentalChairCommand } from '../commands/create-dental-chair.command';
import { DentalChairReadModel } from '../dto/dental-chair-read-model';
import { DentalChairRepository } from '../ports/dental-chair.repository';

import { DentalChairAggregate } from '../../domain/dental-chair.aggregate';

@CommandHandler(CreateDentalChairCommand)
export class CreateDentalChairHandler
    implements ICommandHandler<CreateDentalChairCommand, DentalChairReadModel> {
    constructor(private readonly repository: DentalChairRepository) { }

    async execute(command: CreateDentalChairCommand): Promise<DentalChairReadModel> {
        const exists = await this.repository.existsByCode(
            command.code,
            command.clinicId,
        );

        if (exists) {
            throw new ConflictException('Dental chair code already exists.');
        }

        const chair = DentalChairAggregate.create({
            clinicId: command.clinicId,
            code: command.code,
            name: command.name,
            description: command.description,
            status: command.status,
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