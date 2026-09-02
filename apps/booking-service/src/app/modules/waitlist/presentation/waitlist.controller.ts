import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiOperation,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { WaitlistEntryStatus } from '../domain/waitlist-entry-status.enum';

import { JoinWaitlistCommand } from '../application/commands/join-waitlist.command';
import { OfferWaitlistSlotCommand } from '../application/commands/offer-waitlist-slot.command';
import { AcceptWaitlistOfferCommand } from '../application/commands/accept-waitlist-offer.command';
import { CancelWaitlistEntryCommand } from '../application/commands/cancel-waitlist-entry.command';
import { ExpireWaitlistOfferCommand } from '../application/commands/expire-waitlist-offer.command';

import { GetWaitlistEntryQuery } from '../application/queries/get-waitlist-entry.query';
import { ListWaitlistEntriesQuery } from '../application/queries/list-waitlist-entries.query';
import { FindWaitlistCandidatesQuery } from '../application/queries/find-waitlist-candidates.query';

import { JoinWaitlistRequest } from './requests/join-waitlist.request';
import { OfferWaitlistSlotRequest } from './requests/offer-waitlist-slot.request';
import { AcceptWaitlistOfferRequest } from './requests/accept-waitlist-offer.request';
import { CancelWaitlistEntryRequest } from './requests/cancel-waitlist-entry.request';

@ApiTags('Waitlist')
@Controller('waitlist')
export class WaitlistController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Join appointment waitlist',
    })
    async joinWaitlist(@Body() request: JoinWaitlistRequest) {
        return this.commandBus.execute(
            new JoinWaitlistCommand({
                clinicId: request.clinicId ?? null,
                doctorId: request.doctorId,
                patientId: request.patientId,
                resourceId: request.resourceId ?? null,
                preferredStartAt: new Date(request.preferredStartAt),
                preferredEndAt: new Date(request.preferredEndAt),
                requestedDurationMinutes: request.requestedDurationMinutes,
                priority: request.priority,
                reason: request.reason ?? null,
            }),
        );
    }

    @Get()
    @ApiOperation({
        summary: 'List waitlist entries',
    })
    @ApiQuery({ name: 'clinicId', required: false })
    @ApiQuery({ name: 'doctorId', required: false })
    @ApiQuery({ name: 'patientId', required: false })
    @ApiQuery({
        name: 'status',
        required: false,
        enum: WaitlistEntryStatus,
    })
    @ApiQuery({ name: 'from', required: false })
    @ApiQuery({ name: 'to', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'offset', required: false })
    async listWaitlistEntries(
        @Query('clinicId') clinicId?: string,
        @Query('doctorId') doctorId?: string,
        @Query('patientId') patientId?: string,
        @Query('status') status?: WaitlistEntryStatus,
        @Query('from') from?: string,
        @Query('to') to?: string,
        @Query('limit') limit?: string,
        @Query('offset') offset?: string,
    ) {
        return this.queryBus.execute(
            new ListWaitlistEntriesQuery({
                clinicId: clinicId ?? undefined,
                doctorId,
                patientId,
                status,
                from: from ? new Date(from) : undefined,
                to: to ? new Date(to) : undefined,
                limit: limit ? Number(limit) : undefined,
                offset: offset ? Number(offset) : undefined,
            }),
        );
    }

    @Get('candidates')
    @ApiOperation({
        summary: 'Find waitlist candidates for an open appointment slot',
    })
    @ApiQuery({ name: 'clinicId', required: false })
    @ApiQuery({ name: 'doctorId', required: true })
    @ApiQuery({ name: 'resourceId', required: false })
    @ApiQuery({ name: 'startAt', required: true })
    @ApiQuery({ name: 'endAt', required: true })
    @ApiQuery({ name: 'limit', required: false })
    async findCandidates(
        @Query('clinicId') clinicId: string | undefined,
        @Query('doctorId') doctorId: string,
        @Query('resourceId') resourceId: string | undefined,
        @Query('startAt') startAt: string,
        @Query('endAt') endAt: string,
        @Query('limit') limit?: string,
    ) {
        return this.queryBus.execute(
            new FindWaitlistCandidatesQuery({
                clinicId: clinicId ?? null,
                doctorId,
                resourceId: resourceId ?? null,
                startAt: new Date(startAt),
                endAt: new Date(endAt),
                limit: limit ? Number(limit) : undefined,
            }),
        );
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get waitlist entry by id',
    })
    async getWaitlistEntry(@Param('id') id: string) {
        return this.queryBus.execute(new GetWaitlistEntryQuery(id));
    }

    @Patch(':id/offer')
    @ApiOperation({
        summary: 'Offer available slot to waitlist patient',
    })
    async offerSlot(
        @Param('id') id: string,
        @Body() request: OfferWaitlistSlotRequest,
    ) {
        return this.commandBus.execute(
            new OfferWaitlistSlotCommand({
                waitlistEntryId: id,
                startAt: new Date(request.startAt),
                endAt: new Date(request.endAt),
                resourceId: request.resourceId ?? null,
                ttlMinutes: request.ttlMinutes,
            }),
        );
    }

    @Patch(':id/accept')
    @ApiOperation({
        summary: 'Accept waitlist offer and convert hold to appointment',
    })
    async acceptOffer(
        @Param('id') id: string,
        @Body() request: AcceptWaitlistOfferRequest,
    ) {
        return this.commandBus.execute(
            new AcceptWaitlistOfferCommand({
                waitlistEntryId: id,
                patientId: request.patientId,
            }),
        );
    }

    @Patch(':id/cancel')
    @ApiOperation({
        summary: 'Cancel waitlist entry',
    })
    async cancelWaitlistEntry(
        @Param('id') id: string,
        @Body() request: CancelWaitlistEntryRequest,
    ) {
        return this.commandBus.execute(
            new CancelWaitlistEntryCommand({
                waitlistEntryId: id,
                reason: request.reason ?? null,
            }),
        );
    }

    @Patch(':id/expire-offer')
    @ApiOperation({
        summary: 'Expire waitlist offer and return entry to WAITING',
    })
    async expireOffer(@Param('id') id: string) {
        return this.commandBus.execute(
            new ExpireWaitlistOfferCommand({
                waitlistEntryId: id,
            }),
        );
    }
}