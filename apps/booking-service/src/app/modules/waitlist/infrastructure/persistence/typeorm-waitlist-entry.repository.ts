import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    Brackets,
    LessThanOrEqual,
    MoreThanOrEqual,
    Repository,
} from 'typeorm';

import { WaitlistEntryAggregate } from '../../domain/waitlist-entry.aggregate';
import { WaitlistEntryStatus } from '../../domain/waitlist-entry-status.enum';
import {
    FindWaitlistCandidatesFilter,
    ListWaitlistEntriesFilter,
    WaitlistEntryRepository,
} from '../../application/ports/waitlist-entry.repository';
import { WaitlistEntryOrmEntity } from './waitlist-entry.entity';
import { WaitlistEntryMapper } from './waitlist-entry.mapper';

@Injectable()
export class TypeOrmWaitlistEntryRepository implements WaitlistEntryRepository {
    constructor(
        @InjectRepository(WaitlistEntryOrmEntity)
        private readonly repository: Repository<WaitlistEntryOrmEntity>,
    ) { }

    async save(entry: WaitlistEntryAggregate): Promise<void> {
        const entity = WaitlistEntryMapper.toOrm(entry);

        await this.repository.save(entity);
    }

    async findById(id: string): Promise<WaitlistEntryAggregate | null> {
        const entity = await this.repository.findOne({
            where: { id },
        });

        return entity ? WaitlistEntryMapper.toDomain(entity) : null;
    }

    async findActiveDuplicate(params: {
        clinicId?: string | null;
        doctorId: string;
        patientId: string;
        preferredStartAt: Date;
        preferredEndAt: Date;
    }): Promise<WaitlistEntryAggregate | null> {
        const query = this.repository
            .createQueryBuilder('waitlist')
            .where('waitlist.doctorId = :doctorId', {
                doctorId: params.doctorId,
            })
            .andWhere('waitlist.patientId = :patientId', {
                patientId: params.patientId,
            })
            .andWhere('waitlist.status IN (:...statuses)', {
                statuses: [
                    WaitlistEntryStatus.WAITING,
                    WaitlistEntryStatus.OFFERED,
                ],
            })
            .andWhere(
                new Brackets((qb) => {
                    qb.where(
                        'waitlist.preferredStartAt <= :preferredEndAt',
                        {
                            preferredEndAt: params.preferredEndAt,
                        },
                    ).andWhere(
                        'waitlist.preferredEndAt >= :preferredStartAt',
                        {
                            preferredStartAt: params.preferredStartAt,
                        },
                    );
                }),
            );

        if (params.clinicId) {
            query.andWhere('waitlist.clinicId = :clinicId', {
                clinicId: params.clinicId,
            });
        } else {
            query.andWhere('waitlist.clinicId IS NULL');
        }

        const entity = await query.getOne();

        return entity ? WaitlistEntryMapper.toDomain(entity) : null;
    }

    async findMany(
        filter: ListWaitlistEntriesFilter,
    ): Promise<WaitlistEntryAggregate[]> {
        const query = this.repository.createQueryBuilder('waitlist');

        if (filter.clinicId !== undefined) {
            if (filter.clinicId === null) {
                query.andWhere('waitlist.clinicId IS NULL');
            } else {
                query.andWhere('waitlist.clinicId = :clinicId', {
                    clinicId: filter.clinicId,
                });
            }
        }

        if (filter.doctorId) {
            query.andWhere('waitlist.doctorId = :doctorId', {
                doctorId: filter.doctorId,
            });
        }

        if (filter.patientId) {
            query.andWhere('waitlist.patientId = :patientId', {
                patientId: filter.patientId,
            });
        }

        if (filter.status) {
            query.andWhere('waitlist.status = :status', {
                status: filter.status,
            });
        }

        if (filter.from) {
            query.andWhere('waitlist.preferredEndAt >= :from', {
                from: filter.from,
            });
        }

        if (filter.to) {
            query.andWhere('waitlist.preferredStartAt <= :to', {
                to: filter.to,
            });
        }

        query
            .orderBy('waitlist.priority', 'DESC')
            .addOrderBy('waitlist.createdAt', 'ASC')
            .take(filter.limit ?? 50)
            .skip(filter.offset ?? 0);

        const entities = await query.getMany();

        return entities.map(WaitlistEntryMapper.toDomain);
    }

    async findCandidatesForSlot(
        filter: FindWaitlistCandidatesFilter,
    ): Promise<WaitlistEntryAggregate[]> {
        const slotMinutes =
            (filter.endAt.getTime() - filter.startAt.getTime()) / 60_000;

        const query = this.repository
            .createQueryBuilder('waitlist')
            .where('waitlist.status = :status', {
                status: WaitlistEntryStatus.WAITING,
            })
            .andWhere('waitlist.doctorId = :doctorId', {
                doctorId: filter.doctorId,
            })
            .andWhere('waitlist.preferredStartAt <= :startAt', {
                startAt: filter.startAt,
            })
            .andWhere('waitlist.preferredEndAt >= :endAt', {
                endAt: filter.endAt,
            })
            .andWhere(
                'waitlist.requestedDurationMinutes <= :slotMinutes',
                {
                    slotMinutes,
                },
            )
            .andWhere(
                new Brackets((qb) => {
                    qb.where('waitlist.resourceId IS NULL');

                    if (filter.resourceId) {
                        qb.orWhere('waitlist.resourceId = :resourceId', {
                            resourceId: filter.resourceId,
                        });
                    }
                }),
            );

        if (filter.clinicId) {
            query.andWhere('waitlist.clinicId = :clinicId', {
                clinicId: filter.clinicId,
            });
        }

        query
            .orderBy('waitlist.priority', 'DESC')
            .addOrderBy('waitlist.createdAt', 'ASC')
            .take(filter.limit ?? 20);

        const entities = await query.getMany();

        return entities.map(WaitlistEntryMapper.toDomain);
    }

    async findExpiredOffers(params: {
        now: Date;
        limit?: number;
    }): Promise<WaitlistEntryAggregate[]> {
        const entities = await this.repository.find({
            where: {
                status: WaitlistEntryStatus.OFFERED,
                offerExpiresAt: LessThanOrEqual(params.now),
            },
            take: params.limit ?? 100,
            order: {
                offerExpiresAt: 'ASC',
            },
        });

        return entities.map(WaitlistEntryMapper.toDomain);
    }
}